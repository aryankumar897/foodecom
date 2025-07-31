import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Orders from "@/model/orders";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import OrderItem from "@/model/orderItem";
import Address from "@/model/addresses";


// GET: Fetch only pending orders
export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  console.log("User session:", session);

  if (!session?.user?._id) {
    console.log("Unauthorized access attempt ❌");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user?._id;

    // Find all orders for the user
    const orders = await Orders.find({ user_id: userId })
      .populate("user_id")
      .lean();

    if (!orders || orders.length === 0) {
      return NextResponse.json({ error: "No orders found" }, { status: 404 });
    }

    // Process each order to get its items and address
    const ordersWithDetails = await Promise.all(orders.map(async (order) => {
      // Fetch address details with delivery area information
      let addressDetails = null;
      if (order.address) {
        addressDetails = await Address.findById(order.address)
          .populate({
            path: "delivery_area_id",
            select: "name delivery_charge",
          })
          .lean();
      }

      // Fetch all order items with product details
      const orderItems = await OrderItem.find({ order_id: order._id })
        .populate({
          path: "product_id",
          select: "title thumbnail slug price variants",
        })
        .lean();

      return {
        ...order,
        addressDetails: addressDetails
          ? {
              ...addressDetails,
              fullName: `${addressDetails.first_name} ${
                addressDetails.last_name || ""
              }`.trim(),
              deliveryArea: addressDetails.delivery_area_id,
            }
          : null,
        contactPhone: addressDetails?.phone || order.user_id?.phone || null,
        contactEmail: addressDetails?.email || order.user_id?.email || null,
        orderItems: orderItems.map((item) => ({
          ...item,
          product_size: item.product_size || null,
          product_option: item.product_option || null,
          lineTotal: (item.unit_price * item.qty).toFixed(2),
          variant:
            item.product_id?.variants?.find(
              (v) => v.size === item.product_size?.size
            ) || null,
        })),
      };
    }));

    console.log("order details", JSON.stringify({ ordersWithDetails }, null, 4));

    return NextResponse.json(ordersWithDetails);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}