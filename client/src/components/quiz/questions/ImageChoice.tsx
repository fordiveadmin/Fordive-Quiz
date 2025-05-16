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

interface ImageChoiceProps {
  question: {
    id: number;
    text: string;
    options: Option[];
  };
}

export default function ImageChoice({ question }: ImageChoiceProps) {
  const { answers, setAnswer } = useStore();
  const selectedOption = answers[question.id]?.optionId;

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
    <div className="w-full space-y-6 max-w-[800px] mx-auto">
      <motion.h2 
        className="text-2xl md:text-3xl font-playfair text-center mb-10 px-4" 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {question.text}
      </motion.h2>

      {/* Simple split layout - always use this design for consistency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option) => {
          const isSelected = option.id === selectedOption;
          
          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`
                relative flex flex-col items-center justify-center p-6 md:p-8 cursor-pointer transition-all
                ${isSelected ? 
                  'bg-[#27241F] text-white' : 
                  'bg-[#f5f1e9] hover:bg-[#e6ddca] text-gray-800'}
              `}
              onClick={() => handleSelect(option.id, option)}
              style={{ height: '160px' }}
            >
              {/* Center content */}
              <div className="flex flex-col items-center">
                {/* Circle with letter or image */}
                <div className={`
                  ${isSelected ? 'bg-white text-[#27241F]' : 'bg-white text-[#27241F]'} 
                  rounded-full w-16 h-16 flex items-center justify-center mb-4
                `}>
                  {option.imageUrl ? (
                    <img src={option.imageUrl} alt={option.text} className="w-10 h-10 object-contain" />
                  ) : (
                    <span className="text-2xl lowercase font-medium">{option.text.charAt(0)}</span>
                  )}
                </div>
                
                {/* Option Text */}
                <h3 className="font-playfair uppercase tracking-wide text-center">
                  {option.text}
                </h3>
              </div>
              
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute right-4 top-4">
                  <Check className="h-5 w-5" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* Helper text */}
      <div className="text-center text-sm text-gray-500 mt-4">
        {selectedOption ? '' : 'Select one option to continue'}
      </div>
    </div>
  );
}