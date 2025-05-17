import { useState } from 'react';
import { useStore } from '@/store/quizStore';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ImageOption {
  id: string;
  text: string;
  description?: string;
  imageUrl: string;
  scentMappings: Record<string, number>;
}

interface ImagePreferenceProps {
  question: {
    id: number;
    text: string;
    options: ImageOption[];
  };
}

export default function ImagePreference({ question }: ImagePreferenceProps) {
  const { answers, setAnswer } = useStore();
  const selectedOption = answers[question.id]?.optionId;
  
  const handleSelect = (optionId: string, option: ImageOption) => {
    setAnswer(
      question.id.toString(),
      {
        optionId: optionId,
        scentMappings: option.scentMappings,
      }
    );
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <motion.h2 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl md:text-3xl font-playfair text-center mb-8"
      >
        {question.text}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center text-gray-600 mb-10"
      >
        Select the image that resonates with you the most
      </motion.p>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {question.options.map((option) => (
          <motion.div
            key={option.id}
            variants={itemVariants}
            transition={{ duration: 0.5 }}
            className={`
              relative overflow-hidden rounded-lg shadow-lg cursor-pointer 
              transform transition duration-300 hover:scale-[1.02] hover:shadow-xl
              ${option.id === selectedOption ? 'ring-4 ring-primary ring-opacity-70' : ''}
            `}
            onClick={() => handleSelect(option.id, option)}
            style={{ height: '240px' }}
          >
            <div className="absolute inset-0 bg-black opacity-20 z-0 transition-opacity duration-300 hover:opacity-10"></div>
            
            {/* Image */}
            <img 
              src={option.imageUrl} 
              alt={option.text} 
              className="w-full h-full object-cover"
            />
            
            {/* Text overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white">
              <h3 className="font-medium text-lg">{option.text}</h3>
              {option.description && (
                <p className="text-sm text-gray-200 mt-1">{option.description}</p>
              )}
            </div>
            
            {/* Selected indicator */}
            {option.id === selectedOption && (
              <div className="absolute top-3 right-3 bg-primary rounded-full p-1 shadow-md">
                <Check className="h-5 w-5 text-white" />
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
      
      {/* Helper text */}
      <div className="text-center text-sm text-gray-500 mt-6">
        {selectedOption ? '' : 'Choose one image to continue'}
      </div>
    </div>
  );
}