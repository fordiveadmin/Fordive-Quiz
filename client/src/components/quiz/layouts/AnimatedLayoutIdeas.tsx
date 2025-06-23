import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

// Layout Idea 1: Floating Cards with Parallax Effect
export function FloatingCardsLayout({ options, selectedOption, onSelect }: any) {
  return (
    <div className="relative min-h-[500px] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {options.map((option: any, index: number) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 50, rotateY: -15 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              rotateY: 0,
              scale: selectedOption === option.id ? 1.05 : 1
            }}
            transition={{ 
              delay: index * 0.2,
              duration: 0.6,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              y: -10, 
              rotateX: 5,
              transition: { duration: 0.3 }
            }}
            className={`
              relative cursor-pointer rounded-2xl overflow-hidden shadow-xl
              ${selectedOption === option.id ? 
                'ring-4 ring-[#d2b183] shadow-2xl' : 
                'hover:shadow-2xl'
              }
            `}
            onClick={() => onSelect(option.id, option)}
            style={{
              background: selectedOption === option.id ? 
                'linear-gradient(135deg, #d2b183 0%, #c4a05b 100%)' :
                'linear-gradient(135deg, #ffffff 0%, #f8f6f0 100%)'
            }}
          >
            {/* Floating particles effect */}
            {selectedOption === option.id && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/30 rounded-full"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: Math.random() * 300,
                      y: Math.random() * 400,
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>
            )}
            
            {/* Image with zoom effect */}
            <div className="relative h-64 overflow-hidden">
              <motion.img
                src={option.imageUrl}
                alt={option.text}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            
            {/* Content */}
            <div className="p-6 text-center">
              <h3 className={`text-xl font-playfair font-semibold mb-2 ${
                selectedOption === option.id ? 'text-white' : 'text-gray-800'
              }`}>
                {option.text}
              </h3>
              {option.description && (
                <p className={`text-sm ${
                  selectedOption === option.id ? 'text-white/90' : 'text-gray-600'
                }`}>
                  {option.description}
                </p>
              )}
            </div>
            
            {/* Selection indicator */}
            {selectedOption === option.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 bg-white rounded-full p-2"
              >
                <Check className="h-5 w-5 text-[#d2b183]" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Layout Idea 2: Morphing Carousel with 3D Rotation
export function MorphingCarouselLayout({ options, selectedOption, onSelect }: any) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  return (
    <div className="relative h-[500px] flex items-center justify-center perspective-1000">
      <div className="relative w-full max-w-4xl">
        {options.map((option: any, index: number) => {
          const offset = index - activeIndex;
          const isActive = index === activeIndex;
          
          return (
            <motion.div
              key={option.id}
              className={`
                absolute top-0 left-1/2 w-80 h-96 cursor-pointer
                ${selectedOption === option.id ? 
                  'ring-4 ring-[#d2b183]' : ''
                }
              `}
              style={{
                transformOrigin: 'center center',
              }}
              animate={{
                x: offset * 300 - 160,
                rotateY: offset * 45,
                scale: isActive ? 1 : 0.8,
                opacity: Math.abs(offset) > 2 ? 0 : 1,
                zIndex: isActive ? 10 : 5 - Math.abs(offset),
              }}
              transition={{ 
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              onClick={() => {
                setActiveIndex(index);
                onSelect(option.id, option);
              }}
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-white">
                {/* Morphing background */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: selectedOption === option.id ?
                      'linear-gradient(45deg, #d2b183, #c4a05b, #d2b183)' :
                      'linear-gradient(45deg, #f8f6f0, #ffffff, #f8f6f0)'
                  }}
                  transition={{ duration: 0.5 }}
                />
                
                {/* Image with liquid morphing effect */}
                <div className="relative h-2/3 overflow-hidden">
                  <motion.img
                    src={option.imageUrl}
                    alt={option.text}
                    className="w-full h-full object-cover"
                    animate={{
                      filter: selectedOption === option.id ? 
                        'brightness(1.1) contrast(1.1)' : 
                        'brightness(1) contrast(1)'
                    }}
                  />
                  
                  {/* Liquid overlay effect */}
                  {selectedOption === option.id && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-[#d2b183]/20 to-transparent"
                      animate={{
                        backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                  <h3 className={`text-lg font-playfair font-semibold mb-2 ${
                    selectedOption === option.id ? 'text-white' : 'text-gray-800'
                  }`}>
                    {option.text}
                  </h3>
                </div>
              </div>
            </motion.div>
          );
        })}
        
        {/* Navigation dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {options.map((_: any, index: number) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === activeIndex ? 'bg-[#d2b183]' : 'bg-gray-300'
              }`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Layout Idea 3: Magnetic Grid with Attraction Effect
export function MagneticGridLayout({ options, selectedOption, onSelect }: any) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {options.map((option: any, index: number) => (
        <motion.div
          key={option.id}
          className="relative"
          onMouseEnter={() => setHoveredCard(option.id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <motion.div
            className={`
              relative cursor-pointer rounded-xl overflow-hidden
              ${selectedOption === option.id ? 
                'ring-4 ring-[#d2b183] shadow-2xl' : 
                'shadow-lg hover:shadow-xl'
              }
            `}
            animate={{
              scale: selectedOption === option.id ? 1.05 : hoveredCard === option.id ? 1.03 : 1,
              rotateZ: selectedOption === option.id ? 2 : 0,
            }}
            // Magnetic attraction effect to nearby cards
            style={{
              transformOrigin: 'center center',
            }}
            transition={{ 
              duration: 0.3,
              type: "spring",
              stiffness: 200
            }}
            onClick={() => onSelect(option.id, option)}
          >
            {/* Magnetic field visualization */}
            {selectedOption === option.id && (
              <motion.div
                className="absolute -inset-4 border-2 border-[#d2b183]/30 rounded-2xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
            
            {/* Card content */}
            <div className="relative bg-white">
              {/* Image with magnetic distortion effect */}
              <div className="relative h-48 overflow-hidden">
                <motion.img
                  src={option.imageUrl}
                  alt={option.text}
                  className="w-full h-full object-cover"
                  animate={{
                    filter: selectedOption === option.id ? 
                      'hue-rotate(10deg) saturate(1.2)' : 
                      'hue-rotate(0deg) saturate(1)'
                  }}
                />
                
                {/* Magnetic energy lines */}
                {selectedOption === option.id && (
                  <div className="absolute inset-0">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute h-0.5 bg-[#d2b183]/50"
                        style={{
                          left: '10%',
                          right: '10%',
                          top: `${30 + i * 20}%`,
                        }}
                        animate={{
                          scaleX: [0, 1, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="p-4 text-center">
                <h3 className="text-lg font-playfair font-semibold text-gray-800">
                  {option.text}
                </h3>
              </div>
            </div>
          </motion.div>
          
          {/* Surrounding cards get subtle attraction effect */}
          {hoveredCard && hoveredCard !== option.id && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                x: hoveredCard ? (Math.random() - 0.5) * 4 : 0,
                y: hoveredCard ? (Math.random() - 0.5) * 4 : 0,
              }}
              transition={{ duration: 0.2 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

// Layout Idea 4: Liquid Bubble Stack
export function LiquidBubbleLayout({ options, selectedOption, onSelect }: any) {
  return (
    <div className="relative min-h-[600px] flex flex-wrap justify-center items-center gap-4 p-8">
      {options.map((option: any, index: number) => {
        const size = selectedOption === option.id ? 240 : 180 + (index % 3) * 20;
        
        return (
          <motion.div
            key={option.id}
            className="relative cursor-pointer"
            style={{
              width: size,
              height: size,
            }}
            animate={{
              scale: selectedOption === option.id ? 1.1 : 1,
              y: selectedOption === option.id ? -10 : Math.sin(Date.now() / 1000 + index) * 5,
            }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 100
            }}
            onClick={() => onSelect(option.id, option)}
          >
            {/* Liquid bubble effect */}
            <motion.div
              className={`
                relative w-full h-full rounded-full overflow-hidden shadow-2xl
                ${selectedOption === option.id ? 
                  'ring-4 ring-[#d2b183]' : ''
                }
              `}
              animate={{
                borderRadius: selectedOption === option.id ? 
                  ['50%', '60% 40%', '40% 60%', '50%'] : '50%',
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                background: selectedOption === option.id ?
                  'linear-gradient(45deg, #d2b183, #c4a05b)' :
                  'linear-gradient(45deg, #ffffff, #f8f6f0)'
              }}
            >
              {/* Bubble surface effect */}
              <motion.div
                className="absolute inset-2 rounded-full overflow-hidden"
                animate={{
                  borderRadius: ['50%', '45% 55%', '55% 45%', '50%'],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <img
                  src={option.imageUrl}
                  alt={option.text}
                  className="w-full h-full object-cover"
                />
                
                {/* Liquid surface reflection */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </motion.div>
              
              {/* Floating text */}
              <motion.div
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center"
                animate={{
                  y: selectedOption === option.id ? [0, -5, 0] : 0,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <h3 className={`text-sm font-playfair font-semibold ${
                  selectedOption === option.id ? 'text-white' : 'text-gray-800'
                }`}>
                  {option.text}
                </h3>
              </motion.div>
            </motion.div>
            
            {/* Bubble shine effect */}
            <motion.div
              className="absolute top-6 left-6 w-8 h-8 bg-white/40 rounded-full blur-sm"
              animate={{
                scale: selectedOption === option.id ? [1, 1.2, 1] : 1,
                opacity: selectedOption === option.id ? [0.4, 0.7, 0.4] : 0.4,
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

// Layout Idea 5: Holographic Tiles with Depth Effect
export function HolographicTilesLayout({ options, selectedOption, onSelect }: any) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
      {options.map((option: any, index: number) => {
        const isSelected = selectedOption === option.id;
        
        return (
          <motion.div
            key={option.id}
            className="relative group cursor-pointer"
            initial={{ opacity: 0, z: -100 }}
            animate={{ 
              opacity: 1, 
              z: isSelected ? 50 : 0,
              rotateX: isSelected ? 5 : 0,
              rotateY: isSelected ? 5 : 0,
            }}
            transition={{ 
              delay: index * 0.1,
              duration: 0.6,
              type: "spring"
            }}
            onClick={() => onSelect(option.id, option)}
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            <div
              className={`
                relative w-full h-80 rounded-2xl overflow-hidden shadow-xl
                ${isSelected ? 
                  'ring-4 ring-[#d2b183] shadow-2xl' : 
                  'group-hover:shadow-2xl'
                }
              `}
              style={{
                background: isSelected ?
                  'linear-gradient(135deg, #d2b183 0%, #c4a05b 50%, #d2b183 100%)' :
                  'linear-gradient(135deg, #ffffff 0%, #f8f6f0 100%)',
                transform: `perspective(1000px) rotateX(${(mousePosition.y - window.innerHeight/2) * 0.01}deg) rotateY(${(mousePosition.x - window.innerWidth/2) * 0.01}deg)`,
              }}
            >
              {/* Holographic shimmer effect */}
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  background: [
                    'linear-gradient(45deg, transparent, rgba(210, 177, 131, 0.3), transparent)',
                    'linear-gradient(135deg, transparent, rgba(210, 177, 131, 0.3), transparent)',
                    'linear-gradient(225deg, transparent, rgba(210, 177, 131, 0.3), transparent)',
                    'linear-gradient(315deg, transparent, rgba(210, 177, 131, 0.3), transparent)',
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Image with holographic effect */}
              <div className="relative h-3/5 overflow-hidden">
                <motion.img
                  src={option.imageUrl}
                  alt={option.text}
                  className="w-full h-full object-cover"
                  animate={{
                    filter: isSelected ? 
                      'hue-rotate(10deg) saturate(1.3) brightness(1.1)' : 
                      'hue-rotate(0deg) saturate(1) brightness(1)'
                  }}
                />
                
                {/* Depth layers */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              </div>
              
              {/* Content with holographic text effect */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                <motion.h3
                  className={`text-xl font-playfair font-semibold mb-2 ${
                    isSelected ? 'text-white' : 'text-gray-800'
                  }`}
                  animate={{
                    textShadow: isSelected ? 
                      '0 0 10px rgba(255, 255, 255, 0.5)' : 
                      '0 0 0px rgba(255, 255, 255, 0)'
                  }}
                >
                  {option.text}
                </motion.h3>
                {option.description && (
                  <p className={`text-sm ${
                    isSelected ? 'text-white/90' : 'text-gray-600'
                  }`}>
                    {option.description}
                  </p>
                )}
              </div>
              
              {/* Holographic border effect */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-white/30"
                  animate={{
                    borderColor: [
                      'rgba(255, 255, 255, 0.3)',
                      'rgba(210, 177, 131, 0.8)',
                      'rgba(255, 255, 255, 0.3)',
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              )}
            </div>
            
            {/* 3D depth shadow */}
            <div
              className="absolute inset-0 bg-gray-800/20 rounded-2xl blur-xl"
              style={{
                transform: 'translateZ(-20px) translateY(10px)',
                zIndex: -1,
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}