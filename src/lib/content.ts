import fs from "node:fs/promises"
import path from "node:path"
import matter from "gray-matter"
import { compileMDX } from "next-mdx-remote/rsc"
import { Video, VideoEmbed } from "@/components/mdx/Video"

const contentRoot = path.join(process.cwd(), "content")

type ContentType = "news" | "guides"

type ContentConfig = {
  dir: string
}

const contentTypeConfig: Record<ContentType, ContentConfig> = {
  news: { dir: "news" },
  guides: { dir: "guides" },
}

export type NewsFrontmatter = {
  title: string
  date: string
  author?: string
  summary: string
  image?: string
  category?: string
}

export type GuideFrontmatter = {
  title: string
  category: string
  order?: number
  summary: string
  image?: string
}

export type NewsPost = NewsFrontmatter & {
  slug: string
  image?: string
}

export type GuidePost = GuideFrontmatter & {
  slug: string
  image?: string
}

const parseSlug = (filename: string) => filename.replace(/\.mdx$/, "")

async function readContentFile(contentType: ContentType, slug: string) {
  const filePath = path.join(contentRoot, contentTypeConfig[contentType].dir, `${slug}.mdx`)
  try {
    const raw = await fs.readFile(filePath, "utf8")
    return matter(raw)
  } catch {
    return null
  }
}

async function getContentSlugs(contentType: ContentType) {
  const dirPath = path.join(contentRoot, contentTypeConfig[contentType].dir)
  try {
    const files = await fs.readdir(dirPath)
    return files.filter((file) => file.endsWith(".mdx")).map(parseSlug)
  } catch {
    return []
  }
}

function toNewsPost(slug: string, data: Record<string, unknown>): NewsPost {
  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    author: data.author as string | undefined,
    summary: data.summary as string,
    image: data.image as string | undefined,
    category: data.category as string | undefined,
  }
}

function toGuidePost(slug: string, data: Record<string, unknown>): GuidePost {
  return {
    slug,
    title: data.title as string,
    category: data.category as string,
    order: data.order ? Number(data.order) : undefined,
    summary: data.summary as string,
    image: data.image as string | undefined,
  }
}

export async function getAllNewsPosts() {
  const slugs = await getContentSlugs("news")
  const posts: NewsPost[] = []
  
  for (const slug of slugs) {
    const file = await readContentFile("news", slug)
    if (file) {
      posts.push(toNewsPost(slug, file.data))
    }
  }

  return posts.sort((a, b) => {
    if (!a.date || !b.date) {
      return 0
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export async function getAllGuidePosts() {
  const slugs = await getContentSlugs("guides")
  const posts: GuidePost[] = []
  
  for (const slug of slugs) {
    const file = await readContentFile("guides", slug)
    if (file) {
      posts.push(toGuidePost(slug, file.data))
    }
  }

  return posts.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category)
    }

    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order
    }

    if (a.order !== undefined) {
      return -1
    }

    if (b.order !== undefined) {
      return 1
    }

    return a.title.localeCompare(b.title)
  })
}

export async function getNewsPost(slug: string) {
  const file = await readContentFile("news", slug)
  if (!file) return null
  
  const { content: renderedContent } = await compileMDX({
    source: file.content,
    options: { parseFrontmatter: false },
    components: { Video, VideoEmbed },
  })

  return {
    ...toNewsPost(slug, file.data),
    content: renderedContent,
  }
}

export async function getGuidePost(slug: string) {
  const file = await readContentFile("guides", slug)
  if (!file) return null
  
  const { content: renderedContent } = await compileMDX({
    source: file.content,
    options: { parseFrontmatter: false },
    components: { Video, VideoEmbed },
  })

  return {
    ...toGuidePost(slug, file.data),
    content: renderedContent,
  }
}
