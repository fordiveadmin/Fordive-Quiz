import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Check } from 'lucide-react';

interface ParallaxScrollLayoutProps {
  options: {
    id: string;
    text: string;
    description?: string;
    imageUrl?: string;
  }[];
  selectedOption: string;
  onSelect: (optionId: string, option: any) => void;
}

export default function ParallaxScrollLayout({ options, selectedOption, onSelect }: ParallaxScrollLayoutProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollY = useMotionValue(0);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        scrollY.set(scrollTop);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [scrollY]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.95
    },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.8
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className="max-h-[70vh] overflow-y-auto scrollbar-hide space-y-6 px-4"
      style={{ scrollBehavior: 'smooth' }}
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {options.map((option, index) => {
          // Create parallax transforms for each option
          const imageY = useTransform(
            scrollY, 
            [index * 200 - 200, index * 200 + 400], 
            [-50, 50]
          );
          
          const textY = useTransform(
            scrollY, 
            [index * 200 - 200, index * 200 + 400], 
            [-20, 20]
          );
          
          const overlayOpacity = useTransform(
            scrollY,
            [index * 200 - 100, index * 200 + 200],
            [0.3, 0.7]
          );

          // Spring animations for smooth movement
          const springImageY = useSpring(imageY, { stiffness: 300, damping: 30 });
          const springTextY = useSpring(textY, { stiffness: 400, damping: 40 });

          return (
            <motion.div
              key={option.id}
              variants={item}
              className="relative group cursor-pointer"
              onHoverStart={() => setHoveredOption(option.id)}
              onHoverEnd={() => setHoveredOption(null)}
              onClick={() => onSelect(option.id, option)}
            >
              <div
                className={`
                  relative overflow-hidden rounded-2xl h-64 md:h-72 transition-all duration-500 ease-out
                  ${selectedOption === option.id 
                    ? 'ring-4 ring-[#d2b183] shadow-2xl shadow-[#d2b183]/30 scale-105' 
                    : hoveredOption === option.id 
                      ? 'shadow-xl scale-102 ring-2 ring-[#d2b183]/50' 
                      : 'shadow-lg hover:shadow-xl'
                  }
                `}
              >
                {/* Parallax Background Image */}
                {option.imageUrl && (
                  <motion.div
                    style={{ y: springImageY }}
                    className="absolute inset-0 w-full h-[120%] -top-[10%]"
                  >
                    <img
                      src={option.imageUrl}
                      alt={option.text}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </motion.div>
                )}

                {/* Dynamic Overlay */}
                <motion.div
                  style={{ opacity: overlayOpacity }}
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                />

                {/* Parallax Text Content */}
                <motion.div
                  style={{ y: springTextY }}
                  className="absolute bottom-0 left-0 right-0 p-6 z-10"
                >
                  <div className="space-y-3">
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="text-2xl md:text-3xl font-bold text-white font-playfair leading-tight"
                    >
                      {option.text}
                    </motion.h3>
                    
                    {option.description && (
                      <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                        className="text-white/90 text-sm md:text-base leading-relaxed"
                      >
                        {option.description}
                      </motion.p>
                    )}
                  </div>
                </motion.div>

                {/* Selection Indicator */}
                {selectedOption === option.id && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                    className="absolute top-4 right-4 z-20"
                  >
                    <div className="bg-[#d2b183] rounded-full p-2 shadow-lg">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                  </motion.div>
                )}

                {/* Hover Glow Effect */}
                {hoveredOption === option.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-br from-[#d2b183]/20 to-transparent pointer-events-none"
                  />
                )}

                {/* Depth Layers for 3D Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none" />
                
                {/* Edge Highlight */}
                <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />
              </div>

              {/* Floating Selection Indicator */}
              {selectedOption === option.id && (
                <motion.div
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 z-30"
                >
                  <div className="bg-[#d2b183] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    Selected
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex justify-center py-4"
      >
        <div className="flex space-x-1">
          {options.map((_, index) => (
            <motion.div
              key={index}
              className="w-2 h-2 rounded-full bg-gray-300"
              animate={{
                backgroundColor: index === 0 ? '#d2b183' : '#e5e5e5'
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </motion.div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scale-102 {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}