import pool from "../config/db.js";

export const createListing = async (data) => {
  const { title, category, price, region, description, seller_id } = data;
  const [result] = await pool.query(
    "INSERT INTO listings (title, category, price, region, description, seller_id) VALUES (?, ?, ?, ?, ?, ?)",
    [title, category, price, region, description, seller_id],
  );
  return result.insertId;
};

export const getListings = async (filters) => {
  let query = "SELECT * FROM listings WHERE 1=1";
  const params = [];

  if (filters.q) {
    query += " AND title LIKE ?";
    params.push(`%${filters.q}%`);
  }
  if (filters.category) {
    query += " AND category = ?";
    params.push(filters.category);
  }
  if (filters.region) {
    query += " AND region = ?";
    params.push(filters.region);
  }

  const [rows] = await pool.query(query, params);
  return rows;
};

export const getListingById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM listings WHERE id = ?", [id]);
  return rows[0];
};

export const getCategories = async () => {
  const [rows] = await pool.query(
    "SELECT DISTINCT category AS name FROM listings WHERE category IS NOT NULL AND category <> '' ORDER BY category ASC",
  );
  return rows;
};

export const getRegions = async () => {
  const [rows] = await pool.query(
    "SELECT DISTINCT region AS name FROM listings WHERE region IS NOT NULL AND region <> '' ORDER BY region ASC",
  );
  return rows;
};

export const updateListing = async (id, data) => {
  const fields = [];
  const values = [];

  for (const key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }

  values.push(id);

  await pool.query(
    `UPDATE listings SET ${fields.join(", ")} WHERE id = ?`,
    values,
  );
};

export const deleteListing = async (id) => {
  await pool.query("DELETE FROM listings WHERE id = ?", [id]);
};
