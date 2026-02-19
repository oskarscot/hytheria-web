import { getDatabase } from "@/lib/db";
import { ObjectId, UUID } from "mongodb";

export interface LinkedAccount {
  userId: string;
  discordId: string;
  playerUuid: string;
  linkedAt: Date;
  linkedBy: "code";
}

export interface LinkingCodeRecord {
  code: string;
  playerUuid: string;
  expiresAt: Date;
  usedAt?: Date;
}

export interface LinkedAccountWithPlayer {
  linkedAccount: LinkedAccount;
  player: { uuid: string; lastKnownName: string } | null;
}

export async function getLinkedAccountByDiscordId(
  discordId: string
): Promise<LinkedAccount | null> {
  const db = await getDatabase();
  const record = await db.collection("linked_accounts").findOne({ discordId });

  if (!record) {
    return null;
  }

  return {
    userId: record.userId,
    discordId: record.discordId,
    playerUuid: record.playerUuid,
    linkedAt: record.linkedAt ? new Date(record.linkedAt) : new Date(0),
    linkedBy: record.linkedBy ?? "code",
  };
}

export async function getLinkedAccountByUserId(
  userId: string
): Promise<LinkedAccount | null> {
  const db = await getDatabase();
  const record = await db.collection("linked_accounts").findOne({ userId });

  if (!record) {
    return null;
  }

  return {
    userId: record.userId,
    discordId: record.discordId,
    playerUuid: record.playerUuid,
    linkedAt: record.linkedAt ? new Date(record.linkedAt) : new Date(0),
    linkedBy: record.linkedBy ?? "code",
  };
}

export async function getDiscordAccountId(userId: string): Promise<string | null> {
  const db = await getDatabase();
  const account = await db.collection("account").findOne({
    userId: new ObjectId(userId),
    providerId: "discord",
  });
  return account?.accountId ?? null;
}

export async function getLinkedAccountWithPlayer(
  userId: string
): Promise<LinkedAccountWithPlayer | null> {
  const db = await getDatabase();
  const linkedAccount = await db.collection("linked_accounts").findOne({ userId });

  if (!linkedAccount) {
    return null;
  }

  const player = await db
    .collection("players")
    .findOne({ _id: new UUID(linkedAccount.playerUuid) as unknown as never });

  return {
    linkedAccount: {
      userId: linkedAccount.userId,
      discordId: linkedAccount.discordId,
      playerUuid: linkedAccount.playerUuid,
      linkedAt: linkedAccount.linkedAt ? new Date(linkedAccount.linkedAt) : new Date(0),
      linkedBy: linkedAccount.linkedBy ?? "code",
    },
    player: player
      ? {
          uuid: player._id?.toString() ?? linkedAccount.playerUuid,
          lastKnownName: player.lastKnownName ?? "Unknown",
        }
      : null,
  };
}

export async function createLinkedAccountByCode(
  userId: string,
  discordId: string,
  code: string
): Promise<LinkedAccount | null> {
  const db = await getDatabase();
  const now = new Date();

  const linkingCode = await db.collection("linking_codes").findOne({ code });

  if (!linkingCode) {
    return null;
  }

  const expiresAt = linkingCode.expiresAt ? new Date(linkingCode.expiresAt) : null;

  if (expiresAt && expiresAt <= now) {
    return null;
  }

  if (linkingCode.usedAt) {
    return null;
  }

  const linkedAccount: LinkedAccount = {
    userId,
    discordId,
    playerUuid: linkingCode.playerUuid,
    linkedAt: now,
    linkedBy: "code",
  };

  await db.collection("linked_accounts").updateOne(
    { userId },
    {
      $set: {
        ...linkedAccount,
      },
    },
    { upsert: true }
  );

  await db.collection("linking_codes").updateOne(
    { _id: linkingCode._id },
    { $set: { usedAt: now } }
  );

  return linkedAccount;
}
