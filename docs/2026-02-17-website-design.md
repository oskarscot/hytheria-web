# Hytheria Website Design

## Purpose

A website for the Hytheria game server that serves four roles:

1. **Landing page** — attract new players, explain what Hytheria is
2. **Player dashboard** — authenticated players view their stats, island, quests
3. **Community hub** — news, guides, Discord integration
4. **Leaderboards** — public rankings across multiple categories

## Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Auth:** BetterAuth with Discord OAuth provider
- **Database:** MongoDB (shared with game server, read-only from website)
- **Content:** MDX files for news and guides
- **Styling:** TBD (UI framework decision deferred)
- **Deployment:** TBD (Vercel or self-hosted Docker)

## Architecture

### Data flow

The game server is the sole writer to MongoDB. The website only reads.

```
Game Server ──writes──> MongoDB <──reads── Next.js Website
```

The website never mutates game data. Auth-related data (sessions, linked accounts) lives in separate collections that the website owns.

### Rendering strategy

- **Public pages** (landing, features, leaderboards, news, guides): Server Components. No client JavaScript unless interactive widgets are needed. SEO-friendly, fast initial load.
- **Dashboard pages**: Server Components for data fetching, Client Components for interactive elements (charts, filters, real-time updates).
- **MDX content**: Rendered at build time or on-demand with ISR.

### Caching

- Public leaderboards: revalidate every 60 seconds via Next.js ISR
- Dashboard queries: per-request with short TTL (10-30s) using `unstable_cache` or a simple in-memory cache
- MDX content: rebuilt on deploy (static) or revalidated on demand
- No Redis required initially — Next.js built-in caching is sufficient to start

## Authentication

### Provider

BetterAuth with Discord OAuth. Players log in with their Discord account.

### Account linking

Discord login alone does not identify a player's in-game account. A linking step is required:

1. Player runs `/link` in-game (to be implemented later)
2. Command generates a one-time code (6 characters, expires in 5 minutes)
3. Player enters the code on the website's `/dashboard/link` page
4. Website writes a record mapping `discordId <-> playerUuid` to a `linked_accounts` collection
5. All subsequent dashboard queries use the resolved `playerUuid`

### Data model

```
linked_accounts collection:
{
  discordId: string,       // from Discord OAuth
  playerUuid: string,      // in-game UUID
  linkedAt: Date,
  linkedBy: "code"         // method used to link
}
```

BetterAuth manages its own collections for users and sessions (`ba_users`, `ba_sessions`, etc.).

### Authorization rules

- Public pages: no auth required
- Dashboard pages: require authenticated session
- Dashboard data: only return data for the player's own linked UUID
- API routes: validate session and ownership on every request
- No admin panel in v1

## Database Access

### Connection

Single MongoDB client instance, initialized once and reused across requests (standard Next.js pattern with a cached client in `lib/db.ts`).

```typescript
// lib/db.ts
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const clientPromise = client.connect();

export default clientPromise;
```

### Collections read by the website

These are owned by the game server. The website reads them but never writes:

| Collection | Used for | Dashboard? |
|---|---|---|
| Player data | Stats, coins, skills, levels | Yes |
| Quest progress | Quest state, objective progress | Yes |
| Island data | Island level, members, settings | Yes |
| Leaderboard data | Rankings by category | No (public) |

Exact collection names depend on the game server's MongoDB schema.

### Query layer

All database queries live in `lib/queries/`. Each file exports async functions that:

1. Get the MongoDB client
2. Query the relevant collection
3. Transform the result into a typed DTO
4. Are wrapped with caching where appropriate

```
lib/queries/
  player.ts        # getPlayerStats(uuid), getPlayerSkills(uuid)
  quests.ts        # getQuestProgress(uuid), getCompletedQuests(uuid)
  island.ts        # getIslandInfo(uuid), getIslandMembers(uuid)
  leaderboards.ts  # getLeaderboard(category, page)
```

The website never constructs raw MongoDB queries in page components — always go through the query layer.

## Page Structure

### Public pages

```
/                    Landing page
/features            Server features showcase
/leaderboards        Leaderboard rankings (tabbed by category)
/news                News/announcement index
/news/[slug]         Individual news post
/guides              Guide index (grouped by category)
/guides/[slug]       Individual guide
/community           Discord widget, links, server status
```

