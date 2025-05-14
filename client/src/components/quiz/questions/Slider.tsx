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
      scentMappings: Record<string, Record<string, number>>;
    }[];
  };
}

export default function Slider({ question }: SliderProps) {
  const { answers, setAnswer } = useStore();
  const [value, setValue] = useState(3);
  const [displayText, setDisplayText] = useState('Balanced');
  
  // Set initial state from stored answers
  useEffect(() => {
    if (answers[question.id] && !isNaN(answers[question.id].value)) {
      setValue(answers[question.id].value);
      updateDisplayText(answers[question.id].value);
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
    
    // Get the scent mappings for this value
    const option = question.options[0]; // Sliders typically have one option with mappings per value
    const scentMappings = option.scentMappings[val.toString()];
    
    // Save the answer with both the value and scent mappings
    setAnswer(question.id.toString(), {
      value: val,
      mappings: scentMappings
    });
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
      
      <div className="space-y-8 px-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <SliderInput
            defaultValue={[value]}
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
          <p className="font-medium">{displayText}</p>
          <p className="text-sm text-muted-foreground mt-2">Your energy affects how you experience scents</p>
        </motion.div>
      </div>
    </div>
  );
}
