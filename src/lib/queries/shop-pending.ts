import { getDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export interface PendingPurchase {
  _id: ObjectId;
  orderId: string;
  userId?: string;
  discordId?: string;
  stripeSessionId: string;
  stripeSubscriptionId?: string;
  productId: string;
  productName: string;
  productCategory: "rank" | "item";
  billingType: "one_time" | "subscription" | "lifetime";
  durationDays?: number;
  recipientUsername: string;
  isGift: boolean;
  amount: number;
  status: "pending" | "completed" | "fulfilled" | "failed";
  subscriptionStatus?: "active" | "canceled" | "past_due" | "unpaid" | "incomplete" | "incomplete_expired";
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  expiresAt?: Date;
  createdAt: Date;
}

export async function createPendingPurchase(purchase: Omit<PendingPurchase, "_id" | "createdAt">): Promise<string> {
  const db = await getDatabase();
  const result = await db.collection("shop_pending").insertOne({
    ...purchase,
    createdAt: new Date(),
  });
  return result.insertedId.toString();
}

export async function getPendingPurchases(): Promise<PendingPurchase[]> {
  const db = await getDatabase();
  return db.collection<PendingPurchase>("shop_pending")
    .find({ status: "pending" })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getPendingPurchaseById(id: string): Promise<PendingPurchase | null> {
  const db = await getDatabase();
  return db.collection<PendingPurchase>("shop_pending").findOne({ _id: new ObjectId(id) });
}

export async function fulfillPendingPurchase(id: string): Promise<void> {
  const db = await getDatabase();
  await db.collection("shop_pending").updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: "fulfilled" } }
  );
}

export async function failPendingPurchase(id: string): Promise<void> {
  const db = await getDatabase();
  await db.collection("shop_pending").updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: "failed" } }
  );
}

export interface ActiveSubscription {
  _id: ObjectId;
  orderId: string;
  userId?: string;
  discordId?: string;
  stripeSubscriptionId: string;
  stripeCustomerId?: string;
  productId: string;
  productName: string;
  productCategory: "rank" | "item";
  recipientUsername: string;
  isGift: boolean;
  status: "active" | "canceled" | "past_due" | "unpaid" | "incomplete" | "incomplete_expired";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  canceledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export async function createActiveSubscription(subscription: Omit<ActiveSubscription, "_id" | "createdAt" | "updatedAt">): Promise<string> {
  const db = await getDatabase();
  const result = await db.collection("active_subscriptions").insertOne({
    ...subscription,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result.insertedId.toString();
}

export async function updateActiveSubscription(stripeSubscriptionId: string, updates: Partial<ActiveSubscription>): Promise<void> {
  const db = await getDatabase();
  await db.collection("active_subscriptions").updateOne(
    { stripeSubscriptionId },
    { $set: { ...updates, updatedAt: new Date() } }
  );
}

export async function getActiveSubscriptionByStripeId(stripeSubscriptionId: string): Promise<ActiveSubscription | null> {
  const db = await getDatabase();
  return db.collection<ActiveSubscription>("active_subscriptions").findOne({ stripeSubscriptionId });
}

export async function getActiveSubscriptionsByUserId(userId: string): Promise<ActiveSubscription[]> {
  const db = await getDatabase();
  return db.collection<ActiveSubscription>("active_subscriptions")
    .find({ userId, status: "active" })
    .toArray();
}

export async function getPurchasesByUserId(userId: string): Promise<PendingPurchase[]> {
  const db = await getDatabase();
  return db.collection<PendingPurchase>("shop_pending")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
}
