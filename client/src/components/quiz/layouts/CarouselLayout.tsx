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
  
  // Fungsi untuk menghasilkan gradient warna berbeda untuk setiap kartu
  const getGradientForOption = (optionId: string) => {
    // Extract a number from the option ID to get consistent colors for same options
    const numStr = optionId.replace(/\D/g, '');
    const num = parseInt(numStr, 10) || 0;
    
    // Beberapa pilihan gradien dengan warna keemasan dan beige premium
    const gradients = [
      'linear-gradient(135deg, #f5f1e9 0%, #e6ddca 100%)',
      'linear-gradient(135deg, #ebe5d9 0%, #d8ceb8 100%)',
      'linear-gradient(135deg, #e2d9c5 0%, #cab99f 100%)',
      'linear-gradient(135deg, #f2e8d9 0%, #e0d1b8 100%)',
      'linear-gradient(135deg, #f7f3e9 0%, #e6dcc7 100%)'
    ];
    
    return gradients[num % gradients.length];
  };
  
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
                    'text-white shadow-xl border-2 border-[#C89F65]' : 
                    'text-gray-800 shadow-lg'}
                `}
                onClick={() => handleSelect(option.id, option)}
                style={{ 
                  minHeight: '220px',
                  width: slideWidth,
                  background: option.id === selectedOption ? 
                    '#1f1f1f' : 
                    getGradientForOption(option.id),
                  backgroundSize: '100% 100%',
                  backgroundImage: option.id === selectedOption ? 
                    'none' : 
                    'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23c89f65\' fill-opacity=\'0.06\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                  backgroundBlendMode: 'overlay'
                }}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  {/* Only show image if provided */}
                  {option.imageUrl && (
                    <div className="mb-4 w-full h-40 overflow-hidden rounded-md">
                      <img 
                        src={option.imageUrl} 
                        alt={option.text} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Option Title */}
                  <h3 className="text-xl font-medium text-center mt-2 mb-3">{option.text}</h3>
                  
                  {/* Description */}
                  {option.description && (
                    <p className="text-sm text-center">{option.description}</p>
                  )}
                  
                  {/* Selection indicator */}
                  {option.id === selectedOption && (
                    <div className="mt-auto pt-4">
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