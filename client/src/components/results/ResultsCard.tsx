import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/store/quizStore';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { getZodiacDescription } from '@/lib/zodiac';
import { getScentImageUrl } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import logoImage from "../../assets/fordive-logo-white.png";

interface ResultsCardProps {
  scent: {
    id: number;
    name: string;
    notes: string[];
    vibes: string[];
    mood: string;
    description: string;
    imageUrl?: string;
    purchaseUrl?: string;
  };
  zodiacSign: any | null;
}

export default function ResultsCard({ scent, zodiacSign }: ResultsCardProps) {
  const { zodiacSign: zodiacSignState } = useStore();
  
  // Get zodiac mapping for this scent and sign
  const currentZodiacSign = zodiacSign?.name || zodiacSignState?.name;
  
  // Use the specific endpoint with the zodiac sign in the URL
  const { data: zodiacMappings, isLoading } = useQuery({
    queryKey: ['/api/zodiac-mappings/sign', currentZodiacSign],
    queryFn: async () => {
      if (!currentZodiacSign) return [];
      
      try {
        const response = await fetch(`/api/zodiac-mappings/sign/${currentZodiacSign}`);
        if (!response.ok) {
          console.error(`Failed to fetch zodiac mappings: ${response.status}`);
          return [];
        }
        return response.json();
      } catch (error) {
        console.error("Error fetching zodiac mappings:", error);
        return [];
      }
    },
    enabled: !!currentZodiacSign,
  });
  
  // Find the specific mapping for this scent
  const getZodiacMappingDescription = () => {
    if (!scent) return "";
    
    // Make sure zodiacMappings is an array before using find
    const mappingsArray = Array.isArray(zodiacMappings) ? zodiacMappings : [];
    
    // 1. First try to find exact match for this scent
    const mapping = mappingsArray.find((m: any) => m.scentId === scent.id);
    if (mapping && mapping.description) {
      return mapping.description;
    }
    
    // 2. If no mapping exists, use the built-in zodiac description
    const zodiacDesc = getZodiacDescription(currentZodiacSign || 'Gemini', scent.name);
    
    return zodiacDesc || `${currentZodiacSign || 'Your zodiac sign'} pairs beautifully with ${scent.name}, creating a unique fragrance experience that enhances your natural traits.`;
  };
  
  const zodiacDescription = getZodiacMappingDescription();
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${scent.imageUrl ? getScentImageUrl(scent.name, scent.imageUrl) : getScentImageUrl(scent.name)})`
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 text-center text-white">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <img src={logoImage} alt="Fordive Logo" className="h-16 mx-auto" />
        </motion.div>
        
        {/* Title */}
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-light mb-12 tracking-wide"
        >
          Scent Finder Results
        </motion.h2>
        
        {/* Main Result Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-black/40 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full mb-12"
        >
          <h3 className="text-lg font-light mb-6 tracking-wide">YOUR SCENT MATCH</h3>
          
          {/* Scent Name */}
          <h1 className="text-4xl font-playfair font-bold mb-6">{scent.name}</h1>
          
          {/* Notes */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {scent.notes.slice(0, 4).map((note, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                {note}
              </div>
            ))}
          </div>
          
          {/* Tagline/Mood */}
          <div className="italic text-lg mb-2 font-light">
            "{scent.mood}"
          </div>
        </motion.div>
        
        {/* Zodiac Section */}
        {zodiacSign && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8"
          >
            <h3 className="text-xl font-light mb-2">{useStore().user?.name || 'Your'}'s Signature Scent</h3>
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">{zodiacSign.name}</span>
              <span className="text-[#C89F65] text-xl">✨</span>
            </div>
            
            {isLoading ? (
              <div className="mt-4">
                <Skeleton className="h-4 w-64 mx-auto bg-white/20" />
              </div>
            ) : (
              <p className="mt-4 text-sm text-white/80 max-w-md mx-auto">
                {zodiacDescription}
              </p>
            )}
          </motion.div>
        )}
        
        {/* Website Link */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/80 font-light"
        >
          fordive.com
        </motion.div>
        
        {/* Buy Button */}
        {scent.purchaseUrl && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <a 
              href={scent.purchaseUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-[#C89F65] hover:bg-[#C89F65]/90 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 hover:shadow-xl transform hover:scale-105"
            >
              Shop Now
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}
