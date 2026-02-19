import { getDatabase } from "../src/lib/db";
import { ObjectId } from "mongodb";

async function migrate() {
  const db = await getDatabase();

  console.log("Finding completed orders...");
  const orders = await db.collection("shop_orders")
    .find({ status: "completed" })
    .toArray();

  console.log(`Found ${orders.length} completed orders`);

  for (const order of orders) {
    const product = await db.collection("shop_products").findOne({ 
      _id: new ObjectId(order.productId) 
    });

    let discordId: string | undefined;
    if (order.userId) {
      const linked = await db.collection("account").findOne({ 
        userId: new ObjectId(order.userId),
        providerId: "discord"
      });
      discordId = linked?.accountId;
    }

    const billingType = product?.billingType || "one_time";
    const durationDays = product?.durationDays || 30;
    const expiresAt = billingType === "one_time" 
      ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)
      : undefined;

    const pending = {
      oderId: order.orderId,
      userId: order.userId,
      discordId,
      stripeSessionId: order.stripeSessionId,
      stripeSubscriptionId: undefined,
      productId: order.productId,
      productName: product?.name || "Unknown",
      productCategory: product?.category || "item",
      billingType,
      durationDays,
      recipientUsername: order.giftRecipient || "",
      isGift: false,
      amount: order.amount,
      status: "fulfilled",
      subscriptionStatus: undefined,
      currentPeriodStart: undefined,
      currentPeriodEnd: undefined,
      expiresAt,
      createdAt: order.createdAt,
    };

    await db.collection("shop_pending").insertOne(pending);
    console.log(`Inserted: ${order.orderId}`);
  }

  console.log("Migration complete!");
}

migrate().catch(console.error);
