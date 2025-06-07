import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../server/db';
import { zodiacMappings } from '../../shared/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const { sign } = req.query;
      
      if (!sign) {
        return res.status(400).json({ message: 'Zodiac sign required' });
      }

      const mappings = await db.select()
        .from(zodiacMappings)
        .where(eq(zodiacMappings.zodiacSign, sign as string));
      
      return res.status(200).json(mappings);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}