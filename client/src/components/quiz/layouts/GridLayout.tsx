import { useState } from 'react';
import { useStore } from '@/store/quizStore';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Option {
  id: string;
  text: string;
  description?: string;
  imageUrl?: string;
  scentMappings: Record<string, number>;
}

interface GridLayoutProps {
  question: {
    id: number;
    text: string;
    options: Option[];
  };
}

export default function GridLayout({ question }: GridLayoutProps) {
  const { answers, setAnswer } = useStore();
  const selectedOption = answers[question.id]?.optionId;
  
  // Animation variants for staggered children
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

  const handleSelect = (optionId: string, option: Option) => {
    setAnswer(
      question.id.toString(),
      {
        optionId: optionId,
        scentMappings: option.scentMappings,
      }
    );
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

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 px-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {question.options.map((option) => (
          <motion.div
            key={option.id}
            variants={item}
            className={`
              relative p-6 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg
              ${option.id === selectedOption ? 
                'bg-[#1f1f1f] text-white shadow-md' : 
                'bg-[#f5f1e9] hover:bg-[#e6ddca] text-gray-800'}
            `}
            onClick={() => handleSelect(option.id, option)}
            style={{ minHeight: '220px' }}
          >
            {/* Top section */}
            <div className="flex flex-col items-center justify-start h-full">
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
                <div className="bg-[#C89F65] rounded-full p-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
      
      {/* Helper text */}
      <div className="text-center text-sm text-gray-500 mt-6">
        {selectedOption ? '' : 'Select one option to continue'}
      </div>
    </div>
  );
}