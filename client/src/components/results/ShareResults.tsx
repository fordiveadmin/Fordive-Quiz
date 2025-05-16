import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { copyToClipboard } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { FaCopy, FaEnvelope, FaImage } from 'react-icons/fa';
import ResultImageGenerator from './ResultImageGenerator';

interface ShareResultsProps {
  scent: {
    name: string;
    vibes: string[];
    mood: string;
    notes: string[];
    imageUrl?: string;
  };
  userName: string;
  userEmail: string;
  zodiacSign: string;
}

export default function ShareResults({ scent, userName, userEmail, zodiacSign }: ShareResultsProps) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  
  // Email results mutation
  const emailResults = useMutation({
    mutationFn: async () => {
      const emailData = {
        email: userEmail,
        name: userName,
        scent,
        zodiacSign
      };
      
      const res = await apiRequest('POST', '/api/email-results', emailData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Email Sent',
        description: 'Your results have been sent to your email',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to send email: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  const handleCopyResults = async () => {
    const resultText = `
🌟 My Fordive Signature Scent: ${scent.name} 🌟

Vibes: ${scent.vibes.join(', ')}
Notes: ${scent.notes.join(', ')}

"${scent.mood}"

${zodiacSign ? `My Zodiac Sign: ${zodiacSign}` : ''}

Find your signature scent at fordive.com
    `;
    
    const success = await copyToClipboard(resultText);
    
    if (success) {
      setIsCopied(true);
      toast({
        title: 'Copied to Clipboard',
        description: 'Your results have been copied to clipboard',
      });
      
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } else {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };
  
  // We've replaced this with the image generator functionality
  
  const [showImageGenerator, setShowImageGenerator] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <h3 className="font-playfair font-semibold text-xl mb-4">Save & Share Your Results</h3>
      
      {!showImageGenerator ? (
        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            className="flex items-center px-4 py-2 border border-border rounded-lg hover:border-primary transition duration-300"
            onClick={() => setShowImageGenerator(true)}
          >
            <FaImage className="mr-2 text-primary" />
            <span>Save as Image</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center px-4 py-2 border border-border rounded-lg hover:border-primary transition duration-300"
            onClick={handleCopyResults}
            disabled={isCopied}
          >
            <FaCopy className="mr-2 text-primary" />
            <span>{isCopied ? 'Copied!' : 'Copy Results'}</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center px-4 py-2 border border-border rounded-lg hover:border-primary transition duration-300"
            onClick={() => emailResults.mutate()}
            disabled={emailResults.isPending}
          >
            {emailResults.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
            ) : (
              <FaEnvelope className="mr-2 text-primary" />
            )}
            <span>Email Results</span>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <ResultImageGenerator 
            scent={scent}
            userName={userName}
            zodiacSign={zodiacSign}
          />
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => setShowImageGenerator(false)}
          >
            Back to Options
          </Button>
        </div>
      )}
    </motion.div>
  );
}
