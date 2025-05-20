import { useState, useEffect } from 'react';
import { useStore } from '@/store/quizStore';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check } from "lucide-react";

interface ImageChoiceProps {
  question: {
    id: number;
    text: string;
    isMainQuestion?: boolean;
    options: {
      id: string;
      text: string;
      imageUrl?: string;
      description?: string;
      scentMappings: Record<string, number>;
    }[];
  };
}

// Export as default to match other components
export default function ImageChoice({ question }: ImageChoiceProps) {
  const { answers, setAnswer, currentQuestion, setCurrentQuestion } = useStore();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // Set initial state from stored answers
  useEffect(() => {
    if (answers[question.id]) {
      setSelectedOption(answers[question.id].optionId);
    }
  }, [answers, question.id]);
  
  const handleSelect = (optionId: string) => {
    setSelectedOption(optionId);
    
    // Create answer with scent mappings
    const option = question.options.find(opt => opt.id === optionId);
    if (option) {
      // Store both the option ID and its scent mappings
      const answer = {
        optionId: optionId,
        scentMappings: option.scentMappings
      };
      
      setAnswer(question.id.toString(), answer);
      
      // Auto-proceed to next question if this is a main question
      if (question.isMainQuestion) {
        // Use setTimeout to give visual feedback that the option was selected
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1);
        }, 300);
      }
    }
  };
  
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
    <div className="space-y-8">
      <h2 className="text-2xl md:text-3xl font-playfair font-semibold text-center text-foreground">
        {question.text}
      </h2>
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        {question.options.map((option) => (
          <motion.div
            key={option.id}
            variants={item}
            className={cn(
              "group border-2 hover:border-[#C89F65] rounded-lg overflow-hidden cursor-pointer transition duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col h-full",
              selectedOption === option.id ? "border-[#C89F65] bg-[#C89F65]/10" : "border-border"
            )}
            onClick={() => handleSelect(option.id)}
          >
            {/* Image container */}
            {option.imageUrl && (
              <div className="relative w-full aspect-square overflow-hidden">
                <img 
                  src={option.imageUrl} 
                  alt={option.text}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Selection indicator */}
                {selectedOption === option.id && (
                  <div className="absolute inset-0 bg-[#C89F65]/20 flex items-center justify-center">
                    <div className="bg-[#C89F65] text-white p-2 rounded-full">
                      <Check className="h-6 w-6" />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Option text */}
            <div className="p-4">
              <h3 className="font-semibold font-playfair">{option.text}</h3>
              {option.description && (
                <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}