import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertQuestionSchema, 
  insertScentSchema,
  insertZodiacMappingSchema,
  insertQuizResultSchema
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import nodemailer from "nodemailer";

export async function registerRoutes(app: Express): Promise<Server> {
  // Routes for API endpoints
  
  // Users
  app.post('/api/users', async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.status(200).json({ user: existingUser, isExisting: true });
      }
      
      const user = await storage.createUser(userData);
      return res.status(201).json({ user, isExisting: false });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: 'Failed to create user' });
    }
  });

  // Questions
  app.get('/api/questions', async (_req: Request, res: Response) => {
    try {
      const questions = await storage.getQuestions();
      return res.status(200).json(questions);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch questions' });
    }
  });
  
  app.post('/api/questions', async (req: Request, res: Response) => {
    try {
      const questionData = insertQuestionSchema.parse(req.body);
      const question = await storage.createQuestion(questionData);
      return res.status(201).json(question);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error('Error creating question:', error);
      return res.status(500).json({ message: 'Failed to create question', error: String(error) });
    }
  });
  
  app.put('/api/questions/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const questionData = insertQuestionSchema.partial().parse(req.body);
      const question = await storage.updateQuestion(id, questionData);
      
      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }
      
      return res.status(200).json(question);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: 'Failed to update question' });
    }
  });
  
  app.delete('/api/questions/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteQuestion(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Question not found' });
      }
      
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ message: 'Failed to delete question' });
    }
  });

  // Scents
  app.get('/api/scents', async (_req: Request, res: Response) => {
    try {
      const scents = await storage.getScents();
      return res.status(200).json(scents);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch scents' });
    }
  });
  
  app.get('/api/scents/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const scent = await storage.getScent(id);
      
      if (!scent) {
        return res.status(404).json({ message: 'Scent not found' });
      }
      
      return res.status(200).json(scent);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch scent' });
    }
  });
  
  app.post('/api/scents', async (req: Request, res: Response) => {
    try {
      const scentData = insertScentSchema.parse(req.body);
      const scent = await storage.createScent(scentData);
      return res.status(201).json(scent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: 'Failed to create scent' });
    }
  });
  
  app.put('/api/scents/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const scentData = insertScentSchema.partial().parse(req.body);
      const scent = await storage.updateScent(id, scentData);
      
      if (!scent) {
        return res.status(404).json({ message: 'Scent not found' });
      }
      
      return res.status(200).json(scent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: 'Failed to update scent' });
    }
  });
  
  app.delete('/api/scents/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteScent(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Scent not found' });
      }
      
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ message: 'Failed to delete scent' });
    }
  });

  // Zodiac Mappings
  app.get('/api/zodiac-mappings', async (_req: Request, res: Response) => {
    try {
      const mappings = await storage.getZodiacMappings();
      return res.status(200).json(mappings);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch zodiac mappings' });
    }
  });
  
  app.get('/api/zodiac-mappings/sign/:sign', async (req: Request, res: Response) => {
    try {
      const sign = req.params.sign;
      const mappings = await storage.getZodiacMappingsBySign(sign);
      return res.status(200).json(mappings);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch zodiac mappings' });
    }
  });
  
  app.post('/api/zodiac-mappings', async (req: Request, res: Response) => {
    try {
      const mappingData = insertZodiacMappingSchema.parse(req.body);
      const mapping = await storage.createZodiacMapping(mappingData);
      return res.status(201).json(mapping);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: 'Failed to create zodiac mapping' });
    }
  });
  
  app.put('/api/zodiac-mappings/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const mappingData = insertZodiacMappingSchema.partial().parse(req.body);
      const mapping = await storage.updateZodiacMapping(id, mappingData);
      
      if (!mapping) {
        return res.status(404).json({ message: 'Zodiac mapping not found' });
      }
      
      return res.status(200).json(mapping);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: 'Failed to update zodiac mapping' });
    }
  });
  
  app.delete('/api/zodiac-mappings/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteZodiacMapping(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Zodiac mapping not found' });
      }
      
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ message: 'Failed to delete zodiac mapping' });
    }
  });

  // Quiz Results
  app.post('/api/quiz-results', async (req: Request, res: Response) => {
    try {
      const resultData = insertQuizResultSchema.parse(req.body);
      const result = await storage.createQuizResult(resultData);
      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: 'Failed to create quiz result' });
    }
  });
  
  app.get('/api/quiz-results/user/:userId', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const results = await storage.getQuizResultsByUserId(userId);
      return res.status(200).json(results);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch quiz results' });
    }
  });

  // Email Results
  app.post('/api/email-results', async (req: Request, res: Response) => {
    try {
      const { email, name, scent, zodiacSign, zodiacDescription } = req.body;
      
      if (!email || !scent) {
        return res.status(400).json({ message: 'Email and scent are required' });
      }
      
      // Create a test account if no email credentials are provided
      let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER || "ethereal_user",
          pass: process.env.EMAIL_PASS || "ethereal_pass"
        }
      });
      
      // Set up email content
      const mailOptions = {
        from: '"Fordive Fragrances" <info@fordive.com>',
        to: email,
        subject: "Your Fordive Scent Match Results",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #2D2926;">
            <h1 style="color: #D4AF37; font-family: 'Playfair Display', serif;">Hello ${name || 'there'}!</h1>
            <p>Thank you for taking the Fordive Scent Finder quiz! We're excited to share your personalized fragrance match.</p>
            
            <div style="background-color: #F8F5F2; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #2D2926; font-family: 'Playfair Display', serif;">Your Signature Scent: ${scent.name}</h2>
              <p><strong>Notes:</strong> ${scent.notes.join(', ')}</p>
              <p><strong>Vibes:</strong> ${scent.vibes.join(', ')}</p>
              <p><strong>Mood:</strong> <em>"${scent.mood}"</em></p>
              
              ${zodiacSign ? `
                <h3 style="color: #2D2926; font-family: 'Playfair Display', serif; margin-top: 15px;">Your Zodiac Personality: ${zodiacSign}</h3>
                <p>${zodiacDescription}</p>
              ` : ''}
            </div>
            
            <p>Visit our website to explore more about your perfect scent match and to purchase this fragrance.</p>
            
            <a href="https://fordive.com/shop" style="display: inline-block; background-color: #D4AF37; color: white; padding: 10px 20px; text-decoration: none; border-radius: 20px; margin-top: 15px;">Shop Now</a>
            
            <p style="margin-top: 30px; font-size: 12px; color: #504A44;">© 2023 Fordive. All rights reserved.</p>
          </div>
        `
      };
      
      // Send the email
      const info = await transporter.sendMail(mailOptions);
      
      return res.status(200).json({ 
        message: 'Email sent successfully',
        previewUrl: nodemailer.getTestMessageUrl(info)
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      return res.status(500).json({ message: 'Failed to send email' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
