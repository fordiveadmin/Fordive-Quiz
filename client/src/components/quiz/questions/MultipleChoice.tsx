import { useState, useEffect } from 'react';
import { useStore } from '@/store/quizStore';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MultipleChoiceProps {
  question: {
    id: number;
    text: string;
    isMainQuestion?: boolean;
    options: {
      id: string;
      text: string;
      description?: string;
      imageUrl?: string;
      scentMappings: Record<string, number>;
    }[];
  };
}

export default function MultipleChoice({ question }: MultipleChoiceProps) {
  const { answers, setAnswer, currentQuestion, setCurrentQuestion } = useStore();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // Set initial state from stored answers
  useEffect(() => {
    if (answers[question.id]) {
      // Extract the optionId from the stored answer
      setSelectedOption(answers[question.id].optionId);
      console.log("Setting selected option to:", answers[question.id].optionId);
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
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {question.options.map((option) => (
          <motion.div
            key={option.id}
            variants={item}
            className={cn(
              "border-2 hover:border-[#d2b183] rounded-lg p-6 cursor-pointer bg-white transition duration-300 hover:-translate-y-1 hover:shadow-md",
              selectedOption === option.id ? "border-[#d2b183] bg-[#d2b183]/20" : "border-border"
            )}
            onClick={() => handleSelect(option.id)}
          >
            {option.imageUrl && (
              <div className="mb-3 -mx-6 -mt-6">
                <img 
                  src={option.imageUrl} 
                  alt={option.text}
                  className="w-full h-40 object-cover rounded-t-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <h3 className="font-semibold mb-2 font-playfair">{option.text}</h3>
            {option.description && (
              <p className="text-sm text-muted-foreground">{option.description}</p>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
