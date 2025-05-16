import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Option {
  id: string;
  text: string;
  description?: string;
  imageUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  scentMappings: Record<string, number>;
}

interface ImageChoiceProps {
  question: {
    id: number;
    text: string;
    backgroundColor?: string;
    textColor?: string;
    options: Option[];
  };
  selectedOption: string | null;
  onChange: (optionId: string) => void;
}

export default function ImageChoice({ question, selectedOption, onChange }: ImageChoiceProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  // Animation variants
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

  return (
    <div className={cn(
      "rounded-lg p-8 w-full", 
      question.backgroundColor ? question.backgroundColor : "bg-white"
    )}>
      <h2 
        className={cn(
          "text-3xl font-medium text-center mb-10",
          question.textColor ? question.textColor : "text-gray-800"
        )}
      >
        {question.text}
      </h2>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
      >
        {question.options.map((option) => (
          <motion.div
            key={option.id}
            variants={item}
            className={cn(
              "relative flex flex-col items-center p-6 rounded-lg transition-all cursor-pointer",
              option.backgroundColor ? option.backgroundColor : "bg-[#F2ECE3]",
              selectedOption === option.id ? "ring-2 ring-[#C89F65] shadow-md" : "hover:shadow-md",
            )}
            onMouseEnter={() => setHoveredOption(option.id)}
            onMouseLeave={() => setHoveredOption(null)}
            onClick={() => onChange(option.id)}
          >
            <div className="w-24 h-24 rounded-full flex items-center justify-center bg-white mb-4">
              {option.imageUrl ? (
                <img 
                  src={option.imageUrl} 
                  alt={option.text} 
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <div className="w-12 h-12 flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                </div>
              )}
            </div>
            
            <h3 
              className={cn(
                "text-lg font-medium text-center",
                option.textColor ? option.textColor : "text-gray-800"
              )}
            >
              {option.text}
            </h3>
            
            {option.description && (
              <p className="text-sm text-gray-600 mt-2 text-center">
                {option.description}
              </p>
            )}
            
            {selectedOption === option.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-[#C89F65] text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}