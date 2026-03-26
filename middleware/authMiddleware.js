import jwt from "jsonwebtoken";
import { findUserById } from "../models/user.js";

const getJwtSecret = () =>
  String(process.env.JWT_SECRET || "")
    .trim()
    .replace(/^"|"$/g, "");

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const jwtSecret = getJwtSecret();
  if (!jwtSecret) {
    return res.status(500).json({ message: "Authentication unavailable" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, jwtSecret);
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await findUserById(decoded.id);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user;
    next();
  } catch {
    return res.status(500).json({ message: "Authentication check failed" });
  }
};
