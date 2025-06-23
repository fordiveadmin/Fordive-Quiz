import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface FloatingBubbleLayoutProps {
  options: {
    id: string;
    text: string;
    description?: string;
    imageUrl?: string;
  }[];
  selectedOption: string;
  onSelect: (optionId: string, option: any) => void;
}

export default function FloatingBubbleLayout({ options, selectedOption, onSelect }: FloatingBubbleLayoutProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  // Create floating animation variants for each bubble
  const getFloatingVariants = (index: number) => ({
    floating: {
      y: [0, -8, 0],
      transition: {
        duration: 3 + (index * 0.5), // Different duration for each bubble
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.3, // Staggered start times
      }
    }
  });

  const bubbleVariants = {
    initial: { 
      scale: 0,
      opacity: 0,
      y: 50
    },
    animate: { 
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    selected: {
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-wrap justify-center gap-8 py-8 px-4"
    >
      {options.map((option, index) => (
        <motion.div
          key={option.id}
          variants={bubbleVariants}
          initial="initial"
          animate={[
            "animate",
            selectedOption === option.id ? "selected" : hoveredOption === option.id ? "hover" : "floating"
          ]}
          custom={getFloatingVariants(index)}
          onHoverStart={() => setHoveredOption(option.id)}
          onHoverEnd={() => setHoveredOption(null)}
          onClick={() => onSelect(option.id, option)}
          className="relative cursor-pointer"
        >
          {/* Main bubble */}
          <div className="relative">
            {/* Glow effect for selected state */}
            {selectedOption === option.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 rounded-full bg-[#d2b183] opacity-30 blur-lg transform scale-110"
              />
            )}
            
            {/* Bubble container */}
            <div
              className={`
                relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden
                border-4 transition-all duration-300 shadow-lg
                ${selectedOption === option.id 
                  ? 'border-[#d2b183] shadow-[#d2b183]/50' 
                  : 'border-white/50 hover:border-[#d2b183]/50'
                }
              `}
            >
              {/* Image */}
              {option.imageUrl && (
                <img
                  src={option.imageUrl}
                  alt={option.text}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Selection indicator */}
              {selectedOption === option.id && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute top-2 right-2 bg-[#d2b183] rounded-full p-1.5 shadow-lg"
                >
                  <Check className="h-4 w-4 text-white" />
                </motion.div>
              )}
              
              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                <h3 className="text-white text-sm md:text-base font-semibold leading-tight drop-shadow-lg">
                  {option.text}
                </h3>
              </div>
            </div>
          </div>
          
          {/* Description below bubble */}
          {option.description && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (index * 0.1) }}
              className="mt-4 text-center max-w-[160px]"
            >
              <p className="text-sm text-gray-600 leading-relaxed">
                {option.description}
              </p>
            </motion.div>
          )}
          
          {/* Floating particles effect for selected state */}
          {selectedOption === option.id && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 0, 
                    scale: 0,
                    x: Math.random() * 160 - 80,
                    y: Math.random() * 160 - 80
                  }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0, 1, 0],
                    y: [0, -20, -40],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeOut"
                  }}
                  className="absolute w-1 h-1 bg-[#d2b183] rounded-full"
                  style={{
                    left: `${20 + (i * 15)}%`,
                    top: '50%'
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}