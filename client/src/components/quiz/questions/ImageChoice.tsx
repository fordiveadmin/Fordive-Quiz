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
                relative flex flex-col items-center justify-center p-6 md:p-12 rounded-lg cursor-pointer transition-all
                ${option.id === selectedOption ? 
                  'bg-[#d2b183] text-white' : 
                  'bg-[#f5f1e9] hover:bg-[#e6ddca] text-gray-800'}
              `}
              onClick={() => handleSelect(option.id, option)}
              style={{ minHeight: '200px' }}
            >
              {/* Option Text */}
              <h3 className="text-lg md:text-xl font-medium uppercase tracking-wide text-center mb-2" style={{ width: '100%', textAlign: 'center' }}>{option.text}</h3>
              
              {/* Description if available */}
              {option.description && (
                <p className="text-sm text-center">{option.description}</p>
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
                  'bg-[#f5f1e9] border-[#d2b183] shadow-md' : 
                  'bg-white border-gray-200 hover:border-[#d2b183]'}
              `}
              onClick={() => handleSelect(option.id, option)}
            >
              <h3 className="text-lg font-medium uppercase text-center mb-2">{option.text}</h3>
              
              {/* Description if available */}
              {option.description && (
                <p className="text-sm text-gray-600">{option.description}</p>
              )}
              
              {/* Selected indicator */}
              {option.id === selectedOption && (
                <div className="absolute right-4 top-4">
                  <Check className="h-5 w-5 text-[#d2b183]" />
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