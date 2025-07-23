import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import ProductSize from "@/model/productsize";
import ProductOption from "@/model/productoption";
import Product from "@/model/product";
import Cart from "@/model/cart"; // ← import the new model
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions"; // adjust path as needed



export async function POST(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user._id;

  try {
    const body = await req.json();
    const { productId, sizeId, optionIds = [], quantity } = body;



  console.log("body*********************",body  )

     
// return

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch base product price
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let totalPrice = product.price;

    // Add size price if selected
    if (sizeId) {
      const size = await ProductSize.findById(sizeId);
      if (size) {
        totalPrice += size.price;
      }
    }

    // Add options price if selected
    if (optionIds.length > 0) {
      const options = await ProductOption.find({ _id: { $in: optionIds } });
      const optionsTotal = options.reduce((sum, opt) => sum + opt.price, 0);
      totalPrice += optionsTotal;
    }

    totalPrice = totalPrice * quantity;

    // Save to Cart
    const cartItem = await Cart.create({
      productId,
      sizeId,
      optionIds,
      quantity,
      totalPrice,
      userId: userId,
    });

    console.log("cartItem", cartItem);
    return NextResponse.json({ success: true, cartItem });
  } catch (err) {
    console.error("Cart Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}




export async function GET(req) {
  await dbConnect();

  // const session = await getServerSession(authOptions);
  // if (!session || !session.user || !session.user._id) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    const cartItems = await Cart.find({ 
     // userId: session.user._id
    
    })
      .populate("productId")
      .populate("sizeId")
      .populate("optionIds");


      console.log(cartItems)

    return NextResponse.json(cartItems, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}