import { getDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export interface CartItem {
  _id: ObjectId;
  sessionId: string;
  userId?: string;
  productId: string;
  quantity: number;
  giftRecipient?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getCartBySession(sessionId: string, userId?: string): Promise<CartItem[]> {
  const db = await getDatabase();
  const query = userId 
    ? { $or: [{ sessionId }, { userId }] }
    : { sessionId };
  
  return db.collection<CartItem>("cart")
    .find(query)
    .toArray();
}

export async function addToCart(
  sessionId: string, 
  productId: string, 
  quantity: number = 1,
  userId?: string,
  giftRecipient?: string
): Promise<void> {
  const db = await getDatabase();
  
  const existing = await db.collection<CartItem>("cart").findOne({
    sessionId,
    productId,
    ...(userId && { userId }),
  });

  if (existing) {
    await db.collection("cart").updateOne(
      { _id: existing._id },
      { $set: { quantity: existing.quantity + quantity, updatedAt: new Date() } }
    );
  } else {
    await db.collection("cart").insertOne({
      sessionId,
      userId,
      productId,
      quantity,
      giftRecipient,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

export async function updateCartItem(
  itemId: string,
  updates: { quantity?: number; giftRecipient?: string }
): Promise<void> {
  const db = await getDatabase();
  await db.collection("cart").updateOne(
    { _id: new ObjectId(itemId) },
    { $set: { ...updates, updatedAt: new Date() } }
  );
}

export async function removeFromCart(itemId: string): Promise<void> {
  const db = await getDatabase();
  await db.collection("cart").deleteOne({ _id: new ObjectId(itemId) });
}

export async function clearCart(sessionId: string, userId?: string): Promise<void> {
  const db = await getDatabase();
  const query = userId 
    ? { $or: [{ sessionId }, { userId }] }
    : { sessionId };
  
  await db.collection("cart").deleteMany(query);
}

export async function mergeCart(sessionId: string, userId: string): Promise<void> {
  const db = await getDatabase();
  
  const guestCart = await db.collection<CartItem>("cart").find({ sessionId }).toArray();
  
  for (const item of guestCart) {
    const existing = await db.collection<CartItem>("cart").findOne({
      userId,
      productId: item.productId,
    });

    if (existing) {
      await db.collection("cart").updateOne(
        { _id: existing._id },
        { $set: { quantity: existing.quantity + item.quantity, updatedAt: new Date() } }
      );
      await db.collection("cart").deleteOne({ _id: item._id });
    } else {
      await db.collection("cart").updateOne(
        { _id: item._id },
        { $set: { userId, sessionId, updatedAt: new Date() } }
      );
    }
  }
}
