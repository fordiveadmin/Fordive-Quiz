import { useState } from 'react';
import { useStore } from '@/store/quizStore';
import { motion, AnimatePresence } from 'framer-motion';
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
  const options = question.options;

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

      <div className="relative h-[400px] w-full flex items-center justify-center">
        <div className="relative w-full max-w-md mx-auto h-[300px]">
          {options.map((option, index) => (
            <motion.div
              key={option.id}
              className={`
                absolute top-0 left-0 right-0 flex flex-col h-[300px] p-6 rounded-lg cursor-pointer shadow-lg
                ${option.id === selectedOption ? 
                  'bg-[#d2b183] text-white border-2 border-[#d2b183]' : 
                  'bg-[#f5f1e9] hover:bg-[#e6ddca] text-gray-800'}
                transform-gpu
              `}
              style={getCardStyle(index)}
              onClick={() => {
                setActiveIndex(index);
                handleSelect(option.id, option);
              }}
            >
              <div className="flex flex-col items-center justify-center h-full">
                {/* Image if available */}
                {option.imageUrl && (
                  <div className="mb-4 w-full h-32 overflow-hidden rounded-md">
                    <img 
                      src={option.imageUrl} 
                      alt={option.text} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Title */}
                <h3 className="text-xl font-medium text-center mb-2">{option.text}</h3>
                
                {/* Description */}
                {option.description && (
                  <p className="text-sm text-center opacity-90">{option.description}</p>
                )}
              </div>
              
              {/* Selection indicator */}
              {option.id === selectedOption && (
                <div className="absolute top-3 right-3">
                  <div className="bg-[#d2b183] rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button 
          className="absolute left-4 md:left-10 bg-[#d2b183]/80 hover:bg-[#d2b183] text-white rounded-full p-2 transition-colors duration-300"
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
          className="absolute right-4 md:right-10 bg-[#d2b183]/80 hover:bg-[#d2b183] text-white rounded-full p-2 transition-colors duration-300"
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

      {/* Helper text */}
      <div className="text-center text-sm text-gray-500 mt-6">
        {selectedOption ? '' : 'Select a card to continue'}
      </div>
    </div>
  );
}