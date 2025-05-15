import { useMemo } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { getScentImageUrl } from '@/lib/utils';

interface SimilarScentsProps {
  currentScentId: number;
  category: string;
  allScents: any[];
}

export default function SimilarScents({ currentScentId, category, allScents }: SimilarScentsProps) {
  // Get similar scents (same category, excluding current scent)
  const similarScents = useMemo(() => {
    return allScents
      .filter(scent => scent.category === category && scent.id !== currentScentId)
      .slice(0, 3);
  }, [allScents, category, currentScentId]);
  
  if (!similarScents.length) return null;
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h3 className="text-2xl font-playfair font-semibold mb-6 text-center">You Might Also Like</h3>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {similarScents.map((scent) => (
          <motion.div
            key={scent.id}
            variants={item}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white rounded-lg overflow-hidden shadow-md"
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={(scent as any).imageUrl ? getScentImageUrl(scent.name, (scent as any).imageUrl) : getScentImageUrl(scent.name)} 
                alt={`${scent.name} Perfume`} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h4 className="font-playfair text-lg font-semibold mb-1">{scent.name}</h4>
              <p className="text-sm text-muted-foreground mb-2">{scent.vibes.join(', ')}</p>
              <p className="text-xs italic text-muted-foreground mb-3">"{scent.mood}"</p>
              <Button 
                variant="outline"
                className="w-full py-2 border border-primary text-primary hover:bg-primary hover:text-white transition duration-300 rounded-full text-sm"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
