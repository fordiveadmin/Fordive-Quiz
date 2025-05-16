import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { getScentImageUrl } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Download } from 'lucide-react';

interface ResultImageGeneratorProps {
  scent: {
    name: string;
    vibes: string[];
    mood: string;
    notes: string[];
    imageUrl?: string;
  };
  userName: string;
  zodiacSign?: string;
}

export default function ResultImageGenerator({ scent, userName, zodiacSign }: ResultImageGeneratorProps) {
  const { toast } = useToast();
  const storyRef = useRef<HTMLDivElement>(null);
  
  const handleDownloadImage = async () => {
    if (!storyRef.current) return;
    
    try {
      // Add a small delay to ensure all styles are applied
      const dataUrl = await toPng(storyRef.current, { quality: 0.95 });
      
      // Create a download link and trigger download
      const link = document.createElement('a');
      link.download = `fordive-${scent.name.toLowerCase().replace(/\s+/g, '-')}-result.png`;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: 'Image Downloaded',
        description: 'Your personalized result image has been downloaded',
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate image. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      {/* Story container - this will be captured as an image */}
      <div 
        ref={storyRef}
        className="relative w-[350px] h-[620px] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-purple-100 to-amber-50 border-2 border-white"
        style={{ fontFamily: '"Playfair Display", "Montserrat", sans-serif' }}
      >
        {/* Background image with gradient overlay */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10 absolute" />
          <img 
            src={scent.imageUrl ? getScentImageUrl(scent.name, scent.imageUrl) : getScentImageUrl(scent.name)} 
            alt={scent.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 text-white">
          {/* Header */}
          <div className="text-center mt-4">
            <h3 className="text-xl font-semibold">FORDIVE</h3>
            <p className="text-sm opacity-90">Scent Finder Results</p>
          </div>
          
          {/* Middle content */}
          <div className="flex flex-col items-center justify-center -mt-8">
            <div className="bg-white/30 backdrop-blur-sm p-6 rounded-2xl shadow-lg w-full max-w-[280px] text-center">
              <p className="text-sm uppercase tracking-wider mb-2">Your Scent Match</p>
              <h2 className="text-3xl font-bold mb-3">{scent.name}</h2>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {scent.notes.slice(0, 4).map((note, index) => (
                  <span 
                    key={index} 
                    className="inline-block px-3 py-1 rounded-full bg-white/30 backdrop-blur-sm text-xs"
                  >
                    {note}
                  </span>
                ))}
              </div>
              <p className="text-sm italic">"{scent.mood}"</p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-center mb-4">
            <p className="text-lg font-medium">
              {userName}'s Signature Scent
            </p>
            {zodiacSign && (
              <p className="text-sm opacity-90">{zodiacSign} ✨</p>
            )}
            <p className="text-xs mt-4 opacity-80">fordive.com</p>
          </div>
        </div>
      </div>
      
      {/* Download button */}
      <Button 
        onClick={handleDownloadImage}
        className="mt-6 bg-primary hover:bg-primary/90 text-white px-6 py-2 flex items-center gap-2" 
      >
        <Download size={16} />
        Download Result Image
      </Button>
    </div>
  );
}