import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { createProduct, updateProduct, deleteProduct, getProductById, getAllProducts, isShopAdmin } from "@/lib/queries/shop";

export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = await isShopAdmin(session.user.id);
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const product = await createProduct({
      name: body.name,
      description: body.description,
      price: body.price,
      category: body.category,
      billingType: body.billingType,
      imageUrl: body.imageUrl,
      benefits: body.benefits,
      isActive: body.isActive,
      sortOrder: body.sortOrder,
    });
    return NextResponse.json({ id: product });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
