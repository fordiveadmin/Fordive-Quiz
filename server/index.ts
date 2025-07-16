import { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { registerRoutes } from "../server/routes";
import { setupAdminAuth } from "../server/admin-auth";

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

setupAdminAuth(app);
registerRoutes(app);

export default app;
