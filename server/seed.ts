import fs from 'fs';
import path from 'path';
import { db } from './db';
import { 
  questions,
  scents,
  zodiacMappings
} from '@shared/schema';

const dataDir = path.join(process.cwd(), 'client', 'src', 'data');

async function seedDatabase() {
  console.log('Starting database seeding...');
  
  try {
    // Seed questions
    console.log('Seeding questions...');
    const questionsPath = path.join(dataDir, 'questions.json');
    if (fs.existsSync(questionsPath)) {
      const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
      
      // First, check if questions already exist
      const existingQuestions = await db.select({ count: { value: questions } }).from(questions);
      if (existingQuestions.length === 0 || !existingQuestions[0].count.value) {
        // Insert questions
        for (const question of questionsData) {
          await db.insert(questions).values({
            id: question.id,
            type: question.type,
            text: question.text,
            order: question.order,
            options: question.options
          });
        }
        console.log(`Inserted ${questionsData.length} questions`);
      } else {
        console.log('Questions already exist in the database, skipping insertion');
      }
    }
    
    // Seed scents
    console.log('Seeding scents...');
    const scentsPath = path.join(dataDir, 'scents.json');
    if (fs.existsSync(scentsPath)) {
      const scentsData = JSON.parse(fs.readFileSync(scentsPath, 'utf8'));
      
      // Check if scents already exist
      const existingScents = await db.select({ count: { value: scents } }).from(scents);
      if (existingScents.length === 0 || !existingScents[0].count.value) {
        // Insert scents
        for (const scent of scentsData) {
          await db.insert(scents).values({
            id: scent.id,
            name: scent.name,
            notes: scent.notes,
            vibes: scent.vibes,
            mood: scent.mood,
            description: scent.description,
            category: scent.category
          });
        }
        console.log(`Inserted ${scentsData.length} scents`);
      } else {
        console.log('Scents already exist in the database, skipping insertion');
      }
    }
    
    // Seed zodiac mappings
    console.log('Seeding zodiac mappings...');
    const zodiacPath = path.join(dataDir, 'zodiac_mapping.json');
    if (fs.existsSync(zodiacPath)) {
      const zodiacData = JSON.parse(fs.readFileSync(zodiacPath, 'utf8'));
      
      // Check if zodiac mappings already exist
      const existingMappings = await db.select({ count: { value: zodiacMappings } }).from(zodiacMappings);
      if (existingMappings.length === 0 || !existingMappings[0].count.value) {
        // Insert zodiac mappings
        let mappingId = 1;
        
        // Get all scents to match by name
        const allScents = await db.select().from(scents);
        
        for (const [sign, mappings] of Object.entries(zodiacData)) {
          for (const [scentName, description] of Object.entries(mappings as Record<string, string>)) {
            const scent = allScents.find(s => s.name.toLowerCase() === scentName.toLowerCase());
            if (scent) {
              await db.insert(zodiacMappings).values({
                id: mappingId++,
                zodiacSign: sign,
                scentId: scent.id,
                description: description
              });
            }
          }
        }
        console.log(`Processed zodiac mappings`);
      } else {
        console.log('Zodiac mappings already exist in the database, skipping insertion');
      }
    }
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seed function
seedDatabase();