import pool from "../config/db.js";
import { Log } from "affordmed-logging-middleware";

export async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        student_id VARCHAR(100) NOT NULL,
        type ENUM('Event', 'Result', 'Placement') NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_student_read (student_id, is_read),
        INDEX idx_type (type),
        INDEX idx_created (created_at)
      )
    `);
    await Log("backend", "info", "db", "MySQL tables initialized successfully");
  } catch (err) {
    await Log("backend", "fatal", "db", `MySQL init failed: ${err.message}`);
    throw err;
  }
}
