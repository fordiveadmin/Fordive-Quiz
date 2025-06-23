import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ZodiacSign } from '@/lib/zodiac';

interface User {
  id: number;
  name: string;
  email: string;
}

interface QuizState {
  currentQuestion: number;
  answers: Record<string, any>;
  zodiacSign: ZodiacSign | null;
  user: User | null;
  totalQuestions: number;
  primaryScent: string | null;
  resultScentId: number | null;
  
  // Actions
  setUser: (user: User) => void;
  setCurrentQuestion: (questionNumber: number) => void;
  setTotalQuestions: (total: number) => void;
  setAnswer: (questionId: string, answer: any) => void;
  setZodiacSign: (sign: ZodiacSign | null) => void;
  setPrimaryScent: (scentName: string) => void;
  setResultScentId: (scentId: number) => void;
  resetQuiz: () => void;
}

export const useStore = create<QuizState>()(
  persist(
    (set) => ({
      currentQuestion: 1,
      answers: {},
      zodiacSign: null,
      user: null,
      totalQuestions: 0,
      primaryScent: null,
      resultScentId: null,
      
      setUser: (user) => set({ user }),
      setCurrentQuestion: (questionNumber) => set({ currentQuestion: questionNumber }),
      setTotalQuestions: (total) => set({ totalQuestions: total }),
      setAnswer: (questionId, answer) => 
        set((state) => ({ 
          answers: { ...state.answers, [questionId]: answer }
        })),
      setZodiacSign: (sign) => set({ zodiacSign: sign }),
      setPrimaryScent: (scentName) => set({ primaryScent: scentName }),
      setResultScentId: (scentId) => set({ resultScentId: scentId }),
      resetQuiz: () => set({ 
        currentQuestion: 1, 
        answers: {}, 
        zodiacSign: null, 
        primaryScent: null,
        resultScentId: null
      }),
    }),
    {
      name: 'fordive-quiz-storage',
      partialize: (state) => ({
        answers: state.answers,
        zodiacSign: state.zodiacSign,
        user: state.user,
        primaryScent: state.primaryScent,
        resultScentId: state.resultScentId
      }),
    }
  )
);
