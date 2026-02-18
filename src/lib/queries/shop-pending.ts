import { getDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export interface PendingPurchase {
  _id: ObjectId;
  oderId: string;
  userId?: string;
  stripeSessionId: string;
  productId: string;
  productName: string;
  productCategory: "rank" | "item";
  billingType: "one_time" | "subscription" | "lifetime";
  durationDays?: number;
  recipientUsername: string;
  isGift: boolean;
  amount: number;
  status: "pending" | "completed" | "fulfilled" | "failed";
  createdAt: Date;
  expiresAt?: Date;
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
