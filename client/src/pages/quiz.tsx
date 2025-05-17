import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useStore } from '@/store/quizStore';
import { useLocation } from 'wouter';
import UserForm from '@/components/quiz/UserForm';
import QuizContainer from '@/components/quiz/QuizContainer';

export default function Quiz() {
  const { user, resetQuiz, primaryScent, resultScentId } = useStore();
  const [location, navigate] = useLocation();
  const isRetake = new URLSearchParams(window.location.search).get('retake') === 'true';
  
  // Check if user has previous quiz results - if so and not explicitly retaking, redirect to results
  useEffect(() => {
    if (user && primaryScent && resultScentId && !isRetake) {
      // User has previous results and isn't explicitly retaking the quiz
      console.log("User has previous results, redirecting to results page");
      navigate('/results');
    } else if (isRetake) {
      // If we're retaking, clear previous answers but keep the user info
      console.log("Retaking quiz, resetting previous answers");
      resetQuiz();
    }
  }, [user, primaryScent, resultScentId, isRetake, navigate, resetQuiz]);
  
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
