import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  createUser,
  updateUserPasswordByEmail,
} from "../models/User.js";

const getJwtSecret = () => {
  const raw = String(process.env.JWT_SECRET || "");
  const normalized = raw.trim().replace(/^"|"$/g, "");
  return normalized || null;
};

const normalizeEmail = (email) =>
  String(email || "")
    .trim()
    .toLowerCase();

const validatePasswordStrength = (password) => {
  const value = String(password || "");
  const checks = [
    { ok: value.length >= 8, message: "at least 8 characters" },
    { ok: /[A-Z]/.test(value), message: "one uppercase letter" },
    { ok: /[a-z]/.test(value), message: "one lowercase letter" },
    { ok: /\d/.test(value), message: "one number" },
    { ok: /[^A-Za-z0-9]/.test(value), message: "one special character" },
  ];

  const failedRules = checks
    .filter((rule) => !rule.ok)
    .map((rule) => rule.message);
  return {
    isValid: failedRules.length === 0,
    failedRules,
  };
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const jwtSecret = getJwtSecret();
    const normalizedEmail = normalizeEmail(email);
    const trimmedName = String(name || "").trim();

    if (!jwtSecret) {
      return res.status(500).json({
        message: "Server auth is not configured. Set JWT_SECRET in .env",
      });
    }

    if (!trimmedName || !normalizedEmail || !String(password || "").trim()) {
      return res.status(400).json({
        message: "name, email and password are required",
      });
    }

    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        message: "Password is too weak",
        rules: passwordValidation.failedRules,
      });
    }

    const exists = await findUserByEmail(normalizedEmail);
    if (exists) return res.status(400).json({ message: "Email already used" });

    const hashed = await bcrypt.hash(password, 10);
    let userId;
    try {
      userId = await createUser(trimmedName, normalizedEmail, hashed, role);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Email already used" });
      }
      throw error;
    }

    const token = jwt.sign({ id: userId }, jwtSecret, {
      expiresIn: "7d",
    });

    res.json({
      id: userId,
      name: trimmedName,
      email: normalizedEmail,
      role,
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const jwtSecret = getJwtSecret();
    const normalizedEmail = normalizeEmail(email);

    if (!jwtSecret) {
      return res.status(500).json({
        message: "Server auth is not configured. Set JWT_SECRET in .env",
      });
    }

    if (!normalizedEmail || !String(password || "").trim()) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const user = await findUserByEmail(normalizedEmail);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (typeof user.password !== "string" || !user.password.trim()) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, jwtSecret, {
      expiresIn: "7d",
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

export const getMe = async (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
};

export const resetPasswordForTesting = async (req, res) => {
  try {
    const resetEnabled = ["true", "1", "yes", "on"].includes(
      String(process.env.ALLOW_TEST_PASSWORD_RESET || "")
        .trim()
        .toLowerCase(),
    );

    if (!resetEnabled) {
      return res.status(403).json({
        message: "Testing password reset is disabled",
        hint: "Set ALLOW_TEST_PASSWORD_RESET=true in .env and restart server",
        currentValue: process.env.ALLOW_TEST_PASSWORD_RESET || null,
      });
    }

    const configuredKey = process.env.TEST_RESET_KEY;
    const requestKey = req.headers["x-test-reset-key"];
    if (configuredKey && requestKey !== configuredKey) {
      return res.status(401).json({ message: "Invalid test reset key" });
    }

    const normalizedEmail = normalizeEmail(req.body.email);
    const newPassword = String(req.body.newPassword || "");

    if (!normalizedEmail || !newPassword.trim()) {
      return res.status(400).json({
        message: "email and newPassword are required",
      });
    }

    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        message: "Password is too weak",
        rules: passwordValidation.failedRules,
      });
    }

    const exists = await findUserByEmail(normalizedEmail);
    if (!exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await updateUserPasswordByEmail(normalizedEmail, passwordHash);

    res.json({
      message: "Password reset for testing completed",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("Test password reset error:", error);
    res
      .status(500)
      .json({ message: "Test password reset failed", error: error.message });
  }
};
