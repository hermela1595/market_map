import pool from "../../config/db.js";

const createUsersTable = `
	CREATE TABLE IF NOT EXISTS users (
		id INT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(100),
		email VARCHAR(150) UNIQUE,
		password VARCHAR(255),
		role ENUM('buyer','seller','verifier','admin') DEFAULT 'buyer',
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)
`;

const createListingsTable = `
	CREATE TABLE IF NOT EXISTS listings (
		id INT AUTO_INCREMENT PRIMARY KEY,
		title VARCHAR(255),
		category VARCHAR(100),
		price DECIMAL(10,2),
		region VARCHAR(100),
		description TEXT,
		seller_id INT,
		verified BOOLEAN DEFAULT FALSE,
		verification_log_id INT,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (seller_id) REFERENCES users(id)
	)
`;

const createVerificationLogsTable = `
	CREATE TABLE IF NOT EXISTS verification_logs (
		id INT AUTO_INCREMENT PRIMARY KEY,
		listing_id INT,
		verifier_id INT,
		status ENUM('approved','rejected'),
		notes TEXT,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (listing_id) REFERENCES listings(id),
		FOREIGN KEY (verifier_id) REFERENCES users(id)
	)
`;

export const createSchema = async () => {
  await pool.query(createUsersTable);
  await pool.query(createListingsTable);
  await pool.query(createVerificationLogsTable);
};

const run = async () => {
  try {
    await createSchema();
    console.log("Database schema created successfully");
  } catch (error) {
    console.error("Failed to create schema:", error.code || error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}`) {
  run();
}
