import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { handleCheckoutCompleted, handleCheckoutFailed, handleCheckoutExpired, handleChargeRefunded, handleInvoicePaid, handleSubscriptionUpdated, handleSubscriptionDeleted, handleInvoicePaymentFailed } from "@/lib/webhook-handlers";

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

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object);
      break;

    case "checkout.session.expired":
      await handleCheckoutExpired(event.data.object);
      break;

    case "checkout.session.async_payment_failed":
      await handleCheckoutFailed(event.data.object);
      break;

    case "invoice.paid":
      await handleInvoicePaid(event.data.object);
      break;

    case "customer.subscription.updated":
      await handleSubscriptionUpdated(event.data.object);
      break;

    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object);
      break;

    case "invoice.payment_failed":
      await handleInvoicePaymentFailed(event.data.object);
      break;

    case "charge.refunded":
      await handleChargeRefunded(event.data.object);
      break;
  }

  return NextResponse.json({ received: true });
}