### Authenticated pages

```
/dashboard           Player overview (stats, coins, skills summary)
/dashboard/island    Island details (level, members, upgrades)
/dashboard/quests    Quest progress (active, completed, claimable)
/dashboard/link      Account linking (enter in-game code)
/dashboard/settings  Notification preferences, unlink account
```

### API routes

```
/api/auth/*           BetterAuth handlers (login, callback, session, logout)
/api/leaderboards     GET — public leaderboard data, query params: category, page
/api/player/[uuid]    GET — player stats (authed, own UUID only)
/api/island/[uuid]    GET — island info (authed, own island only)
/api/quests/[uuid]    GET — quest progress (authed, own UUID only)
/api/link             POST — submit linking code (authed)
```

## Page Details

### Landing page (`/`)

Purpose: first impression, explain what Hytheria is, drive players to join.

Sections (top to bottom):
1. **Hero** — server name, tagline, short description, "Join Now" CTA with server IP
2. **What is Hytheria** — brief explanation of the skyblock experience on Orbis
3. **Features** — 3-4 highlight cards (islands, quests, skills, dungeons)
4. **Player count / stats** — live or cached numbers (total players, islands created)
5. **Latest news** — 2-3 most recent news posts
6. **Footer** — Discord link, social links, copyright

All static/ISR. No client JavaScript required.

### Leaderboards (`/leaderboards`)

Tabs for categories:
- Coins
- Island level
- Individual skills (farming, mining, etc.)
- Dungeon progress
- Quest completion count

Each tab shows a paginated table: rank, player name, value. Top 100 per category. Data revalidates every 60 seconds.

Public page, no auth required.

### News (`/news`, `/news/[slug]`)

MDX-based. Posts stored in the repository:

```
content/news/
  2026-02-17-server-launch.mdx
  2026-02-20-first-update.mdx
```

Frontmatter schema:

```yaml
---
title: "Server Launch"
date: "2026-02-17"
author: "Oskar"
summary: "Hytheria is now live!"
thumbnail: "/images/news/launch.png"   # optional
---
```

Index page: cards with title, date, summary, thumbnail. Sorted by date descending.

Post page: full MDX content rendered with standard prose styling. Supports images, code blocks, embedded components if needed.

### Guides (`/guides`, `/guides/[slug]`)

Same MDX approach as news, different directory:

```
content/guides/
  getting-started.mdx
  island-upgrades.mdx
  skill-leveling.mdx
  dungeon-guide.mdx
```

Frontmatter schema:

```yaml
---
title: "Getting Started"
category: "Basics"
order: 1
summary: "Your first steps in Hytheria"
---
```

Index page: guides grouped by category, ordered by `order` field. Sidebar navigation on guide pages showing all guides in the current category.

### Dashboard — Overview (`/dashboard`)

Requires auth + linked account. If not linked, redirects to `/dashboard/link`.

Shows at a glance:
- Player name and avatar
- Coin balance
- Skill levels (compact grid or bar chart)
- Active quest with progress
- Island summary (level, member count)

All data fetched server-side from MongoDB via the query layer.

### Dashboard — Island (`/dashboard/island`)

- Island level and XP progress
- Member list with roles
- Upgrade status (minions, storage, etc.)
- Island creation date

### Dashboard — Quests (`/dashboard/quests`)

- Active quests with objective progress bars
- Completed quests (collapsible history)
- Claimable rewards indicator
- Quest line visualization (which quests unlock which)

### Dashboard — Link (`/dashboard/link`)

Simple form:
1. Instructions: "Run `/link` in-game to get a code"
2. Text input for the 6-character code
3. Submit button
4. Success/error feedback
5. Once linked, shows linked player name with option to unlink

### Community (`/community`)

- Discord server widget (iframe embed showing online members)
- Invite link button
- Server status indicator (optional, can ping game server)
- Links to social media if applicable

## Content System

### MDX processing

Use `next-mdx-remote` for rendering MDX content. This allows:
- Server-side rendering of markdown
- Custom components embeddable in posts (callouts, item displays, etc.)
- Frontmatter parsing for metadata

### Content workflow

