import { getDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export type ProductCategory = "rank" | "item";
export type RankBillingType = "one_time" | "subscription" | "lifetime";

export interface ShopProduct {
  _id: ObjectId;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  billingType?: RankBillingType;
  imageUrl?: string;
  benefits: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function getActiveProducts(): Promise<ShopProduct[]> {
  const db = await getDatabase();
  return db.collection<ShopProduct>("shop_products")
    .find({ isActive: true })
    .sort({ sortOrder: 1 })
    .toArray();
}

export async function getProductById(id: string): Promise<ShopProduct | null> {
  const db = await getDatabase();
  return db.collection<ShopProduct>("shop_products").findOne({ _id: new ObjectId(id) });
}

export async function getAllProducts(): Promise<ShopProduct[]> {
  const db = await getDatabase();
  return db.collection<ShopProduct>("shop_products")
    .find({})
    .sort({ sortOrder: 1 })
    .toArray();
}

export async function createProduct(product: Omit<ShopProduct, "_id" | "createdAt" | "updatedAt">): Promise<string> {
  const db = await getDatabase();
  const result = await db.collection("shop_products").insertOne({
    ...product,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result.insertedId.toString();
}

export async function updateProduct(id: string, product: Partial<ShopProduct>): Promise<void> {
  const db = await getDatabase();
  await db.collection("shop_products").updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...product, updatedAt: new Date() } }
  );
}

export async function deleteProduct(id: string): Promise<void> {
  const db = await getDatabase();
  await db.collection("shop_products").deleteOne({ _id: new ObjectId(id) });
}

export async function getShopAdmins(): Promise<string[]> {
  const db = await getDatabase();
  const setting = await db.collection("settings").findOne({ key: "shop_admins" });
  return setting?.value ?? [];
}

export async function addShopAdmin(discordId: string): Promise<void> {
  const db = await getDatabase();
  await db.collection("settings").updateOne(
    { key: "shop_admins" },
    { $addToSet: { value: discordId } },
    { upsert: true }
  );
}

export async function removeShopAdmin(discordId: string): Promise<void> {
  const db = await getDatabase();
  await db.collection("settings").updateOne(
    { key: "shop_admins" },
    { $pull: { value: discordId as any } }
  );
}

export async function isShopAdmin(discordId: string): Promise<boolean> {
  const admins = await getShopAdmins();
  return admins.includes(discordId);
}
