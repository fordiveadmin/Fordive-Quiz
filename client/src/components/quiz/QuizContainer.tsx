import { useEffect, useState } from 'react';
import { useStore } from '@/store/quizStore';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import Navigation from '@/components/layout/Navigation';
import QuizProgress from '@/components/quiz/QuizProgress';
import MultipleChoice from '@/components/quiz/questions/MultipleChoice';
import Checkbox from '@/components/quiz/questions/Checkbox';
import Slider from '@/components/quiz/questions/Slider';
import ZodiacInput from '@/components/quiz/questions/ZodiacInput';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, FlaskRound, Loader2 } from 'lucide-react';

export default function QuizContainer() {
  const [_, navigate] = useLocation();
  const { 
    currentQuestion, 
    setCurrentQuestion, 
    setTotalQuestions,
    answers,
    zodiacSign,
  } = useStore();
  
  // Fetch questions
  const { data: questions, isLoading, isError } = useQuery({
    queryKey: ['/api/questions'],
  });
  
  // Update total questions count when data is loaded
  useEffect(() => {
    if (questions) {
      // Add 1 for the zodiac question
      setTotalQuestions(questions.length + 1);
    }
  }, [questions, setTotalQuestions]);
  
  // Handle navigation
  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleNext = () => {
    if (questions && currentQuestion <= questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const handleSubmit = () => {
    navigate('/results');
  };
  
  // Get current question data
  const getCurrentQuestion = () => {
    if (!questions) return null;
    
    // Last question is the zodiac input
    if (currentQuestion > questions.length) {
      return { type: 'zodiac', id: 'zodiac' };
    }
    
    return questions[currentQuestion - 1];
  };
  
  // Check if current question is answered
  const isCurrentQuestionAnswered = () => {
    const question = getCurrentQuestion();
    if (!question) return false;
    
    if (question.type === 'zodiac') {
      return !!zodiacSign;
    }
    
    return !!answers[question.id];
  };
  
  // Render the appropriate question component
  const renderQuestion = () => {
    const question = getCurrentQuestion();
    if (!question) return null;
    
    switch (question.type) {
      case 'multiple_choice':
        return <MultipleChoice question={question} />;
      case 'checkbox':
        return <Checkbox question={question} />;
      case 'slider':
        return <Slider question={question} />;
      case 'zodiac':
        return <ZodiacInput />;
      default:
        return <div>Unsupported question type</div>;
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading questions...</span>
      </div>
    );
  }
  
  if (isError || !questions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Failed to load quiz questions.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }
  
  const totalQuestions = questions.length + 1; // +1 for zodiac question
  const isLastQuestion = currentQuestion === totalQuestions;
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <QuizProgress 
        current={currentQuestion} 
        total={totalQuestions}
      />
      
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full space-y-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {renderQuestion()}
            </motion.div>
          </AnimatePresence>
          
          <div className="flex justify-between">
            {currentQuestion > 1 ? (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Previous
              </Button>
            ) : (
              <div></div> // Empty div for spacing
            )}
            
            {!isLastQuestion ? (
              <Button
                onClick={handleNext}
                disabled={!isCurrentQuestionAnswered()}
                className="bg-primary hover:bg-accent text-white font-semibold py-2 px-6 rounded-full shadow-sm transition duration-300 ml-auto"
              >
                Next <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isCurrentQuestionAnswered()}
                className="bg-primary hover:bg-accent text-white font-semibold py-2 px-6 rounded-full shadow-sm transition duration-300"
              >
                Discover My Scent <FlaskRound className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
