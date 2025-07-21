import userModel from "../models/userModel.js";

//Add items to user cart
// ✅ Add items to user cart
const addToCart = async (req, res) => {
  try {
    const userId = req.userId; // ✅ From authMiddleware
    const { itemId } = req.body;

    // ❗ Validate itemId
    if (!itemId || typeof itemId !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or missing itemId" });
    }

    const userData = await userModel.findById(userId);
    const cartData = userData.cartData || {};

    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    return res.json({ success: true, message: "Item added to cart" });
  } catch (error) {
    console.log("Add to Cart Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Remove items from user cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId; // ✅ From authMiddleware
    const { itemId } = req.body;

    // ❗ Validate itemId
    if (!itemId || typeof itemId !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or missing itemId" });
    }

    const userData = await userModel.findById(userId);
    const cartData = userData.cartData || {};

    if (cartData[itemId] && cartData[itemId] > 0) {
      cartData[itemId] -= 1;

      // ❗ Remove item if count reaches 0
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }

      await userModel.findByIdAndUpdate(userId, { cartData });
      return res.json({ success: true, message: "Item removed from cart" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Item not found in cart" });
    }
  } catch (error) {
    console.log("Remove from Cart Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//fetch user from cart data
const getCart = async (req, res) => {
  try {
    const userId = req.userId; // ✅ From authMiddleware

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID not found in request" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const cartData = userData.cartData || {};
    return res.json({ success: true, cartData });
  } catch (error) {
    console.log("GetCart Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export { addToCart, removeFromCart, getCart };
