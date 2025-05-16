import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateScentScores(answers: Record<string, any>): Record<string, number> {
  const scores: Record<string, number> = {};
  
  console.log("Processing answers:", JSON.stringify(answers));
  
  Object.values(answers).forEach(answer => {
    if (typeof answer === 'string') {
      // Legacy: Single selection answer in string format
      const [scentId, points] = answer.split(':');
      scores[scentId] = (scores[scentId] || 0) + Number(points || 1);
    } else if (Array.isArray(answer)) {
      // Legacy: Multiple selection answer
      answer.forEach(selection => {
        const [scentId, points] = selection.split(':');
        scores[scentId] = (scores[scentId] || 0) + Number(points || 1);
      });
    } else if (typeof answer === 'object' && answer !== null) {
      // New format: Contains scentMappings object
      if (answer.scentMappings) {
        Object.entries(answer.scentMappings).forEach(([scentName, points]) => {
          scores[scentName] = (scores[scentName] || 0) + Number(points || 1);
        });
      }
      // Legacy: Object with direct scent mappings
      else {
        Object.entries(answer).forEach(([scentId, points]) => {
          if (scentId !== 'optionId' && scentId !== 'optionIds') {
            scores[scentId] = (scores[scentId] || 0) + Number(points);
          }
        });
      }
    }
  });
  
  console.log("Calculated scores:", scores);
  return scores;
}

export function getTopScent(scores: Record<string, number>): string {
  let topScent = '';
  let topScore = 0;
  
  Object.entries(scores).forEach(([scentId, score]) => {
    if (score > topScore) {
      topScore = score;
      topScent = scentId;
    }
  });
  
  return topScent;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

// For copying text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy text: ', error);
    return false;
  }
}

// Helper to get image URLs for scents
export function getScentImageUrl(scentName: string, customImageUrl?: string): string {
  // If a custom image URL is provided, use it
  if (customImageUrl) {
    // If it's a base64 image or a regular URL, return it directly
    if (customImageUrl.startsWith('data:image') || customImageUrl.startsWith('http')) {
      return customImageUrl;
    }
  }
  
  // Fallback to predefined image map if no custom URL
  const imageMap: Record<string, string> = {
    'Atlantis': 'https://i.imgur.com/mD8aCQK.png',
    'Feeling Good': 'https://i.imgur.com/qHUJ6qZ.png',
    'Shelby': 'https://i.imgur.com/9h8vvX7.png',
    'Utopia': 'https://i.imgur.com/mD8aCQK.png',
    '1970': 'https://i.imgur.com/k7MRiVV.png',
    'Royal': 'https://i.imgur.com/3KlGd9S.png',
    'Garden Breeze': 'https://i.imgur.com/qHUJ6qZ.png',
    'Revolt': 'https://i.imgur.com/2QwIYpT.png'
  };
  
  return imageMap[scentName] || 'https://i.imgur.com/qHUJ6qZ.png';
}