import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { updateOrderStatus, getOrderBySessionId, createOrder } from "@/lib/queries/orders";
import { getProductById } from "@/lib/queries/shop";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    
    const cartData = session.metadata?.cart ? JSON.parse(session.metadata.cart) : null;

    if (cartData && cartData.length > 0) {
      // Handle cart checkout (multiple items)
      for (const item of cartData) {
        const product = await getProductById(item.productId);
        const itemAmount = product ? product.price * item.quantity : 0;

        await createOrder({
          oderId: `ord_${Date.now()}_${item.productId}`,
          userId: session.metadata?.userId || undefined,
          productId: item.productId,
          stripeSessionId: session.id,
          amount: itemAmount,
          status: "completed",
          giftRecipient: item.giftRecipient || undefined,
        });

        if (product) {
          console.log("Granting purchase:", {
            product: product.name,
            recipient: item.giftRecipient || "self",
            billingType: product.billingType,
          });
        }
      }
    } else {
      // Handle single product checkout (legacy)
      await updateOrderStatus(session.id, "completed");

      const order = await getOrderBySessionId(session.id);
      if (order) {
        const product = await getProductById(order.productId);
        if (product) {
          console.log("Granting purchase:", {
            product: product.name,
            billingType: product.billingType,
          });
        }
      }
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    await updateOrderStatus(session.id, "failed");
  }

  return NextResponse.json({ received: true });
}
