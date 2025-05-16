import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Option {
  id: string;
  text: string;
  description?: string;
  imageUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  scentMappings: Record<string, number>;
}

interface ImageChoiceProps {
  question: {
    id: number;
    text: string;
    backgroundColor?: string;
    textColor?: string;
    options: Option[];
  };
}

export default function ImageChoice({ 
  question,
  selectedOption,
  onChange
}: ImageChoiceProps & { 
  selectedOption: string | null,
  onChange: (optionId: string) => void 
}) {

  // Animation variants
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

  const handleSelect = (optionId: string) => {
    onChange(optionId);
  };

  return (
    <div className={cn(
      "rounded-lg p-6 md:p-8 w-full", 
      question.backgroundColor || "bg-white"
    )}>
      <h2 
        className={cn(
          "text-2xl md:text-3xl font-medium text-center mb-8 md:mb-10",
          question.textColor || "text-gray-800"
        )}
      >
        {question.text}
      </h2>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
      >
        {question.options.map((option) => (
          <motion.div
            key={option.id}
            variants={item}
            className={cn(
              "relative flex flex-col items-center p-6 rounded-lg transition-all cursor-pointer",
              option.backgroundColor || "bg-[#F2ECE3]",
              selectedOption === option.id ? "ring-2 ring-[#C89F65] shadow-md" : "hover:shadow-md",
            )}
            onClick={() => handleSelect(option.id)}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center bg-white mb-4">
              {option.imageUrl ? (
                <img 
                  src={option.imageUrl} 
                  alt={option.text} 
                  className="w-10 h-10 md:w-12 md:h-12 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    // Fallback to generic icon if image fails to load
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xNC41IDRoLTVMNyA3SDRhMiAyIDAgMCAwLTIgMnY5YTIgMiAwIDAgMCAyIDJoMTZhMiAyIDAgMCAwIDItMlY5YTIgMiAwIDAgMC0yLTJoLTNsLTIuNS0zeiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTMiIHI9IjMiLz48L3N2Zz4=';
                  }}
                />
              ) : (
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-5"/></svg>
                </div>
              )}
            </div>
            
            <h3 
              className={cn(
                "text-lg font-medium text-center",
                option.textColor || "text-gray-800"
              )}
            >
              {option.text}
            </h3>
            
            {option.description && (
              <p className="text-sm text-gray-600 mt-2 text-center">
                {option.description}
              </p>
            )}
            
            {selectedOption === option.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-[#C89F65] text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}