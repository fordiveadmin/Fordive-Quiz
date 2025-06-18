import { useState } from 'react';
import { useStore } from '@/store/quizStore';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Option {
  id: string;
  text: string;
  description?: string;
  imageUrl?: string;
  scentMappings: Record<string, number>;
}

interface QuizQuestion {
  id: number;
  text: string;
  type: string;
  order: number;
  layout?: string;
  options: Option[];
}

interface Props {
  question: QuizQuestion;
}

export function ImageChoiceComponent({ question }: Props) {
  const { answers, setAnswer } = useStore();
  const [selectedOption, setSelectedOption] = useState<string | null>(
    answers[question.id] ? answers[question.id][0] : null
  );

  const handleSelect = (optionId: string, option: Option) => {
    setSelectedOption(optionId);
    setAnswer(question.id.toString(), [optionId, option.text, option.scentMappings]);
  };

  // Render Card Stack 3D layout
  if (question.layout === 'image_cardstack') {
    return <CardStack3D question={question} selectedOption={selectedOption} onSelect={handleSelect} />;
  }

  // Default grid layout
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-medium text-center mb-8"
      >
        {question.text}
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {question.options.map((option) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`
              relative flex flex-col border rounded-lg overflow-hidden cursor-pointer transition-all
              ${option.id === selectedOption ? 
                'border-[#C89F65] ring-2 ring-[#C89F65]/50 shadow-md' : 
                'border-gray-200 hover:border-[#C89F65]'}
            `}
            onClick={() => handleSelect(option.id, option)}
          >
            {/* Image */}
            {option.imageUrl && (
              <div className="w-full h-48 overflow-hidden">
                <img 
                  src={option.imageUrl} 
                  alt={option.text} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/400x300?text=Image+Not+Found';
                  }}
                />
              </div>
            )}
            
            {/* Text content */}
            <div className="p-4 flex-grow">
              <h3 className="text-lg font-medium text-center mb-2">{option.text}</h3>
              
              {/* Description if available */}
              {option.description && (
                <p className="text-sm text-gray-600 text-center">{option.description}</p>
              )}
            </div>
            
            {/* Selected indicator */}
            {option.id === selectedOption && (
              <div className="absolute right-3 top-3 bg-[#C89F65] rounded-full p-1">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Card Stack 3D Component
function CardStack3D({ question, selectedOption, onSelect }: {
  question: QuizQuestion;
  selectedOption: string | null;
  onSelect: (optionId: string, option: Option) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const nextCard = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % question.options.length);
      setIsFlipping(false);
    }, 300);
  };

  const prevCard = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + question.options.length) % question.options.length);
      setIsFlipping(false);
    }, 300);
  };

  const handleCardSelect = () => {
    const currentOption = question.options[currentIndex];
    onSelect(currentOption.id, currentOption);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-medium text-center mb-8"
      >
        {question.text}
      </motion.h2>

      <div className="relative h-96 perspective-1000">
        {/* Stack of cards behind */}
        {question.options.map((option, index) => {
          const isActive = index === currentIndex;
          const isNext = index === (currentIndex + 1) % question.options.length;
          const isPrev = index === (currentIndex - 1 + question.options.length) % question.options.length;
          
          let zIndex = 0;
          let transform = 'translateX(0px) rotateY(0deg) scale(0.8)';
          let opacity = 0.3;

          if (isActive) {
            zIndex = 30;
            transform = 'translateX(0px) rotateY(0deg) scale(1)';
            opacity = 1;
          } else if (isNext) {
            zIndex = 20;
            transform = 'translateX(20px) rotateY(-15deg) scale(0.9)';
            opacity = 0.7;
          } else if (isPrev) {
            zIndex = 20;
            transform = 'translateX(-20px) rotateY(15deg) scale(0.9)';
            opacity = 0.7;
          }

          return (
            <motion.div
              key={option.id}
              className="absolute inset-0 cursor-pointer"
              style={{ zIndex }}
              animate={{
                transform,
                opacity,
                rotateY: isFlipping && isActive ? [0, 90, 0] : 0,
              }}
              transition={{
                duration: isFlipping ? 0.6 : 0.8,
                ease: "easeInOut"
              }}
              onClick={isActive ? handleCardSelect : undefined}
            >
              <div className={`
                w-full h-full rounded-xl overflow-hidden shadow-2xl border-2 transition-all
                ${option.id === selectedOption ? 
                  'border-[#C89F65] ring-4 ring-[#C89F65]/30' : 
                  'border-white'}
                ${isActive ? 'hover:scale-105' : ''}
              `}>
                {/* Image */}
                {option.imageUrl && (
                  <div className="w-full h-64 overflow-hidden">
                    <img 
                      src={option.imageUrl} 
                      alt={option.text} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/400x300?text=Image+Not+Found';
                      }}
                    />
                  </div>
                )}
                
                {/* Content */}
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-medium text-center mb-2">{option.text}</h3>
                  {option.description && (
                    <p className="text-sm text-gray-600 text-center">{option.description}</p>
                  )}
                  
                  {/* Selected indicator */}
                  {option.id === selectedOption && (
                    <div className="absolute right-4 top-4 bg-[#C89F65] rounded-full p-2">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={prevCard}
          disabled={isFlipping}
          className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ←
          </motion.div>
        </button>
        
        <div className="text-sm text-gray-500">
          {currentIndex + 1} / {question.options.length}
        </div>
        
        <button
          onClick={nextCard}
          disabled={isFlipping}
          className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            →
          </motion.div>
        </button>
      </div>

      {/* Tap instruction */}
      <p className="text-center text-gray-500 text-sm mt-4">
        Tap the card to select • Use arrows to navigate
      </p>
    </div>
  );
}