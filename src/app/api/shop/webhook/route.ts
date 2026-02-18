import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { getProductById } from "@/lib/queries/shop";
import { createPendingPurchase } from "@/lib/queries/shop-pending";

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
      for (const item of cartData) {
        const product = await getProductById(item.productId);
        if (!product) continue;

        const isGift = !!item.giftRecipient;
        const recipient = item.giftRecipient || session.metadata?.userId || "self";
        
        const billingType = product.billingType || "one_time";
        const durationDays = billingType === "lifetime" 
          ? undefined 
          : billingType === "subscription"
            ? product.subscriptionInterval === "year" ? 365 : 30
            : (product.durationDays || 30);

        await createPendingPurchase({
          oderId: `ord_${Date.now()}_${item.productId}`,
          userId: session.metadata?.userId || undefined,
          stripeSessionId: session.id,
          productId: item.productId,
          productName: product.name,
          productCategory: product.category,
          billingType,
          durationDays,
          recipientUsername: recipient,
          isGift,
          amount: product.price * item.quantity,
          status: "completed",
        });
      }
    } else {
      const productId = session.metadata?.productId;
      if (productId) {
        const product = await getProductById(productId);
        if (product) {
          const billingType = product.billingType || "one_time";
          const durationDays = billingType === "lifetime" 
            ? undefined 
            : billingType === "subscription"
              ? product.subscriptionInterval === "year" ? 365 : 30
              : (product.durationDays || 30);

          await createPendingPurchase({
            oderId: `ord_${Date.now()}`,
            userId: session.metadata?.userId || undefined,
            stripeSessionId: session.id,
            productId: product._id.toString(),
            productName: product.name,
            productCategory: product.category,
            billingType,
            durationDays,
            recipientUsername: "self",
            isGift: false,
            amount: product.price,
            status: "completed",
          });
        }
      }
    }

    console.log("Created pending purchases for session:", session.id);
  }

  return NextResponse.json({ received: true });
}
