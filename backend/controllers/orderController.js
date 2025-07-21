import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const frontend_url = "https://food-devi-frontend-3kzm.onrender.com"; // You can move this to .env if needed

// ✅ Place Order
const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;

    const newOrder = new orderModel({
      userId: req.userId, // ✅ From authMiddleware
      items,
      amount,
      address,
    });

    await newOrder.save();

    // ✅ Clear user cart
    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    // ✅ Stripe line items
    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100 * 80, // adjust for Stripe (paise × 80)
      },
      quantity: item.quantity,
    }));

    // Add Delivery Charges
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100 * 80,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log("Place Order Error:", error);
    res.json({ success: false, message: "Order placement failed" });
  }
};

// ✅ Verify Order
const verifyOrder = async (req, res) => {
  try {
    const { orderId, success } = req.body;

    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Payment verified" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment failed, order deleted" });
    }
  } catch (error) {
    console.log("Verify Order Error:", error);
    res.json({ success: false, message: "Verification failed" });
  }
};

// ✅ Get User Orders
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userId: req.userId })
      .sort({ date: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log("User Orders Error:", error);
    res.json({ success: false, message: "Failed to fetch orders" });
  }
};

//listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//api for updating order status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res
        .status(400)
        .json({ success: false, message: "orderId and status required" });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true } // to return the updated document
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Status Updated", order: updatedOrder });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
