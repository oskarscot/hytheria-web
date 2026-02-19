import { stripe } from "@/lib/stripe";
import { getProductById } from "@/lib/queries/shop";
import { createPendingPurchase, createActiveSubscription, updateActiveSubscription, getActiveSubscriptionByStripeId } from "@/lib/queries/shop-pending";
import { getDiscordAccountId, getLinkedAccountWithPlayer } from "@/lib/queries/linked-accounts";
import { updateOrderStatus } from "@/lib/queries/orders";

export async function handleCheckoutFailed(session: any) {
  await updateOrderStatus(session.id, "failed");
  console.log("Checkout failed:", session.id);
}

export async function handleCheckoutExpired(session: any) {
  await updateOrderStatus(session.id, "failed");
  console.log("Checkout expired:", session.id);
}

export async function handleChargeRefunded(charge: any) {
  if (!charge.payment_intent) return;
  await updateOrderStatus(charge.payment_intent as string, "refunded");
  console.log("Charge refunded:", charge.payment_intent);
}

export function calculateExpiry(durationDays?: number): Date | undefined {
  if (!durationDays) return undefined;
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + durationDays);
  return expiry;
}

export async function handleCheckoutCompleted(session: any) {
  const cartData = session.metadata?.cart ? JSON.parse(session.metadata.cart) : null;
  const userId = session.metadata?.userId || undefined;
  const isSubscription = session.mode === "subscription";

  let discordId: string | undefined;
  if (userId) {
    discordId = await getDiscordAccountId(userId) ?? undefined;
  }

  const linked = userId ? await getLinkedAccountWithPlayer(userId) : null;
  const defaultUsername = linked?.player?.lastKnownName;

  if (cartData && cartData.length > 0) {
    for (const item of cartData) {
      const product = await getProductById(item.productId);
      if (!product) continue;

      const isGift = !!item.giftRecipient;
      const recipient = item.giftRecipient;
      
      const billingType = product.billingType || "one_time";
      const durationDays = billingType === "lifetime" 
        ? undefined 
        : billingType === "subscription"
          ? product.subscriptionInterval === "year" ? 365 : 30
          : (product.durationDays || 30);

      const expiresAt = calculateExpiry(durationDays);

      if (isSubscription && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as any;
        
        await createActiveSubscription({
          orderId: `ord_${Date.now()}_${item.productId}`,
          userId,
          discordId,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          productId: item.productId,
          productName: product.name,
          productCategory: product.category,
          recipientUsername: recipient,
          isGift,
          status: subscription.status as any,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        });
      } else {
        await createPendingPurchase({
          orderId: `ord_${Date.now()}_${item.productId}`,
          userId,
          discordId,
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
          expiresAt,
        });
      }
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

        const expiresAt = calculateExpiry(durationDays);
        const isSubscription = session.mode === "subscription";

        if (isSubscription && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as any;
          
          await createActiveSubscription({
            orderId: `ord_${Date.now()}`,
            userId,
            discordId,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            productId: product._id.toString(),
            productName: product.name,
            productCategory: product.category,
            recipientUsername: defaultUsername || "self",
            isGift: false,
            status: subscription.status as any,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          });
        } else {
          await createPendingPurchase({
            orderId: `ord_${Date.now()}`,
            userId,
            discordId,
            stripeSessionId: session.id,
            productId: product._id.toString(),
            productName: product.name,
            productCategory: product.category,
            billingType,
            durationDays,
            recipientUsername: defaultUsername || "self",
            isGift: false,
            amount: product.price,
            status: "completed",
            expiresAt,
          });
        }
      }
    }
  }

  await updateOrderStatus(session.id, "completed");
  console.log("Processed checkout session:", session.id);
}

export async function handleInvoicePaid(invoice: any) {
  if (!invoice.subscription) return;
  
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string) as any;
  const existing = await getActiveSubscriptionByStripeId(subscription.id);
  
  if (existing) {
    await updateActiveSubscription(subscription.id, {
      status: subscription.status as any,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    });
  } else {
    await createActiveSubscription({
      orderId: `inv_${invoice.id}`,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      productId: "",
      productName: "",
      productCategory: "rank",
      recipientUsername: "self",
      isGift: false,
      status: subscription.status as any,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    });
  }

  console.log("Processed invoice payment:", invoice.id);
}

export async function handleSubscriptionUpdated(subscription: any) {
  const existing = await getActiveSubscriptionByStripeId(subscription.id);
  
  if (existing) {
    const updates: any = {
      status: subscription.status as any,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    };

    if (subscription.cancel_at_period_end) {
      updates.canceledAt = new Date();
    }

    await updateActiveSubscription(subscription.id, updates);
  }

  console.log("Updated subscription:", subscription.id);
}

export async function handleSubscriptionDeleted(subscription: any) {
  await updateActiveSubscription(subscription.id, {
    status: "canceled",
    canceledAt: new Date(),
  });

  console.log("Canceled subscription:", subscription.id);
}

export async function handleInvoicePaymentFailed(invoice: any) {
  if (!invoice.subscription) return;
  
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string) as any;
  await updateActiveSubscription(subscription.id, {
    status: "past_due",
  });

  console.log("Subscription payment failed:", subscription.id);
}
