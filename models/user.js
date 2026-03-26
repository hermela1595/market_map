import pool from "../config/db.js";

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT id, NAME AS name, email, PASSWORD AS password, role FROM users WHERE LOWER(email) = LOWER(?)",
    [email],
  );
  return rows[0];
};

export const createUser = async (name, email, password, role) => {
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, password, role],
  );
  return result.insertId;
};

export const findUserById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id, name, email, role FROM users WHERE id = ?",
    [id],
  );
  return rows[0];
};

export const updateUserPasswordByEmail = async (email, passwordHash) => {
  const [result] = await pool.query(
    "UPDATE users SET password = ? WHERE LOWER(email) = LOWER(?)",
    [passwordHash, email],
  );
  return result.affectedRows;
};
