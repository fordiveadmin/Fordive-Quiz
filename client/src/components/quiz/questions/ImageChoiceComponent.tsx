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

interface QuizQuestion {
  id: number;
  text: string;
  type: string;
  order: number;
  options: Option[];
}

interface Props {
  question: QuizQuestion;
}

export function ImageChoiceComponent({ question }: Props) {
  const { answers, addAnswer } = useStore();
  const [selectedOption, setSelectedOption] = useState<string | null>(
    answers[question.id] ? answers[question.id][0] : null
  );

  const handleSelect = (optionId: string, option: Option) => {
    setSelectedOption(optionId);
    addAnswer(question.id, [optionId, option.text, option.scentMappings]);

    // If this is in the QuizContainer component, auto navigation would happen here
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-medium text-center mb-8"
      >
        {question.text}
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {question.options.map((option) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`
              relative flex flex-col border rounded-lg overflow-hidden cursor-pointer transition-all
              ${option.id === selectedOption ? 
                'border-[#C89F65] ring-2 ring-[#C89F65]/50 shadow-md' : 
                'border-gray-200 hover:border-[#C89F65]'}
            `}
            onClick={() => handleSelect(option.id, option)}
          >
            {/* Image */}
            {option.imageUrl && (
              <div className="w-full h-48 overflow-hidden">
                <img 
                  src={option.imageUrl} 
                  alt={option.text} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/400x300?text=Image+Not+Found';
                  }}
                />
              </div>
            )}
            
            {/* Text content */}
            <div className="p-4 flex-grow">
              <h3 className="text-lg font-medium text-center mb-2">{option.text}</h3>
              
              {/* Description if available */}
              {option.description && (
                <p className="text-sm text-gray-600 text-center">{option.description}</p>
              )}
            </div>
            
            {/* Selected indicator */}
            {option.id === selectedOption && (
              <div className="absolute right-3 top-3 bg-[#C89F65] rounded-full p-1">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}