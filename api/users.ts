import { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../server/db";
import { users, insertUserSchema } from "../shared/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === "POST") {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      console.log("Incoming user data:", body); // DEBUG

      const userData = insertUserSchema.parse(body);

      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, userData.email))
        .limit(1);

      if (existingUser.length > 0) {
        return res.status(200).json({ user: existingUser[0] });
      }

      const newUser = await db.insert(users).values(userData).returning();
      return res.status(201).json({ user: newUser[0] });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("User API error:", error); // LOG error biar bisa dilihat di vercel logs

    if (error instanceof z.ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }

    return res
      .status(500)
      .json({ message: "Internal server error", error: String(error) });
  }
}
