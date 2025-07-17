// api/ping.ts
import { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "@server/db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("DATABASE_URL ENV:", process.env.DATABASE_URL);

  try {
    const result = await db.execute("SELECT 1");
    return res
      .status(200)
      .json({ ok: true, message: "Connected to DB", result });
  } catch (err) {
    console.error("Ping DB error:", err);
    return res.status(500).json({ ok: false, error: String(err) });
    console.log("DATABASE_URL ENV:", process.env.DATABASE_URL);
  }
  console.log("DATABASE_URL ENV:", process.env.DATABASE_URL);
}
