import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../server/db';
import { quizResults, insertQuizResultSchema, users, scents } from '../shared/schema';
import { eq, and, desc } from 'drizzle-orm';
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
    if (req.method === 'POST') {
      const resultData = insertQuizResultSchema.parse(req.body);
      
      // Check if user already has results
      const existingResult = await db.select()
        .from(quizResults)
        .where(eq(quizResults.userId, resultData.userId))
        .limit(1);

      if (existingResult.length > 0) {
        // Update existing result
        const updatedResult = await db.update(quizResults)
          .set(resultData)
          .where(eq(quizResults.userId, resultData.userId))
          .returning();
        return res.status(200).json(updatedResult[0]);
      } else {
        // Create new result
        const newResult = await db.insert(quizResults).values(resultData).returning();
        return res.status(201).json(newResult[0]);
      }
    }

    if (req.method === 'GET') {
      const { userId } = req.query;
      
      if (userId) {
        const userResults = await db.select()
          .from(quizResults)
          .where(eq(quizResults.userId, parseInt(userId as string)));
        return res.status(200).json(userResults);
      }
      
      return res.status(400).json({ message: 'User ID required' });
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