import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  user: process.env.USER || "",
  host: process.env.HOST || "",
  database: process.env.DATABASE || "",
  password: process.env.PASSWORD || "",
  port: Number(process.env.PORT || "5432"),
});
