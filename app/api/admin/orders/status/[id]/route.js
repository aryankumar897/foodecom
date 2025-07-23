import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Orders from "@/model/orders";
import OrderItem from "@/model/orderItem";
import Address from "@/model/addresses";


import DeliveryArea from "@/model/deliveryArea";
export async function GET(req, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    // Fetch the order with user details
    const order = await Orders.findById(id)
      .populate({
        path: "user_id",
        select: "name email phone" // Basic user info
      })
      .lean();

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Fetch address details with delivery area information
    let addressDetails = null;
    if (order.address) {
      addressDetails = await Address.findById(order.address)
        .populate({
          path: "delivery_area_id",
          select: "name delivery_charge" // Include delivery area details you might need
        })
        .lean();
    }

    // Fetch all order items with product details
    const orderItems = await OrderItem.find({ order_id: id })
      .populate({
        path: "product_id",
        select: "title thumbnail slug price variants" // Include variants if needed
      })
      .lean();

    // Format the complete response
    const responseData = {
      order: {
        ...order,
        addressDetails: addressDetails ? {
          ...addressDetails,
          fullName: `${addressDetails.first_name} ${addressDetails.last_name || ''}`.trim(),
          deliveryArea: addressDetails.delivery_area_id
        } : null,
        // Include phone from address if available, otherwise from user
        contactPhone: addressDetails?.phone || order.user_id?.phone || null,
        contactEmail: addressDetails?.email || order.user_id?.email || null
      },
      orderItems: orderItems.map(item => ({
        ...item,
        product_size: item.product_size || null,
        product_option: item.product_option || null,
        lineTotal: (item.unit_price * item.qty).toFixed(2),
        // Add variant information if available
        variant: item.product_id?.variants?.find(
          v => v.size === item.product_size?.size
        ) || null
      }))
    };


 console.log("order details" ,JSON.stringify({responseData},null,4))

    return NextResponse.json(responseData);
  } catch (err) {
    console.error("Error fetching order:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}