import { getDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export type OrderStatus = "pending" | "completed" | "failed" | "refunded";

export interface ShopOrder {
  _id: ObjectId;
  oderId: string;
  userId?: string;
  playerUuid?: string;
  productId: string;
  stripeSessionId: string;
  amount: number;
  status: OrderStatus;
  giftRecipient?: string;
  createdAt: Date;
  completedAt?: Date;
}

export async function createOrder(order: Omit<ShopOrder, "_id" | "createdAt">): Promise<string> {
  const db = await getDatabase();
  const result = await db.collection("shop_orders").insertOne({
    ...order,
    createdAt: new Date(),
  });
  return result.insertedId.toString();
}

export async function getOrderBySessionId(sessionId: string): Promise<ShopOrder | null> {
  const db = await getDatabase();
  return db.collection<ShopOrder>("shop_orders").findOne({ stripeSessionId: sessionId });
}

export async function updateOrderStatus(sessionId: string, status: OrderStatus): Promise<void> {
  const db = await getDatabase();
  await db.collection("shop_orders").updateOne(
    { stripeSessionId: sessionId },
    { 
      $set: { 
        status, 
        completedAt: status === "completed" ? new Date() : undefined 
      } 
    }
  );
}

export async function getOrdersByUserId(userId: string): Promise<ShopOrder[]> {
  const db = await getDatabase();
  return db.collection<ShopOrder>("shop_orders")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
}
