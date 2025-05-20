import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ImageChoiceProps {
  question: {
    id: number;
    text: string;
    options: {
      id: string;
      text: string;
      imageUrl?: string;
      description?: string;
    }[];
  };
  selectedOptionId: string | null;
  onOptionSelect: (optionId: string) => void;
  autoNavigate?: boolean;
}

export function ImageChoice({ 
  question, 
  selectedOptionId, 
  onOptionSelect,
  autoNavigate = false 
}: ImageChoiceProps) {
  // Local state to handle selection animation before navigation
  const [localSelectedId, setLocalSelectedId] = useState<string | null>(selectedOptionId);

  useEffect(() => {
    setLocalSelectedId(selectedOptionId);
  }, [selectedOptionId]);

  const handleOptionClick = (optionId: string) => {
    setLocalSelectedId(optionId);
    
    if (autoNavigate) {
      // Short delay for visual feedback before navigation
      setTimeout(() => {
        onOptionSelect(optionId);
      }, 300);
    } else {
      onOptionSelect(optionId);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-xl md:text-2xl font-medium mb-6">{question.text}</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {question.options.map((option) => (
          <div
            key={option.id}
            onClick={() => handleOptionClick(option.id)}
            className={cn(
              "group relative flex flex-col items-center cursor-pointer rounded-xl border-2 transition-all duration-300 h-full overflow-hidden",
              localSelectedId === option.id
                ? "border-primary shadow-md" 
                : "border-border hover:border-primary/50"
            )}
          >
            {/* Image container */}
            <div className="relative w-full aspect-square overflow-hidden">
              {option.imageUrl ? (
                <img 
                  src={option.imageUrl} 
                  alt={option.text}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">No image</p>
                </div>
              )}
              
              {/* Selection indicator */}
              {localSelectedId === option.id && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="bg-primary text-white p-2 rounded-full">
                    <Check className="h-6 w-6" />
                  </div>
                </div>
              )}
            </div>
            
            {/* Option text */}
            <div className={cn(
              "w-full p-4 text-center transition-colors",
              localSelectedId === option.id ? "bg-primary/10" : "bg-card"
            )}>
              <h4 className="font-medium">{option.text}</h4>
              {option.description && (
                <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}