export interface ZodiacSign {
  name: string;
  symbol: string;
  dateRange: string;
  startDate: [number, number]; // [month, day]
  endDate: [number, number]; // [month, day]
  element: string;
  iconClass: string;
}

export const zodiacSigns: ZodiacSign[] = [
  {
    name: 'Aries',
    symbol: '♈',
    dateRange: 'March 21 - April 19',
    startDate: [3, 21],
    endDate: [4, 19],
    element: 'Fire',
    iconClass: 'fas fa-fire'
  },
  {
    name: 'Taurus',
    symbol: '♉',
    dateRange: 'April 20 - May 20',
    startDate: [4, 20],
    endDate: [5, 20],
    element: 'Earth',
    iconClass: 'fas fa-spa'
  },
  {
    name: 'Gemini',
    symbol: '♊',
    dateRange: 'May 21 - June 20',
    startDate: [5, 21],
    endDate: [6, 20],
    element: 'Air',
    iconClass: 'fas fa-masks-theater'
  },
  {
    name: 'Cancer',
    symbol: '♋',
    dateRange: 'June 21 - July 22',
    startDate: [6, 21],
    endDate: [7, 22],
    element: 'Water',
    iconClass: 'fas fa-water'
  },
  {
    name: 'Leo',
    symbol: '♌',
    dateRange: 'July 23 - August 22',
    startDate: [7, 23],
    endDate: [8, 22],
    element: 'Fire',
    iconClass: 'fas fa-crown'
  },
  {
    name: 'Virgo',
    symbol: '♍',
    dateRange: 'August 23 - September 22',
    startDate: [8, 23],
    endDate: [9, 22],
    element: 'Earth',
    iconClass: 'fas fa-seedling'
  },
  {
    name: 'Libra',
    symbol: '♎',
    dateRange: 'September 23 - October 22',
    startDate: [9, 23],
    endDate: [10, 22],
    element: 'Air',
    iconClass: 'fas fa-balance-scale'
  },
  {
    name: 'Scorpio',
    symbol: '♏',
    dateRange: 'October 23 - November 21',
    startDate: [10, 23],
    endDate: [11, 21],
    element: 'Water',
    iconClass: 'fas fa-star'
  },
  {
    name: 'Sagittarius',
    symbol: '♐',
    dateRange: 'November 22 - December 21',
    startDate: [11, 22],
    endDate: [12, 21],
    element: 'Fire',
    iconClass: 'fas fa-bullseye'
  },
  {
    name: 'Capricorn',
    symbol: '♑',
    dateRange: 'December 22 - January 19',
    startDate: [12, 22],
    endDate: [1, 19],
    element: 'Earth',
    iconClass: 'fas fa-mountain'
  },
  {
    name: 'Aquarius',
    symbol: '♒',
    dateRange: 'January 20 - February 18',
    startDate: [1, 20],
    endDate: [2, 18],
    element: 'Air',
    iconClass: 'fas fa-wind'
  },
  {
    name: 'Pisces',
    symbol: '♓',
    dateRange: 'February 19 - March 20',
    startDate: [2, 19],
    endDate: [3, 20],
    element: 'Water',
    iconClass: 'fas fa-fish'
  }
];

export function getZodiacSign(month: number, day: number): ZodiacSign | null {
  // Adjust month to be 1-based for comparison
  const adjustedMonth = month;
  
  for (const sign of zodiacSigns) {
    const [startMonth, startDay] = sign.startDate;
    const [endMonth, endDay] = sign.endDate;
    
    // Check if the date falls within this sign's range
    if (
      (adjustedMonth === startMonth && day >= startDay) ||
      (adjustedMonth === endMonth && day <= endDay) ||
      (startMonth > endMonth && (
        (adjustedMonth > startMonth) || 
        (adjustedMonth < endMonth)
      ))
    ) {
      return sign;
    }
  }
  
  return null;
}

export function getZodiacDescription(zodiacName: string, scentName: string): string {
  // Default descriptions if specific ones aren't available
  const defaultDescriptions: Record<string, string> = {
    'Aries': `As an Aries, you're energetic, bold, and confident. Your scent should match your fiery personality.`,
    'Taurus': `As a Taurus, you appreciate life's pleasures and comfort. Your scent reflects your grounded nature and appreciation for quality.`,
    'Gemini': `As a Gemini, you're versatile and curious. Your scent matches your dynamic personality and love for variety.`,
    'Cancer': `As a Cancer, you're nurturing and sensitive. Your scent embodies your caring nature and emotional depth.`,
    'Leo': `As a Leo, you're warm-hearted and confident. Your scent captures your natural charisma and radiant personality.`,
    'Virgo': `As a Virgo, you're practical and detail-oriented. Your scent reflects your refined taste and appreciation for subtle elegance.`,
    'Libra': `As a Libra, you value harmony and beauty. Your scent embodies your natural sense of balance and aesthetic sensibility.`,
    'Scorpio': `As a Scorpio, you're passionate and intense. Your scent captures your mysterious allure and emotional depth.`,
    'Sagittarius': `As a Sagittarius, you're optimistic and freedom-loving. Your scent reflects your adventurous spirit and love for exploration.`,
    'Capricorn': `As a Capricorn, you're ambitious and disciplined. Your scent embodies your sophisticated taste and timeless style.`,
    'Aquarius': `As an Aquarius, you're innovative and independent. Your scent captures your unique personality and forward-thinking approach.`,
    'Pisces': `As a Pisces, you're intuitive and dreamy. Your scent reflects your imaginative nature and emotional sensitivity.`
  };
  
  // We would normally fetch this from the backend
  // For now, return the default description
  return defaultDescriptions[zodiacName] || 
    `Your zodiac sign ${zodiacName} pairs beautifully with the ${scentName} fragrance, creating a unique sensory experience that complements your natural traits.`;
}
