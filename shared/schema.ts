import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subscribeToNewsletter: boolean("subscribe_to_newsletter").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Images model
export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  data: text("data", { mode: 'json' }).notNull(), // Base64 encoded image data
  mimeType: text("mime_type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertImageSchema = createInsertSchema(images).omit({
  id: true,
  createdAt: true,
});

// Scent model
export const scents = pgTable("scents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  notes: text("notes").array(),
  vibes: text("vibes").array(),
  mood: text("mood").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  imageId: integer("image_id"), // Reference to the images table
  purchaseUrl: text("purchase_url"),
});

export const insertScentSchema = createInsertSchema(scents).omit({
  id: true,
});

// Question model
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  type: text("type").notNull(), // multiple_choice, checkbox, image_choice
  order: integer("order").notNull(),
  layout: text("layout").default("standard"), // standard, grid, carousel, cardstack
  
  // Untuk struktur pertanyaan bercabang
  isMainQuestion: boolean("is_main_question").default(false),
  parentId: integer("parent_id"), // ID pertanyaan induk
  parentOptionId: text("parent_option_id"), // ID opsi yang mengarah ke pertanyaan ini
  
  options: json("options").$type<{
    id: string;
    text: string;
    description?: string;
    imageUrl?: string;
    imageId?: number; // Reference to the images table
    scentMappings: Record<string, number>;
  }[]>(),
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
}).extend({
  layout: z.enum(['standard', 'grid', 'carousel', 'cardstack']).default('standard'),
});

// Zodiac mapping model
export const zodiacMappings = pgTable("zodiac_mappings", {
  id: serial("id").primaryKey(),
  zodiacSign: text("zodiac_sign").notNull(),
  scentId: integer("scent_id").notNull(),
  description: text("description").notNull(),
});

export const insertZodiacMappingSchema = createInsertSchema(zodiacMappings).omit({
  id: true,
});

// Quiz result model
export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  primaryScentId: integer("primary_scent_id").notNull(),
  zodiacSign: text("zodiac_sign"),
  answers: json("answers").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertQuizResultSchema = createInsertSchema(quizResults).omit({
  id: true,
  createdAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Image = typeof images.$inferSelect;
export type InsertImage = z.infer<typeof insertImageSchema>;

export type Scent = typeof scents.$inferSelect;
export type InsertScent = z.infer<typeof insertScentSchema>;

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;

export type ZodiacMapping = typeof zodiacMappings.$inferSelect;
export type InsertZodiacMapping = z.infer<typeof insertZodiacMappingSchema>;

export type QuizResult = typeof quizResults.$inferSelect;
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
