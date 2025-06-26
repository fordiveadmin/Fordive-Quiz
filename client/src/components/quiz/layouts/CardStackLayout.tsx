import { useState, useRef } from 'react';
import { useStore } from '@/store/quizStore';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface Option {
  id: string;
  text: string;
  description?: string;
  imageUrl?: string;
  scentMappings: Record<string, number>;
}

interface CardStackLayoutProps {
  question: {
    id: number;
    text: string;
    options: Option[];
  };
}

export default function CardStackLayout({ question }: CardStackLayoutProps) {
  const { answers, setAnswer } = useStore();
  const selectedOption = answers[question.id]?.optionId;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const options = question.options;
  const constraintsRef = useRef(null);

  const handleSelect = (optionId: string, option: Option) => {
    setAnswer(
      question.id.toString(),
      {
        optionId: optionId,
        scentMappings: option.scentMappings,
      }
    );
  };

  const goToNext = () => {
    if (activeIndex < options.length - 1) {
      setActiveIndex(prev => prev + 1);
    }
  };

  const goToPrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 50;
    
    if (info.offset.x > threshold) {
      // Dragged right - go to previous
      goToPrev();
    } else if (info.offset.x < -threshold) {
      // Dragged left - go to next
      goToNext();
    }
  };

  // Calculate z-index and transforms for 3D effect
  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const absPosition = Math.abs(diff);
    
    // Base styles
    let zIndex = 10 - absPosition;
    let opacity = 1 - (absPosition * 0.2);
    let scale = 1 - (absPosition * 0.05);
    let translateY = 0;
    let rotateY = 0;
    
    // Apply 3D transformations based on position
    if (diff < 0) {
      // Cards before active card
      translateY = -10 * absPosition;
      rotateY = -10 * absPosition;
      opacity = 0.7 - (absPosition * 0.1);
    } else if (diff > 0) {
      // Cards after active card
      translateY = 10 * absPosition;
      rotateY = 10 * absPosition;
    }
    
    // Hide cards that are too far away
    if (absPosition > 2) {
      opacity = 0;
    }
    
    return {
      zIndex,
      opacity,
      transform: `perspective(1000px) translateY(${translateY}px) scale(${scale}) rotateY(${rotateY}deg)`,
      transition: 'all 0.5s ease-out'
    };
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.h2 
        className="text-2xl md:text-3xl font-playfair text-center mb-10 px-4" 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {question.text}
      </motion.h2>

      <div className="relative h-[400px] w-full flex items-center justify-center" ref={constraintsRef}>
        <div className="relative w-full max-w-md mx-auto h-[300px]">
          {options.map((option, index) => (
            <motion.div
              key={option.id}
              className={`
                absolute top-0 left-0 right-0 flex flex-col h-[400px] rounded-lg cursor-pointer shadow-lg overflow-hidden
                ${option.id === selectedOption ? 
                  'bg-[#d2b183] text-white border-4 border-[#d2b183] ring-4 ring-[#d2b183]/30' : 
                  'bg-[#f5f1e9] hover:bg-[#e6ddca] text-gray-800 border-2 border-transparent hover:border-[#d2b183]/50'}
                transform-gpu transition-all duration-300
                ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
              `}
              style={getCardStyle(index)}
              drag={index === activeIndex ? "x" : false}
              dragConstraints={constraintsRef}
              dragElastic={0.3}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
              onClick={() => {
                if (!isDragging) {
                  setActiveIndex(index);
                  handleSelect(option.id, option);
                }
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Full-sized image */}
              {option.imageUrl && (
                <div className="w-full h-2/3 overflow-hidden">
                  <img 
                    src={option.imageUrl} 
                    alt={option.text} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Content section */}
              <div className="flex-1 p-6 flex flex-col justify-center">
                <h3 className="text-xl font-medium text-center mb-2">{option.text}</h3>
                {option.description && (
                  <p className="text-sm text-center opacity-90">{option.description}</p>
                )}
              </div>
              
              {/* Selection indicator */}
              {option.id === selectedOption && (
                <div className="absolute top-4 right-4">
                  <div className="bg-white rounded-full p-2 shadow-lg">
                    <Check className="h-5 w-5 text-[#d2b183]" />
                  </div>
                </div>
              )}
              
              {/* Tap indicator for active card */}
              {index === activeIndex && option.id !== selectedOption && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#d2b183] text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse">
                    Tap to Select
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Navigation buttons - hidden on mobile */}
        <button 
          className="absolute left-4 md:left-10 bg-[#d2b183]/80 hover:bg-[#d2b183] text-white rounded-full p-2 transition-colors duration-300 hidden md:block"
          onClick={(e) => {
            e.stopPropagation();
            goToPrev();
          }}
          disabled={activeIndex === 0}
          style={{ opacity: activeIndex === 0 ? 0.5 : 1 }}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button 
          className="absolute right-4 md:right-10 bg-[#d2b183]/80 hover:bg-[#d2b183] text-white rounded-full p-2 transition-colors duration-300 hidden md:block"
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          disabled={activeIndex === options.length - 1}
          style={{ opacity: activeIndex === options.length - 1 ? 0.5 : 1 }}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
      
      {/* Card indicator dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {options.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === activeIndex ? 'bg-[#d2b183]' : 'bg-gray-300'
            }`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>

      {/* Helper text and mobile instructions */}
      <div className="text-center mt-6">
        {!selectedOption ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Tap on a card to select it</p>
            <p className="text-xs text-gray-400 md:hidden">Swipe or use dots to navigate between cards</p>
          </div>
        ) : (
          <p className="text-sm text-[#d2b183] font-medium">✓ Card selected</p>
        )}
      </div>
    </div>
  );
}