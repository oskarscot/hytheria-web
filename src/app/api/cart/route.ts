import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getCartBySession, addToCart, removeFromCart, updateCartItem, clearCart } from "@/lib/queries/cart";
import { getProductById } from "@/lib/queries/shop";

async function getSessionId(): Promise<string> {
  const h = await headers();
  return h.get("x-cart-session") ?? "anonymous";
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  const sessionId = await getSessionId();
  const userId = session?.user?.id;

  const items = await getCartBySession(sessionId, userId);
  
  const itemsWithProducts = await Promise.all(
    items.map(async (item) => {
      const product = await getProductById(item.productId);
      return {
        ...item,
        product,
      };
    })
  );

  return NextResponse.json(itemsWithProducts);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  const sessionId = await getSessionId();
  const userId = session?.user?.id;

  try {
    const { productId, quantity = 1, giftRecipient } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const product = await getProductById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await addToCart(sessionId, productId, quantity, userId, giftRecipient);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  const sessionId = getSessionId();
  const userId = session?.user?.id;

  try {
    const { itemId, quantity, giftRecipient } = await request.json();

    if (!itemId) {
      return NextResponse.json({ error: "Item ID required" }, { status: 400 });
    }

    await updateCartItem(itemId, { quantity, giftRecipient });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update cart error:", error);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  const sessionId = await getSessionId();
  const userId = session?.user?.id;

  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");
    const clear = searchParams.get("clear");

    if (clear === "true") {
      await clearCart(sessionId, userId);
    } else if (itemId) {
      await removeFromCart(itemId);
    } else {
      return NextResponse.json({ error: "Item ID or clear required" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 });
  }
}
