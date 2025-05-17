import { useState, useEffect } from 'react';
import { useStore } from '@/store/quizStore';
import { motion } from 'framer-motion';
import { Slider as SliderInput } from "@/components/ui/slider";

interface SliderProps {
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

export default function Slider({ question }: SliderProps) {
  const { answers, setAnswer } = useStore();
  
  // Total points akan ditentukan dari jumlah options yang ada
  const totalPoints = question.options.length;
  // Default to middle point
  const defaultValue = Math.ceil(totalPoints / 2);
  
  const [value, setValue] = useState(defaultValue);
  const [selectedOption, setSelectedOption] = useState(question.options[defaultValue - 1]); // Index 0-based
  
  // Set initial state from stored answers
  useEffect(() => {
    const questionId = question.id.toString();
    if (answers[questionId] && answers[questionId].value) {
      // Restore the previous value
      const storedValue = answers[questionId].value;
      if (storedValue >= 1 && storedValue <= totalPoints) {
        setValue(storedValue);
        setSelectedOption(question.options[storedValue - 1]);
      }
    } else {
      // Default to middle value
      setValue(defaultValue);
      setSelectedOption(question.options[defaultValue - 1]);
    }
  }, [answers, question.id, defaultValue, question.options, totalPoints]);
  
  const handleValueChange = (newValue: number[]) => {
    const val = newValue[0];
    if (val < 1 || val > totalPoints) return;
    
    setValue(val);
    const option = question.options[val - 1];
    setSelectedOption(option);
    
    // Store both the slider value and the scent mappings
    const answer = {
      value: val,
      optionId: option.id,
      scentMappings: option.scentMappings
    };
    
    // Save the answer
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
      
      <div className="space-y-8 px-2 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <SliderInput
            value={[value]}
            max={totalPoints}
            min={1}
            step={1}
            onValueChange={handleValueChange}
            className="slider-thumb w-full"
          />
        </motion.div>
        
        {/* Labels for slider points */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between text-sm text-muted-foreground px-2"
        >
          {/* Show first, middle (if available), and last label */}
          {totalPoints > 2 ? (
            <>
              <span>{question.options[0].text}</span>
              {totalPoints > 3 && <span>{question.options[Math.floor(totalPoints/2)].text}</span>}
              <span>{question.options[totalPoints-1].text}</span>
            </>
          ) : (
            // For 2 points, just show both
            question.options.map((option, idx) => (
              <span key={idx}>{option.text}</span>
            ))
          )}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6"
        >
          <p className="font-medium text-lg">{selectedOption?.text || ''}</p>
          {selectedOption?.description && (
            <p className="text-sm text-muted-foreground mt-2">{selectedOption.description}</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
