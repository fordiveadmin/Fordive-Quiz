import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useStore } from "@/store/quizStore";

interface ScaleOption {
  id: string;
  value: string;
  text: string;
  label?: string;
  description?: string;
  scentMappings: Record<string, number>;
}

interface RatingScaleProps {
  question: {
    id: number;
    text: string;
    options: ScaleOption[];
    scaleMin?: string;
    scaleMax?: string;
    scaleSteps?: number;
  };
}

export default function RatingScale({ question }: RatingScaleProps) {
  const { answers, setAnswer } = useStore();
  const [selectedValue, setSelectedValue] = useState<string>("");
  
  // Get number of scale steps (default to 5 if not specified)
  const scaleSteps = question.scaleSteps || 5;
  
  // Set initial state from stored answers
  useEffect(() => {
    if (answers[question.id]?.optionId) {
      setSelectedValue(answers[question.id].optionId);
    }
  }, [answers, question.id]);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    
    // Find the selected option
    const selectedOption = question.options.find(opt => opt.value === value);
    
    if (selectedOption) {
      setAnswer(
        question.id.toString(),
        {
          optionId: value,
          scaleValue: parseInt(value),
          scentMappings: selectedOption.scentMappings
        }
      );
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <motion.h2 
        className="text-2xl md:text-3xl font-playfair text-center mb-8" 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {question.text}
      </motion.h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <RadioGroup 
          value={selectedValue} 
          onValueChange={handleSelect}
          className="space-y-6"
        >
          <div className="flex justify-between text-sm text-gray-500 mb-2 px-2">
            <span>{question.scaleMin || "Tidak Sama Sekali"}</span>
            <span>{question.scaleMax || "Sangat"}</span>
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {question.options.map((option) => (
              <div 
                key={option.value} 
                className="flex flex-col items-center"
              >
                <RadioGroupItem 
                  value={option.value} 
                  id={`option-${option.value}`} 
                  className="peer sr-only" 
                />
                <Label 
                  htmlFor={`option-${option.value}`} 
                  className={`
                    flex flex-col items-center justify-center 
                    w-12 h-12 rounded-full border-2 cursor-pointer
                    text-lg font-medium transition-all
                    peer-data-[state=checked]:border-[#C89F65]
                    peer-data-[state=checked]:bg-[#C89F65]
                    peer-data-[state=checked]:text-white
                    ${selectedValue === option.value 
                      ? 'border-[#C89F65] bg-[#C89F65] text-white' 
                      : 'border-gray-300 hover:border-[#C89F65] hover:bg-[#f5f1e9]'}
                  `}
                >
                  {option.value}
                </Label>
                {option.label && (
                  <span className="text-xs mt-1 text-center">{option.label}</span>
                )}
              </div>
            ))}
          </div>
        </RadioGroup>
        
        {selectedValue && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <p className="font-medium text-[#C89F65]">
              {selectedValue && question.options.find(o => o.value === selectedValue)?.description}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}