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
  const [value, setValue] = useState(3);
  const [displayText, setDisplayText] = useState('Balanced');
  
  // Set initial state from stored answers
  useEffect(() => {
    // With our new format, the slider needs special handling to restore state
    const questionId = question.id.toString();
    if (answers[questionId] && answers[questionId].value) {
      const storedValue = answers[questionId].value;
      setValue(storedValue);
      updateDisplayText(storedValue);
    } else {
      // Default to middle value if we have an answer but can't determine the value
      setValue(3);
      updateDisplayText(3);
    }
  }, [answers, question.id]);
  
  const updateDisplayText = (val: number) => {
    let text = 'Balanced';
    
    if (val === 1) text = 'Very Calm & Relaxed';
    else if (val === 2) text = 'Calm & Relaxed';
    else if (val === 4) text = 'Energetic';
    else if (val === 5) text = 'Very Energetic & Lively';
    
    setDisplayText(text);
  };
  
  const handleValueChange = (newValue: number[]) => {
    const val = newValue[0];
    setValue(val);
    updateDisplayText(val);
    
    // Get the option object
    const option = question.options[0]; // Sliders typically have one option with mappings
    
    // Store both the slider value and the scent mappings
    const answer = {
      value: val,
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
        >
          <SliderInput
            value={[value]}
            max={5}
            min={1}
            step={1}
            onValueChange={handleValueChange}
            className="slider-thumb w-full"
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between text-sm text-muted-foreground px-2"
        >
          <span>Calm & Relaxed</span>
          <span>Balanced</span>
          <span>Energetic & Lively</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6"
        >
          <p className="font-medium text-lg">{displayText}</p>
          <p className="text-sm text-muted-foreground mt-2">Your energy affects how you experience scents</p>
        </motion.div>
      </div>
    </div>
  );
}
