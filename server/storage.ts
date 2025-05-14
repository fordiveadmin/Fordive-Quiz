import { 
  type User, 
  type InsertUser,
  type Scent,
  type InsertScent,
  type Question,
  type InsertQuestion,
  type ZodiacMapping,
  type InsertZodiacMapping,
  type QuizResult,
  type InsertQuizResult,
  users, 
  scents, 
  questions, 
  zodiacMappings, 
  quizResults
} from "@shared/schema";

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { eq } from 'drizzle-orm';
import { db } from './db';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  
  // Question operations
  getQuestions(): Promise<Question[]>;
  getQuestion(id: number): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  updateQuestion(id: number, question: Partial<InsertQuestion>): Promise<Question | undefined>;
  deleteQuestion(id: number): Promise<boolean>;
  
  // Scent operations
  getScents(): Promise<Scent[]>;
  getScent(id: number): Promise<Scent | undefined>;
  createScent(scent: InsertScent): Promise<Scent>;
  updateScent(id: number, scent: Partial<InsertScent>): Promise<Scent | undefined>;
  deleteScent(id: number): Promise<boolean>;
  
  // Zodiac mapping operations
  getZodiacMappings(): Promise<ZodiacMapping[]>;
  getZodiacMapping(id: number): Promise<ZodiacMapping | undefined>;
  getZodiacMappingsBySign(sign: string): Promise<ZodiacMapping[]>;
  createZodiacMapping(mapping: InsertZodiacMapping): Promise<ZodiacMapping>;
  updateZodiacMapping(id: number, mapping: Partial<InsertZodiacMapping>): Promise<ZodiacMapping | undefined>;
  deleteZodiacMapping(id: number): Promise<boolean>;
  
  // Quiz result operations
  getQuizResult(id: number): Promise<QuizResult | undefined>;
  getQuizResultsByUserId(userId: number): Promise<QuizResult[]>;
  createQuizResult(result: InsertQuizResult): Promise<QuizResult>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private questions: Map<number, Question>;
  private scents: Map<number, Scent>;
  private zodiacMappings: Map<number, ZodiacMapping>;
  private quizResults: Map<number, QuizResult>;
  
  private userId: number;
  private questionId: number;
  private scentId: number;
  private zodiacMappingId: number;
  private quizResultId: number;
  
  private dataDir: string;
  
  constructor() {
    this.users = new Map();
    this.questions = new Map();
    this.scents = new Map();
    this.zodiacMappings = new Map();
    this.quizResults = new Map();
    
    this.userId = 1;
    this.questionId = 1;
    this.scentId = 1;
    this.zodiacMappingId = 1;
    this.quizResultId = 1;
    
    this.dataDir = path.join(process.cwd(), 'client', 'src', 'data');
    this.loadData();
  }
  
  private async loadData() {
    try {
      // Load questions from JSON
      const questionsPath = path.join(this.dataDir, 'questions.json');
      if (fs.existsSync(questionsPath)) {
        const questionsData = await readFile(questionsPath, 'utf8');
        const questions = JSON.parse(questionsData);
        questions.forEach((q: any) => {
          const question: Question = {
            ...q,
            id: this.questionId++
          };
          this.questions.set(question.id, question);
        });
      }
      
      // Load scents from JSON
      const scentsPath = path.join(this.dataDir, 'scents.json');
      if (fs.existsSync(scentsPath)) {
        const scentsData = await readFile(scentsPath, 'utf8');
        const scents = JSON.parse(scentsData);
        scents.forEach((s: any) => {
          const scent: Scent = {
            ...s,
            id: this.scentId++
          };
          this.scents.set(scent.id, scent);
        });
      }
      
      // Load zodiac mappings from JSON
      const zodiacPath = path.join(this.dataDir, 'zodiac_mapping.json');
      if (fs.existsSync(zodiacPath)) {
        const zodiacData = await readFile(zodiacPath, 'utf8');
        const zodiacMappings = JSON.parse(zodiacData);
        Object.entries(zodiacMappings).forEach(([sign, mappings]: [string, any]) => {
          Object.entries(mappings).forEach(([scentName, description]: [string, any]) => {
            const scent = Array.from(this.scents.values()).find(s => s.name.toLowerCase() === scentName.toLowerCase());
            if (scent) {
              const mapping: ZodiacMapping = {
                id: this.zodiacMappingId++,
                zodiacSign: sign,
                scentId: scent.id,
                description: description as string
              };
              this.zodiacMappings.set(mapping.id, mapping);
            }
          });
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }
  
  private async saveQuestions() {
    try {
      const questions = Array.from(this.questions.values());
      await writeFile(
        path.join(this.dataDir, 'questions.json'),
        JSON.stringify(questions, null, 2),
        'utf8'
      );
    } catch (error) {
      console.error('Error saving questions:', error);
    }
  }
  
  private async saveScents() {
    try {
      const scents = Array.from(this.scents.values());
      await writeFile(
        path.join(this.dataDir, 'scents.json'),
        JSON.stringify(scents, null, 2),
        'utf8'
      );
    } catch (error) {
      console.error('Error saving scents:', error);
    }
  }
  
  private async saveZodiacMappings() {
    try {
      const zodiacObj: Record<string, Record<string, string>> = {};
      
      for (const mapping of this.zodiacMappings.values()) {
        const scent = this.scents.get(mapping.scentId);
        if (!scent) continue;
        
        if (!zodiacObj[mapping.zodiacSign]) {
          zodiacObj[mapping.zodiacSign] = {};
        }
        
        zodiacObj[mapping.zodiacSign][scent.name] = mapping.description;
      }
      
      await writeFile(
        path.join(this.dataDir, 'zodiac_mapping.json'),
        JSON.stringify(zodiacObj, null, 2),
        'utf8'
      );
    } catch (error) {
      console.error('Error saving zodiac mappings:', error);
    }
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const timestamp = new Date();
    const newUser: User = { ...user, id, createdAt: timestamp };
    this.users.set(id, newUser);
    return newUser;
  }
  
  // Question methods
  async getQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values())
      .sort((a, b) => a.order - b.order);
  }
  
  async getQuestion(id: number): Promise<Question | undefined> {
    return this.questions.get(id);
  }
  
  async createQuestion(question: InsertQuestion): Promise<Question> {
    const id = this.questionId++;
    const newQuestion: Question = { ...question, id };
    this.questions.set(id, newQuestion);
    await this.saveQuestions();
    return newQuestion;
  }
  
  async updateQuestion(id: number, question: Partial<InsertQuestion>): Promise<Question | undefined> {
    const currentQuestion = this.questions.get(id);
    if (!currentQuestion) return undefined;
    
    const updatedQuestion: Question = { ...currentQuestion, ...question };
    this.questions.set(id, updatedQuestion);
    await this.saveQuestions();
    return updatedQuestion;
  }
  
  async deleteQuestion(id: number): Promise<boolean> {
    const deleted = this.questions.delete(id);
    if (deleted) {
      await this.saveQuestions();
    }
    return deleted;
  }
  
  // Scent methods
  async getScents(): Promise<Scent[]> {
    return Array.from(this.scents.values());
  }
  
  async getScent(id: number): Promise<Scent | undefined> {
    return this.scents.get(id);
  }
  
  async createScent(scent: InsertScent): Promise<Scent> {
    const id = this.scentId++;
    const newScent: Scent = { ...scent, id };
    this.scents.set(id, newScent);
    await this.saveScents();
    return newScent;
  }
  
  async updateScent(id: number, scent: Partial<InsertScent>): Promise<Scent | undefined> {
    const currentScent = this.scents.get(id);
    if (!currentScent) return undefined;
    
    const updatedScent: Scent = { ...currentScent, ...scent };
    this.scents.set(id, updatedScent);
    await this.saveScents();
    return updatedScent;
  }
  
  async deleteScent(id: number): Promise<boolean> {
    const deleted = this.scents.delete(id);
    if (deleted) {
      await this.saveScents();
    }
    return deleted;
  }
  
  // Zodiac mapping methods
  async getZodiacMappings(): Promise<ZodiacMapping[]> {
    return Array.from(this.zodiacMappings.values());
  }
  
  async getZodiacMapping(id: number): Promise<ZodiacMapping | undefined> {
    return this.zodiacMappings.get(id);
  }
  
  async getZodiacMappingsBySign(sign: string): Promise<ZodiacMapping[]> {
    return Array.from(this.zodiacMappings.values()).filter(
      mapping => mapping.zodiacSign.toLowerCase() === sign.toLowerCase()
    );
  }
  
  async createZodiacMapping(mapping: InsertZodiacMapping): Promise<ZodiacMapping> {
    const id = this.zodiacMappingId++;
    const newMapping: ZodiacMapping = { ...mapping, id };
    this.zodiacMappings.set(id, newMapping);
    await this.saveZodiacMappings();
    return newMapping;
  }
  
  async updateZodiacMapping(id: number, mapping: Partial<InsertZodiacMapping>): Promise<ZodiacMapping | undefined> {
    const currentMapping = this.zodiacMappings.get(id);
    if (!currentMapping) return undefined;
    
    const updatedMapping: ZodiacMapping = { ...currentMapping, ...mapping };
    this.zodiacMappings.set(id, updatedMapping);
    await this.saveZodiacMappings();
    return updatedMapping;
  }
  
  async deleteZodiacMapping(id: number): Promise<boolean> {
    const deleted = this.zodiacMappings.delete(id);
    if (deleted) {
      await this.saveZodiacMappings();
    }
    return deleted;
  }
  
  // Quiz result methods
  async getQuizResult(id: number): Promise<QuizResult | undefined> {
    return this.quizResults.get(id);
  }
  
  async getQuizResultsByUserId(userId: number): Promise<QuizResult[]> {
    return Array.from(this.quizResults.values()).filter(result => result.userId === userId);
  }
  
  async createQuizResult(result: InsertQuizResult): Promise<QuizResult> {
    const id = this.quizResultId++;
    const timestamp = new Date();
    const newResult: QuizResult = { ...result, id, createdAt: timestamp };
    this.quizResults.set(id, newResult);
    return newResult;
  }
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Question operations
  async getQuestions(): Promise<Question[]> {
    return db
      .select()
      .from(questions)
      .orderBy(questions.order);
  }
  
  async getQuestion(id: number): Promise<Question | undefined> {
    const [question] = await db
      .select()
      .from(questions)
      .where(eq(questions.id, id));
    return question || undefined;
  }
  
  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const [question] = await db
      .insert(questions)
      .values(insertQuestion)
      .returning();
    return question;
  }
  
  async updateQuestion(id: number, updateQuestion: Partial<InsertQuestion>): Promise<Question | undefined> {
    const [question] = await db
      .update(questions)
      .set(updateQuestion)
      .where(eq(questions.id, id))
      .returning();
    return question || undefined;
  }
  
  async deleteQuestion(id: number): Promise<boolean> {
    const result = await db
      .delete(questions)
      .where(eq(questions.id, id));
    return !!result;
  }
  
  // Scent operations
  async getScents(): Promise<Scent[]> {
    return db
      .select()
      .from(scents);
  }
  
  async getScent(id: number): Promise<Scent | undefined> {
    const [scent] = await db
      .select()
      .from(scents)
      .where(eq(scents.id, id));
    return scent || undefined;
  }
  
  async createScent(insertScent: InsertScent): Promise<Scent> {
    const [scent] = await db
      .insert(scents)
      .values(insertScent)
      .returning();
    return scent;
  }
  
  async updateScent(id: number, updateScent: Partial<InsertScent>): Promise<Scent | undefined> {
    const [scent] = await db
      .update(scents)
      .set(updateScent)
      .where(eq(scents.id, id))
      .returning();
    return scent || undefined;
  }
  
  async deleteScent(id: number): Promise<boolean> {
    const result = await db
      .delete(scents)
      .where(eq(scents.id, id));
    return !!result;
  }
  
  // Zodiac mapping operations
  async getZodiacMappings(): Promise<ZodiacMapping[]> {
    return db
      .select()
      .from(zodiacMappings);
  }
  
  async getZodiacMapping(id: number): Promise<ZodiacMapping | undefined> {
    const [mapping] = await db
      .select()
      .from(zodiacMappings)
      .where(eq(zodiacMappings.id, id));
    return mapping || undefined;
  }
  
  async getZodiacMappingsBySign(sign: string): Promise<ZodiacMapping[]> {
    return db
      .select()
      .from(zodiacMappings)
      .where(eq(zodiacMappings.zodiacSign, sign));
  }
  
  async createZodiacMapping(insertMapping: InsertZodiacMapping): Promise<ZodiacMapping> {
    const [mapping] = await db
      .insert(zodiacMappings)
      .values(insertMapping)
      .returning();
    return mapping;
  }
  
  async updateZodiacMapping(id: number, updateMapping: Partial<InsertZodiacMapping>): Promise<ZodiacMapping | undefined> {
    const [mapping] = await db
      .update(zodiacMappings)
      .set(updateMapping)
      .where(eq(zodiacMappings.id, id))
      .returning();
    return mapping || undefined;
  }
  
  async deleteZodiacMapping(id: number): Promise<boolean> {
    const result = await db
      .delete(zodiacMappings)
      .where(eq(zodiacMappings.id, id));
    return !!result;
  }
  
  // Quiz result operations
  async getQuizResult(id: number): Promise<QuizResult | undefined> {
    const [result] = await db
      .select()
      .from(quizResults)
      .where(eq(quizResults.id, id));
    return result || undefined;
  }
  
  async getQuizResultsByUserId(userId: number): Promise<QuizResult[]> {
    return db
      .select()
      .from(quizResults)
      .where(eq(quizResults.userId, userId));
  }
  
  async createQuizResult(insertResult: InsertQuizResult): Promise<QuizResult> {
    const [result] = await db
      .insert(quizResults)
      .values(insertResult)
      .returning();
    return result;
  }
}

// Switch to database storage
export const storage = new DatabaseStorage();
