import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Cart from "@/model/cart";
import Product from "@/model/product";
import ProductSize from "@/model/productsize";
import ProductOption from "@/model/productoption";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

export async function PUT(req, context) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user._id;
  const { id: cartId } = context.params;
  const { quantity } = await req.json();

  console.log("🔄 cartId:", cartId);
  console.log("📦 new quantity:", quantity);

  if (!cartId || typeof quantity !== "number" || quantity < 1) {
    return NextResponse.json(
      { error: "Invalid cartId or quantity" },
      { status: 400 }
    );
  }

  try {
    const cartItem = await Cart.findOne({ _id: cartId, userId });

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    console.log("🛒 cartItem found:", cartItem);

    const product = await Product.findById(cartItem.productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    console.log("🛍️ product found:", {
      price: product.price,
      offer_price: product.offer_price,
    });

    let basePrice =  product.price;
    console.log("💰 basePrice:", basePrice);

    // Size price
    let sizePrice = 0;
    if (cartItem.sizeId) {
      const size = await ProductSize.findById(cartItem.sizeId);
      console.log("📏 size found:", size);
      if (size) sizePrice = size.price;
    }

    // Options price
    let optionsTotal = 0;
    if (cartItem.optionIds?.length > 0) {
      const options = await ProductOption.find({
        _id: { $in: cartItem.optionIds },
      });

      console.log("🧩 options found:", options);

      optionsTotal = options.reduce((sum, opt) => {
        const price = opt.price || 0;
        return sum + price;
      }, 0);
    }

    const totalPrice = (basePrice + sizePrice + optionsTotal) * quantity;

    console.log("🧮 Calculated:", {
      basePrice,
      sizePrice,
      optionsTotal,
      quantity,
      totalPrice,
    });

    cartItem.quantity = quantity;
    cartItem.totalPrice = totalPrice;
    await cartItem.save();

    return NextResponse.json({ success: true, cartItem });
  } catch (err) {
    console.error("❌ Cart update error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
