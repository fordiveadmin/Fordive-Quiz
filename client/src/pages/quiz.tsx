import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useStore } from '@/store/quizStore';
import UserForm from '@/components/quiz/UserForm';
import QuizContainer from '@/components/quiz/QuizContainer';

export default function Quiz() {
  const { user, resetQuiz } = useStore();
  
  // Reset quiz answers when page loads
  useEffect(() => {
    resetQuiz();
  }, [resetQuiz]);
  
  return (
    <>
      <Helmet>
        <title>Find Your Signature Scent | Fordive Quiz</title>
        <meta name="description" content="Take our interactive quiz to discover the Fordive fragrance that perfectly matches your personality and zodiac sign." />
      </Helmet>
      
      {!user ? <UserForm /> : <QuizContainer />}
    </>
  );
}
