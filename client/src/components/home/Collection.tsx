import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { getScentImageUrl } from "@/lib/utils";

interface Scent {
  id: number;
  name: string;
  vibes: string[];
  mood: string;
}

export default function Collection() {
  const { data: scents, isLoading } = useQuery<Scent[]>({
    queryKey: ['/api/scents'],
  });

  const featuredScents = scents ? scents.slice(0, 3) : [];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <section className="py-20 px-6 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-playfair font-bold text-center mb-6"
        >
          Our Signature Collection
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-muted-foreground max-w-2xl mx-auto mb-16"
        >
          Each Fordive fragrance tells a unique story, crafted to match distinct personalities and moods
        </motion.p>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                <Skeleton className="h-64 w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-40 mb-4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredScents.map((scent) => (
              <motion.div
                key={scent.id}
                variants={item}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-lg overflow-hidden shadow-md"
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={getScentImageUrl(scent.name)} 
                    alt={`${scent.name} Perfume`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-playfair text-xl font-semibold mb-2">{scent.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{scent.vibes.join(', ')}</p>
                  <p className="italic text-sm">"{scent.mood}"</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-2 px-6 rounded-full transition duration-300"
          >
            View All Fragrances
          </Button>
        </div>
      </div>
    </section>
  );
}
