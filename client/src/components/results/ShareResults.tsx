import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { copyToClipboard } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { FaCopy, FaEnvelope, FaInstagram, FaFacebookF } from 'react-icons/fa';

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
  
  const handleShareSocial = (platform: string) => {
    let shareUrl = '';
    const text = `I just discovered my signature scent, ${scent.name}, with Fordive Scent Finder! Find yours at fordive.com`;
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://fordive.com')}&quote=${encodeURIComponent(text)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing via URL
        toast({
          title: 'Instagram Sharing',
          description: 'Copy your results and share as a post or story on Instagram',
        });
        handleCopyResults();
        return;
      default:
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <h3 className="font-playfair font-semibold text-xl mb-4">Share Your Results</h3>
      <div className="flex flex-wrap gap-4">
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
        
        <Button
          variant="outline"
          className="flex items-center px-4 py-2 border border-border rounded-lg hover:border-primary transition duration-300"
          onClick={() => handleShareSocial('instagram')}
        >
          <FaInstagram className="mr-2 text-primary" />
          <span>Instagram</span>
        </Button>
        
        <Button
          variant="outline"
          className="flex items-center px-4 py-2 border border-border rounded-lg hover:border-primary transition duration-300"
          onClick={() => handleShareSocial('facebook')}
        >
          <FaFacebookF className="mr-2 text-primary" />
          <span>Facebook</span>
        </Button>
      </div>
    </motion.div>
  );
}
