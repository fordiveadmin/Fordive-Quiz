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

  // Determine if we should use the split or grid layout based on number of options
  const isGridLayout = question.options.length > 2;
  
  return (
    <div className="w-full space-y-6">
      <motion.h2 
        className="text-2xl md:text-3xl font-playfair text-center mb-10 px-4" 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {question.text}
      </motion.h2>

      {!isGridLayout ? (
        // Split layout (half screen per option) - good for 2 options
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`
                relative flex flex-col items-center p-6 md:p-12 rounded-lg cursor-pointer transition-all
                ${option.id === selectedOption ? 
                  'bg-[#1f1f1f] text-white' : 
                  'bg-[#f5f1e9] hover:bg-[#e6ddca] text-gray-800'}
              `}
              onClick={() => handleSelect(option.id, option)}
              style={{ minHeight: '200px' }}
            >
              {/* Icon or Image */}
              <div className="bg-[#f5f1e9] rounded-full p-4 w-24 h-24 flex items-center justify-center mb-4">
                {option.imageUrl ? (
                  <img src={option.imageUrl} alt={option.text} className="w-16 h-16 object-contain" />
                ) : (
                  <div className="text-4xl">{option.text.charAt(0)}</div>
                )}
              </div>
              
              {/* Option Text */}
              <h3 className="text-xl font-medium uppercase tracking-wide text-center">{option.text}</h3>
              
              {/* Description if available */}
              {option.description && (
                <p className="mt-2 text-sm text-center">{option.description}</p>
              )}
              
              {/* Selected indicator */}
              {option.id === selectedOption && (
                <div className="absolute right-4 top-4">
                  <Check className="h-6 w-6 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        // Grid layout for 3+ options
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {question.options.map((option) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`
                relative border rounded-lg p-6 cursor-pointer transition-all
                ${option.id === selectedOption ? 
                  'bg-[#f5f1e9] border-[#C89F65] shadow-md' : 
                  'bg-white border-gray-200 hover:border-[#C89F65]'}
              `}
              onClick={() => handleSelect(option.id, option)}
            >
              <h3 className="text-lg font-medium mb-2">{option.text}</h3>
              
              {/* Description if available */}
              {option.description && (
                <p className="text-sm text-gray-600">{option.description}</p>
              )}
              
              {/* Selected indicator */}
              {option.id === selectedOption && (
                <div className="absolute right-4 top-4">
                  <Check className="h-5 w-5 text-[#C89F65]" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Helper text */}
      <div className="text-center text-sm text-gray-500 mt-4">
        {selectedOption ? '' : 'Select one option to continue'}
      </div>
    </div>
  );
}