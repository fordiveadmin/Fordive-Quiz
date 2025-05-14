import { useState, useEffect } from 'react';
import { useStore } from '@/store/quizStore';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MultipleChoiceProps {
  question: {
    id: number;
    text: string;
    options: {
      id: string;
      text: string;
      description?: string;
      scentMappings: Record<string, number>;
    }[];
  };
}

export default function MultipleChoice({ question }: MultipleChoiceProps) {
  const { answers, setAnswer } = useStore();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // Set initial state from stored answers
  useEffect(() => {
    if (answers[question.id]) {
      setSelectedOption(answers[question.id]);
    }
  }, [answers, question.id]);
  
  const handleSelect = (optionId: string) => {
    setSelectedOption(optionId);
    
    // Create answer with scent mappings
    const option = question.options.find(opt => opt.id === optionId);
    if (option) {
      setAnswer(question.id.toString(), optionId);
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
              "border-2 hover:border-primary rounded-lg p-6 cursor-pointer bg-white transition duration-300 hover:-translate-y-1 hover:shadow-md",
              selectedOption === option.id ? "border-primary bg-primary/5" : "border-border"
            )}
            onClick={() => handleSelect(option.id)}
          >
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
