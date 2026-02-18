import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import clientPromise, { getDatabase } from "@/lib/db";

const mongoClient = await clientPromise;
const mongoDb = await getDatabase();

export const auth = betterAuth({
  appName: "Hytheria",
  baseURL: process.env.BETTER_AUTH_URL,
  database: mongodbAdapter(mongoDb),
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      redirectURI: process.env.DISCORD_REDIRECT_URI,
    },
  },
  trustedOrigins: [process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"],
  plugins: [nextCookies()],
});
