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
    return customImageUrl;
  }
  
  // Fallback to predefined image map if no custom URL
  const imageMap: Record<string, string> = {
    'Atlantis': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
    'Feeling Good': 'https://pixabay.com/get/g2f3b97dc97a860db8898bca8b4f08288c316906a97a358749e3a70f6c487b421a50ee25a14559707a10d3408953045cf5b2d421bff7ccc7ad76120d4254adac5_1280.jpg',
    'Shelby': 'https://pixabay.com/get/g0eaaf99fc461a64bfc48b6b6b4c332b781bc3732a6b0c7f36bf76aa97a019cebecda470cb03c0c4d55c36aa41b5cc235dc094c919ec2823cae08f3801f6e95b7_1280.jpg',
    'Utopia': 'https://pixabay.com/get/g524b818f9e4e108b93960485163a05639e1648074e7d4f4d65ad4e975c925333d906bb688dabdbfdac7205dd64419a8be8d2b7b812d60468de463aee41eb1454_1280.jpg',
    '1970': 'https://pixabay.com/get/g3bc9d08a55cf3892d1387686e3a15fda34cfd5995505e4167bf6051af1268680c6f0eb5e0e0417cfd2be9ae4b5602508e8c93a46d8df206852d87910e79d2d3e_1280.jpg',
    'Royal': 'https://pixabay.com/get/gec9e53c9f85bbb3942224e80e7f01b510d2eeea8488a69431204bcdee53325bfd6cf8853921142b4de177beb911da390ecfe12f17aab132e96414fcbf404fb5e_1280.jpg',
    'Garden Breeze': 'https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80',
    'Revolt': 'https://pixabay.com/get/g74e065384229ae05934f20db3fe4c1d2d623f2eeb077c8fd3bca4418b0ee7d27f2e3b8a836732499f130c672f0ece5b09ad9c79ef45e0e7ddd19dd71977a4c6e_1280.jpg'
  };
  
  return imageMap[scentName] || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80';
}