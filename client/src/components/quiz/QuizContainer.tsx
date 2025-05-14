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
  
  // State untuk menyimpan jalur pertanyaan yang ditampilkan
  const [questionPath, setQuestionPath] = useState<number[]>([]);
  const [branchQuestions, setBranchQuestions] = useState<any[]>([]);
  
  // Fetch semua pertanyaan
  const { data: allQuestions, isLoading, isError } = useQuery({
    queryKey: ['/api/questions'],
  });
  
  // Memproses pertanyaan berdasarkan percabangan
  useEffect(() => {
    if (allQuestions) {
      // Filter pertanyaan utama
      const mainQuestion = allQuestions.find(q => q.isMainQuestion);
      
      if (!mainQuestion) {
        // Jika tidak ada pertanyaan utama, gunakan semua pertanyaan (compatibility mode)
        setBranchQuestions(allQuestions);
        setTotalQuestions(allQuestions.length + 1); // +1 untuk zodiak
        return;
      }
      
      // Mulai dengan pertanyaan utama
      const initialQuestions = [mainQuestion];
      setQuestionPath([mainQuestion.id]);
      setBranchQuestions(initialQuestions);
      
      // Jumlah pertanyaan awal adalah 1 (main question) + 1 (zodiac)
      setTotalQuestions(2);
    }
  }, [allQuestions, setTotalQuestions]);
  
  // Handle navigation
  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleNext = () => {
    const currentQ = getCurrentQuestion();
    if (!currentQ) return;
    
    // Jika ini adalah pertanyaan utama, kita perlu mengambil pertanyaan lanjutan
    // berdasarkan jawaban yang dipilih
    if (currentQ.isMainQuestion && answers[currentQ.id]) {
      const selectedOptionId = answers[currentQ.id].optionId;
      
      // Cari pertanyaan lanjutan yang terkait dengan opsi yang dipilih
      const childQuestions = allQuestions?.filter(q => 
        q.parentId === currentQ.id && q.parentOptionId === selectedOptionId
      ).sort((a, b) => a.order - b.order) || [];
      
      // Update jalur pertanyaan
      const newPath = [currentQ.id, ...childQuestions.map(q => q.id)];
      setQuestionPath(newPath);
      
      // Update pertanyaan yang akan ditampilkan
      const updatedQuestions = [currentQ, ...childQuestions];
      setBranchQuestions(updatedQuestions);
      
      // Update total pertanyaan (jumlah pertanyaan lanjutan + pertanyaan utama + zodiak)
      const newTotal = childQuestions.length + 2; // +1 untuk pertanyaan utama, +1 untuk zodiak
      setTotalQuestions(newTotal);
      
      // Lanjut ke pertanyaan berikutnya
      setCurrentQuestion(currentQuestion + 1);
    } 
    // Untuk pertanyaan normal
    else if (branchQuestions && currentQuestion <= branchQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const handleSubmit = () => {
    navigate('/results');
  };
  
  // Get current question data
  const getCurrentQuestion = () => {
    if (!branchQuestions || branchQuestions.length === 0) return null;
    
    // Last question is the zodiac input
    if (currentQuestion > branchQuestions.length) {
      return { type: 'zodiac', id: 'zodiac' };
    }
    
    return branchQuestions[currentQuestion - 1];
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
  
  if (isError || !allQuestions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Failed to load quiz questions.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }
  
  // Total pertanyaan yang akan ditampilkan (termasuk zodiak)
  const totalQuestions = branchQuestions.length + 1; // +1 for zodiac question
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
