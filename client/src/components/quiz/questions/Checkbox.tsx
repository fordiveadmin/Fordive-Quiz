import { useState, useEffect } from 'react';
import { useStore } from '@/store/quizStore';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Checkbox as CheckboxInput } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxProps {
  question: {
    id: number;
    text: string;
    options: {
      id: string;
      text: string;
      description?: string;
      imageUrl?: string;
      scentMappings: Record<string, number>;
    }[];
  };
}

export default function Checkbox({ question }: CheckboxProps) {
  const { answers, setAnswer } = useStore();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  
  // Set initial state from stored answers
  useEffect(() => {
    if (answers[question.id] && answers[question.id].optionIds) {
      setSelectedOptions(answers[question.id].optionIds);
      console.log("Setting selected checkbox options to:", answers[question.id].optionIds);
    }
  }, [answers, question.id]);
  
  const handleToggle = (optionId: string) => {
    let updatedSelections: string[];
    
    if (selectedOptions.includes(optionId)) {
      // Remove if already selected
      updatedSelections = selectedOptions.filter(id => id !== optionId);
    } else {
      // Add if not selected
      updatedSelections = [...selectedOptions, optionId];
    }
    
    setSelectedOptions(updatedSelections);
    
    // Create combined scent mappings from all selected options
    const combinedScentMappings: Record<string, number> = {};
    
    updatedSelections.forEach(selectionId => {
      const option = question.options.find(opt => opt.id === selectionId);
      if (option) {
        // Add points from each option's scent mappings
        Object.entries(option.scentMappings).forEach(([scentName, points]) => {
          if (combinedScentMappings[scentName]) {
            combinedScentMappings[scentName] += points;
          } else {
            combinedScentMappings[scentName] = points;
          }
        });
      }
    });
    
    const answer = {
      optionIds: updatedSelections,
      scentMappings: combinedScentMappings
    };
    
    setAnswer(question.id.toString(), answer);
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
              "border-2 hover:border-[#d2b183] rounded-lg p-4 cursor-pointer bg-white transition duration-300 flex items-start",
              selectedOptions.includes(option.id) ? "border-[#d2b183] bg-[#d2b183]/20" : "border-border"
            )}
            onClick={() => handleToggle(option.id)}
          >
            <CheckboxInput
              checked={selectedOptions.includes(option.id)}
              onCheckedChange={() => handleToggle(option.id)}
              className="h-5 w-5 text-primary rounded border-input mt-1 mr-3"
              id={`checkbox-${option.id}`}
            />
            <div className="flex-1">
              {option.imageUrl && (
                <div className="mb-3 -mx-4 -mt-4">
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
              <Label 
                htmlFor={`checkbox-${option.id}`} 
                className="font-semibold mb-1 font-playfair cursor-pointer"
              >
                {option.text}
              </Label>
              {option.description && (
                <p className="text-sm text-muted-foreground">{option.description}</p>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
