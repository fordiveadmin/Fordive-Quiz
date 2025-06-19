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

interface GenderChoiceProps {
  question: {
    id: number;
    text: string;
    options: Option[];
  };
}

export default function GenderChoice({ question }: GenderChoiceProps) {
  const { answers, setAnswer } = useStore();
  const selectedOption = answers[question.id]?.optionId;

  const handleSelect = (optionId: string, option: Option) => {
    setAnswer(question.id.toString(), {
      optionId: optionId,
      scentMappings: option.scentMappings,
    });
  };
  
  // Gender icons
  const genderIcons: Record<string, JSX.Element> = {
    'male': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <circle cx="12" cy="7" r="5"/>
        <path d="M12 12v10M7 17h10"/>
      </svg>
    ),
    'female': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <circle cx="12" cy="8" r="5"/>
        <path d="M12 13v8M9 18h6"/>
      </svg>
    ),
    'neutral': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <circle cx="12" cy="7" r="5"/>
        <path d="M12 12v7M9 16h6M9 20h6"/>
      </svg>
    )
  };
  
  return (
    <div className="w-full">
      <motion.h2 
        className="text-2xl md:text-3xl font-playfair text-center mb-10" 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {question.text}
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
        {/* Left side: Question + helper text */}
        <div className="flex flex-col items-start justify-center p-8">
          <h2 className="text-3xl md:text-4xl font-playfair mb-4">
            WHAT IS YOUR<br />GENDER?
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Select only 1. <button className="underline">Learn More</button>
          </p>
        </div>
        
        {/* Right side: Options */}
        <div className="flex flex-col">
          {question.options.map((option) => {
            const isSelected = option.id === selectedOption;
            const genderKey = option.text.toLowerCase();
            
            // Determine background color based on gender
            let bgColor = "bg-[#EEDFCA]";
            let textColor = "text-gray-900";
            
            if (genderKey.includes("male")) {
              bgColor = isSelected ? "bg-[#d2b183]" : "bg-[#EEDFCA]";
              textColor = isSelected ? "text-white" : "text-gray-900";
            } else if (genderKey.includes("female")) {
              bgColor = isSelected ? "bg-[#d2b183]" : "bg-[#E5D5B8]"; 
              textColor = isSelected ? "text-white" : "text-gray-900";
            } else {
              bgColor = isSelected ? "bg-[#d2b183]" : "bg-[#EDE3D1]";
              textColor = isSelected ? "text-white" : "text-gray-900";
            }
            
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * parseInt(option.id) }}
                className={`${bgColor} ${textColor} flex items-center justify-between p-6 cursor-pointer transition-all duration-300 mb-1`}
                onClick={() => handleSelect(option.id, option)}
              >
                <div className="flex items-center">
                  <div className="mr-4">
                    {genderIcons[genderKey] || 
                     <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                       {option.text.charAt(0)}
                     </div>}
                  </div>
                  <span className="uppercase font-medium">{option.text}</span>
                </div>
                
                {isSelected && (
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}