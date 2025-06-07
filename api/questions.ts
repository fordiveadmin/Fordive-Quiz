import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../server/db';
import { questions, insertQuestionSchema } from '../shared/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const allQuestions = await db.select().from(questions).orderBy(questions.order);
      return res.status(200).json(allQuestions);
    }

    if (req.method === 'POST') {
      const questionData = insertQuestionSchema.parse(req.body);
      const newQuestion = await db.insert(questions).values(questionData).returning();
      return res.status(201).json(newQuestion[0]);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}