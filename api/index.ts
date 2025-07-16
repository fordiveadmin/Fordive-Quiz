import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    message: "✅ FordiveQuiz API is alive",
    routes: [
      "/api/users",
      "/api/questions",
      "/api/scents",
      "/api/quiz-results",
      "/api/zodiac-mappings",
    ],
  });
}
