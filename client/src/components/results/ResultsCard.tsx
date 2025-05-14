import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/store/quizStore';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { getZodiacDescription } from '@/lib/zodiac';
import { getScentImageUrl } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ResultsCardProps {
  scent: {
    id: number;
    name: string;
    notes: string[];
    vibes: string[];
    mood: string;
    description: string;
  };
  zodiacSign: any | null;
}

export default function ResultsCard({ scent, zodiacSign }: ResultsCardProps) {
  const { zodiacSign: zodiacSignState } = useStore();
  
  // Get zodiac mapping for this scent and sign
  const { data: zodiacMappings, isLoading } = useQuery({
    queryKey: ['/api/zodiac-mappings/sign', zodiacSign?.name || zodiacSignState?.name],
    enabled: !!(zodiacSign?.name || zodiacSignState?.name),
  });
  
  // Find the specific mapping for this scent
  const getZodiacMappingDescription = () => {
    if (!zodiacMappings || !scent) return null;
    
    const mapping = zodiacMappings.find((m: any) => m.scentId === scent.id);
    if (mapping) return mapping.description;
    
    // Fallback to generic description if no mapping exists
    return getZodiacDescription(
      zodiacSign?.name || zodiacSignState?.name || '', 
      scent.name
    );
  };
  
  const zodiacDescription = getZodiacMappingDescription();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="md:flex">
        <div className="md:w-2/5">
          <img 
            src={getScentImageUrl(scent.name)} 
            alt={`${scent.name} Perfume`} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="md:w-3/5 p-8 md:p-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-playfair font-bold">{scent.name}</h3>
            {zodiacSign && (
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mr-2">
                  <i className={`${zodiacSign.iconClass} text-primary text-lg`}></i>
                </div>
                <span className="text-muted-foreground">{zodiacSign.name}</span>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {scent.notes.map((note, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1 rounded-full">
                  {note}
                </Badge>
              ))}
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Vibes</h4>
              <p className="text-muted-foreground">{scent.vibes.join(', ')}</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Mood</h4>
              <p className="italic text-muted-foreground">"{scent.mood}"</p>
            </div>
          </div>
          
          <div className="border-t border-border pt-6">
            <h4 className="font-semibold mb-3">Your Zodiac Personality</h4>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <p className="text-muted-foreground mb-6">
                {zodiacDescription}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