1. Write `.mdx` file in the appropriate `content/` subdirectory
2. Commit and push
3. Site rebuilds (or revalidates) to include new content
4. No CMS, no database for content — it's all in the repo

### Image handling

News and guide images stored in `public/images/news/` and `public/images/guides/`. Referenced in MDX with standard markdown image syntax. Next.js `<Image>` component used where optimization matters.

## Project Structure

```
website/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout (nav, footer)
│   │   ├── page.tsx                   # Landing page
│   │   ├── features/
│   │   │   └── page.tsx
│   │   ├── leaderboards/
│   │   │   └── page.tsx
│   │   ├── news/
│   │   │   ├── page.tsx               # News index
│   │   │   └── [slug]/
│   │   │       └── page.tsx           # Individual post
│   │   ├── guides/
│   │   │   ├── page.tsx               # Guide index
│   │   │   └── [slug]/
│   │   │       └── page.tsx           # Individual guide
│   │   ├── community/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx             # Dashboard layout (sidebar, auth guard)
│   │   │   ├── page.tsx               # Overview
│   │   │   ├── island/
│   │   │   │   └── page.tsx
│   │   │   ├── quests/
│   │   │   │   └── page.tsx
│   │   │   ├── link/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...all]/
│   │       │       └── route.ts       # BetterAuth catch-all
│   │       ├── leaderboards/
│   │       │   └── route.ts
│   │       ├── player/
│   │       │   └── [uuid]/
│   │       │       └── route.ts
│   │       ├── island/
│   │       │   └── [uuid]/
│   │       │       └── route.ts
│   │       ├── quests/
│   │       │   └── [uuid]/
│   │       │       └── route.ts
│   │       └── link/
│   │           └── route.ts
│   ├── components/                    # Shared UI components
│   ├── lib/
│   │   ├── auth.ts                    # BetterAuth configuration
│   │   ├── db.ts                      # MongoDB client singleton
│   │   └── queries/
│   │       ├── player.ts
│   │       ├── quests.ts
│   │       ├── island.ts
│   │       └── leaderboards.ts
│   └── types/                         # TypeScript types/interfaces
│       ├── player.ts
│       ├── quest.ts
│       ├── island.ts
│       └── leaderboard.ts
├── content/
│   ├── news/                          # MDX news posts
│   └── guides/                        # MDX guide articles
├── public/
│   └── images/
│       ├── news/
│       └── guides/
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.local                         # MONGODB_URI, DISCORD_CLIENT_ID, etc.
```

## Environment Variables

```
MONGODB_URI=mongodb://...              # Connection to game server's MongoDB
BETTER_AUTH_SECRET=...                  # BetterAuth session secret
DISCORD_CLIENT_ID=...                  # Discord OAuth app client ID
DISCORD_CLIENT_SECRET=...              # Discord OAuth app client secret
NEXT_PUBLIC_SITE_URL=https://...       # Public site URL
```

## Security Considerations

- **Read-only database access:** The MongoDB user the website connects with should have read-only permissions on game data collections. Write access only to auth/linking collections.
- **UUID ownership:** Every dashboard API route must verify the requested UUID matches the authenticated user's linked account. Never trust client-provided UUIDs without checking.
- **Rate limiting:** Apply rate limiting to the `/api/link` endpoint to prevent brute-forcing codes.
- **CORS:** API routes should not need CORS headers since all requests come from the same Next.js app (server-side fetching). If external access is needed later, add explicit allowlists.
- **Environment secrets:** Never expose `MONGODB_URI` or `BETTER_AUTH_SECRET` to the client. These are server-only.
- **Linking codes:** Expire after 5 minutes, single-use, stored in a `linking_codes` collection with TTL index for automatic cleanup.

## Future Considerations

These are explicitly out of scope for v1 but worth noting:

- **Admin panel** — manage news, view player reports, moderate
- **Server status** — real-time player count, server uptime
- **Store/donations** — rank purchases, cosmetics (needs payment integration)
- **Forums** — threaded discussions (likely better served by Discord or a dedicated tool)
- **Real-time updates** — WebSocket connection for live dashboard data
- **Notifications** — email or Discord DM when quests complete, island events
- **Mobile app** — React Native sharing components with the website
- **i18n** — multi-language support
