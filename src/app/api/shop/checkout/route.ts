import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getProductById } from "@/lib/queries/shop";
import { createOrder } from "@/lib/queries/orders";
import { clearCart } from "@/lib/queries/cart";
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
      const lineItems = cart.map((item: any) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.product?.name || "Product",
            description: item.product?.description || "",
          },
          unit_amount: item.product?.price || 0,
        },
        quantity: item.quantity,
      }));

      const total = cart.reduce(
        (sum: number, item: any) => sum + (item.product?.price || 0) * item.quantity,
        0
      );

      const hasSubscription = cart.some(
        (item: any) => item.product?.category === "rank" && item.product?.billingType === "subscription"
      );

      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems as any,
        mode: hasSubscription ? "subscription" : "payment",
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/store?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/store?canceled=true`,
        metadata: {
          userId: userId ?? "",
          sessionId,
          cart: JSON.stringify(
            cart.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              giftRecipient: item.giftRecipient || null,
            }))
          ),
        },
      });

      // Create order for each item
      for (const item of cart) {
        await createOrder({
          oderId: `ord_${Date.now()}_${item.productId}`,
          userId,
          productId: item.productId,
          stripeSessionId: checkoutSession.id,
          amount: (item.product?.price || 0) * item.quantity,
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
      oderId: `ord_${Date.now()}`,
      userId,
      productId: product._id.toString(),
      stripeSessionId: checkoutSession.id,
      amount: product.price * quantity,
      status: "pending",
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
