import { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store/quizStore';
import { motion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface Option {
  id: string;
  text: string;
  description?: string;
  imageUrl?: string;
  scentMappings: Record<string, number>;
}

interface CarouselLayoutProps {
  question: {
    id: number;
    text: string;
    options: Option[];
  };
}

export default function CarouselLayout({ question }: CarouselLayoutProps) {
  const { answers, setAnswer } = useStore();
  const selectedOption = answers[question.id]?.optionId;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 768);
  
  // Update window width on resize and reset index when question changes
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    // Reset current index when options change to avoid empty screen issues
    setCurrentIndex(0);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [question.options]);
  
  // Number of visible items based on screen size
  const visibleItems = windowWidth < 768 ? 1 : 2; // Show 1 item on mobile, 2 on desktop
  
  const handleSelect = (optionId: string, option: Option) => {
    setAnswer(
      question.id.toString(),
      {
        optionId: optionId,
        scentMappings: option.scentMappings,
      }
    );
  };

  const nextSlide = () => {
    // Only move if we're not at the last option
    if (currentIndex < question.options.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };
  
  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 100) {
      // Swipe left
      nextSlide();
    }
    
    if (touchEndX - touchStartX > 100) {
      // Swipe right
      prevSlide();
    }
  };
  
  // Calculate slide width in pixels for more reliable positioning
  const slideWidth = windowWidth < 768 
    ? windowWidth - 32 // Mobile: full width minus padding
    : (windowWidth - 32) / 2 - 12; // Desktop: half width minus padding and gap
  
  // Debugging output
  console.log("Options:", question.options.length, "Current index:", currentIndex);
  
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <motion.h2 
        className="text-2xl md:text-3xl font-playfair text-center mb-10" 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {question.text}
      </motion.h2>

      <div className="relative">
        {/* Left Arrow */}
        {currentIndex > 0 && (
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-5 md:-ml-10 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
            aria-label="Previous option"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
        )}
        
        {/* Carousel Container */}
        <div 
          className="overflow-hidden"
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div 
            className="flex gap-4 md:gap-6"
            animate={{ 
              x: -currentIndex * (slideWidth + (windowWidth < 768 ? 16 : 24))
            }}
            style={{ paddingRight: "80px" }} // Extra padding to ensure all slides are visible
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {question.options.map((option) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className={`
                  flex-shrink-0 p-6 rounded-lg cursor-pointer
                  transition-all duration-300 transform hover:-translate-y-2
                  ${option.id === selectedOption ? 
                    'bg-[#1f1f1f] text-white shadow-xl border-2 border-[#C89F65] bg-wave-pattern' : 
                    question.options.indexOf(option) % 2 === 0 ?
                      'bg-[#f5f1e9] hover:bg-[#e6ddca] text-gray-800 shadow-lg bg-wave-pattern' :
                      'bg-[#e6ddca] hover:bg-[#d7ceb9] text-gray-800 shadow-lg bg-wave-pattern-dark'}
                  relative overflow-hidden
                `}
                style={{ 
                  minHeight: '250px',
                  width: slideWidth,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onClick={() => handleSelect(option.id, option)}
              >
                <div className="flex flex-col items-center justify-center h-full w-full">
                  {/* Option Title */}
                  <h3 className="text-2xl font-medium text-center mb-4">{option.text}</h3>
                  
                  {/* Description */}
                  {option.description && (
                    <p className="text-sm text-center">{option.description}</p>
                  )}
                  
                  {/* Selection indicator */}
                  {option.id === selectedOption && (
                    <div className="mt-6">
                      <div className="bg-[#C89F65] rounded-full h-8 w-8 mx-auto flex items-center justify-center">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Right Arrow - Show until we reach the last option */}
        {currentIndex < question.options.length - 1 && (
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-5 md:-mr-10 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
            aria-label="Next option"
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>
        )}
      </div>
      
      {/* Carousel Dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: question.options.length }).map((_, idx) => (
          <button
            key={idx}
            className={`h-2 rounded-full transition-all ${
              idx === currentIndex 
                ? "w-8 bg-[#C89F65]" 
                : "w-2 bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Carousel page ${idx + 1}`}
          />
        ))}
      </div>
      
      {/* Selected state text */}
      <div className="text-center text-sm text-gray-500 mt-6">
        {selectedOption ? 'Tap next to continue' : 'Select one option to continue'}
      </div>
    </div>
  );
}