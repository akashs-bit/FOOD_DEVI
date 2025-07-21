import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "Not Authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // ✅ attach here (not req.body)
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Token Invalid" });
  }
};

export default authMiddleware;
