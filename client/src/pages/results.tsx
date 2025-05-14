import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useStore } from '@/store/quizStore';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { calculateScentScores, getTopScent } from '@/lib/utils';
import { queryClient } from '@/lib/queryClient';
import Navigation from '@/components/layout/Navigation';
import ResultsCard from '@/components/results/ResultsCard';
import ShareResults from '@/components/results/ShareResults';
import SimilarScents from '@/components/results/SimilarScents';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function Results() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { 
    user,
    answers,
    zodiacSign,
    primaryScent,
    setResultScentId,
    setPrimaryScent,
    resultScentId
  } = useStore();

  // Redirect if quiz not completed
  useEffect(() => {
    if (!user) {
      navigate('/quiz');
    }
  }, [user, navigate]);

  // Get all scents
  const { data: scents, isLoading: scentsLoading } = useQuery({
    queryKey: ['/api/scents'],
    enabled: !!user,
  });

  // Calculate top scent if not already stored
  useEffect(() => {
    if (scents && !primaryScent) {
      console.log("Answers to process:", JSON.stringify(answers));
      console.log("Available scents:", scents.map(s => s.name));
      
      // Reset to force recalculation
      const scores = calculateScentScores(answers);
      console.log("Calculated scores:", scores);
      
      const topScentName = getTopScent(scores);
      console.log("Top scent:", topScentName);
      
      // Default to the first scent if no score was calculated
      if (!topScentName && scents.length > 0) {
        console.log("No top scent found, defaulting to first scent");
        setPrimaryScent(scents[0].name);
        setResultScentId(scents[0].id);
      } else {
        setPrimaryScent(topScentName);
        
        // Find the matching scent ID
        const matchedScent = scents.find(scent => scent.name === topScentName);
        if (matchedScent) {
          setResultScentId(matchedScent.id);
        }
      }
    }
  }, [scents, primaryScent, setPrimaryScent, answers, setResultScentId]);

  // Save quiz result to database
  const saveResult = useMutation({
    mutationFn: async () => {
      if (!user?.id || !resultScentId) return null;
      
      const quizResult = {
        userId: user.id,
        primaryScentId: resultScentId,
        zodiacSign: zodiacSign?.name || null,
        answers: answers
      };
      
      const res = await apiRequest('POST', '/api/quiz-results', quizResult);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/quiz-results/user/${user?.id}`] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save your quiz results',
        variant: 'destructive',
      });
    }
  });

  // Save results when we have all the data
  useEffect(() => {
    if (user?.id && resultScentId && !saveResult.isPending && !saveResult.isSuccess) {
      saveResult.mutate();
    }
  }, [user?.id, resultScentId, saveResult]);

  if (scentsLoading || !primaryScent || !scents) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading your results...</span>
      </div>
    );
  }

  // Find the scent object that matches primaryScent
  const matchedScent = scents.find(scent => scent.name === primaryScent);
  
  if (!matchedScent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">No matching scent found. Please retake the quiz.</p>
          <Button onClick={() => navigate('/quiz')}>Retake Quiz</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Your Signature Scent | {matchedScent.name} by Fordive</title>
        <meta name="description" content={`Based on your personality and preferences, ${matchedScent.name} is your signature Fordive fragrance. ${matchedScent.mood}`} />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-secondary">
        <Navigation />
        
        <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl w-full space-y-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4 text-foreground">Your Signature Scent</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Based on your personality, preferences, and zodiac sign, we've found your perfect match
              </p>
            </motion.div>
            
            <ResultsCard 
              scent={matchedScent} 
              zodiacSign={zodiacSign}
            />
            
            <ShareResults 
              scent={matchedScent}
              userName={user?.name || ''}
              userEmail={user?.email || ''}
              zodiacSign={zodiacSign?.name || ''}
            />
            
            <SimilarScents 
              currentScentId={matchedScent.id}
              category={matchedScent.category}
              allScents={scents}
            />
            
            <div className="text-center">
              <Button 
                className="bg-primary hover:bg-accent text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition duration-300 hover:scale-105"
                onClick={() => window.open('https://fordive.com/shop', '_blank')}
              >
                Shop Your Fragrance Now
              </Button>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
}
