import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getProductById } from "@/lib/queries/shop";
import { createOrder } from "@/lib/queries/orders";
import { clearCart, getCartBySession } from "@/lib/queries/cart";
import { getLinkedAccountWithPlayer } from "@/lib/queries/linked-accounts";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

async function getSessionId(): Promise<string> {
  const h = await headers();
  return h.get("x-cart-session") ?? "anonymous";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, quantity = 1, cart } = body;

    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;
    const sessionId = await getSessionId();

    // Handle cart checkout
    if (cart && cart.length > 0) {
      const cartItems = await getCartBySession(sessionId, userId);
      if (cartItems.length === 0) {
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
      }

      const itemsWithProducts = await Promise.all(
        cartItems.map(async (item) => ({
          item,
          product: await getProductById(item.productId),
        }))
      );

      if (itemsWithProducts.some(({ product }) => !product)) {
        return NextResponse.json({ error: "Invalid cart item" }, { status: 400 });
      }

      const linked = userId ? await getLinkedAccountWithPlayer(userId) : null;
      const defaultRecipient = linked?.player?.lastKnownName;

      if (cartItems.some((item) => !(item.giftRecipient || defaultRecipient))) {
        return NextResponse.json({ error: "Recipient username required" }, { status: 400 });
      }

      const lineItems = itemsWithProducts.map(({ item, product }) => {
        const quantity = Number(item.quantity);
        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: product?.name || "Product",
              description: product?.description || "",
            },
            unit_amount: product?.price || 0,
          },
          quantity,
        };
      });

      if (lineItems.some((item) => !Number.isInteger(item.quantity) || item.quantity < 1)) {
        return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
      }

      const hasSubscription = itemsWithProducts.some(
        ({ product }) => product?.category === "rank" && product?.billingType === "subscription"
      );

      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems as any,
        mode: hasSubscription ? "subscription" : "payment",
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/store/checkout/result?type=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/store/checkout/result?type=canceled`,
        metadata: {
          userId: userId ?? "",
          sessionId,
          cart: JSON.stringify(
            cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              giftRecipient: item.giftRecipient || defaultRecipient,
            }))
          ),
        },
      });

      // Create order for each item
      for (const { item, product } of itemsWithProducts) {
        await createOrder({
          orderId: `ord_${Date.now()}_${item.productId}`,
          userId,
          productId: item.productId,
          stripeSessionId: checkoutSession.id,
          amount: (product?.price || 0) * item.quantity,
          status: "pending",
        });
      }

      // Clear cart after checkout
      await clearCart(sessionId, userId);

      return NextResponse.json({ url: checkoutSession.url });
    }

    // Handle direct checkout (single product)
    if (!productId) {
      return NextResponse.json({ error: "Product ID or cart required" }, { status: 400 });
    }

    const product = await getProductById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.price,
          },
          quantity,
        },
      ],
      mode: product.category === "rank" && product.billingType === "subscription" ? "subscription" : "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/store?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/store?canceled=true`,
      metadata: {
        productId: product._id.toString(),
        userId: userId ?? "",
        sessionId,
      },
    });

    await createOrder({
      orderId: `ord_${Date.now()}`,
      userId,
      productId: product._id.toString(),
      stripeSessionId: checkoutSession.id,
      amount: product.price * quantity,
      status: "pending",
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    const message = error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
