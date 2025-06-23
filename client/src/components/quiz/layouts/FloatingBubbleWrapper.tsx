import { useState, useEffect } from 'react';
import { useStore } from '@/store/quizStore';
import { motion } from 'framer-motion';
import FloatingBubbleLayout from './FloatingBubbleLayout';

interface QuizQuestion {
  id: number;
  text: string;
  type: string;
  order: number;
  options: {
    id: string;
    text: string;
    description?: string;
    imageUrl?: string;
    scentMappings: Record<string, number>;
  }[];
}

interface FloatingBubbleWrapperProps {
  question: QuizQuestion;
}

export default function FloatingBubbleWrapper({ question }: FloatingBubbleWrapperProps) {
  const { answers, setAnswer } = useStore();
  const [selectedOption, setSelectedOption] = useState<string>('');

  // Set initial state from stored answers
  useEffect(() => {
    if (answers[question.id] && answers[question.id].optionId) {
      setSelectedOption(answers[question.id].optionId);
    }
  }, [answers, question.id]);

  const handleSelect = (optionId: string, option: any) => {
    setSelectedOption(optionId);
    
    const answer = {
      optionId: optionId,
      scentMappings: option.scentMappings || {}
    };
    
    setAnswer(question.id.toString(), answer);
  };

  return (
    <div className="space-y-8">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-playfair font-semibold text-center text-foreground"
      >
        {question.text}
      </motion.h2>
      
      <FloatingBubbleLayout
        options={question.options}
        selectedOption={selectedOption}
        onSelect={handleSelect}
      />
    </div>
  );
}