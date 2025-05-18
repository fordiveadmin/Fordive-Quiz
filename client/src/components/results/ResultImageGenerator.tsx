import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { getScentImageUrl } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Download } from 'lucide-react';
import logoImage from "../../assets/logo.png";

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
      // Use higher quality settings for better resolution
      const dataUrl = await toPng(storyRef.current, { 
        quality: 1.0, 
        pixelRatio: 3,  // Increase pixel ratio for higher resolution
        canvasWidth: 1050, // 3x the visual width
        canvasHeight: 1860 // 3x the visual height
      });
      
      // Create a download link and trigger download
      const link = document.createElement('a');
      link.download = `fordive-${scent.name.toLowerCase().replace(/\s+/g, '-')}-result.png`;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: 'HD Image Downloaded',
        description: 'Your high-quality personalized result image has been downloaded',
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
        className="relative w-[350px] h-[620px] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-purple-100 to-amber-50"
        style={{ fontFamily: '"Playfair Display", "Montserrat", sans-serif' }}
      >
        {/* Background image with darker gradient overlay */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-b from-black/70 via-black/40 to-black/70 z-10 absolute" />
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
            <div className="flex justify-center">
              <img src={logoImage} alt="Fordive Logo" className="h-16 mb-1" />
            </div>
            <p className="text-sm opacity-90">Scent Finder Results</p>
          </div>
          
          {/* Middle content */}
          <div className="flex flex-col items-center justify-center -mt-8">
            <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full max-w-[280px] text-center">
              <p className="text-sm uppercase tracking-wider mb-2 text-gray-200">YOUR SCENT MATCH</p>
              <h2 className="text-3xl font-bold mb-3 text-white">{scent.name}</h2>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {scent.notes.slice(0, 4).map((note, index) => (
                  <span 
                    key={index} 
                    className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs"
                  >
                    {note}
                  </span>
                ))}
              </div>
              <p className="text-sm italic text-gray-100">"{scent.mood}"</p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-center mb-4 bg-black/30 backdrop-blur-sm py-3 px-6 rounded-xl">
            <p className="text-lg font-medium text-white">
              {userName}'s Signature Scent
            </p>
            {zodiacSign && (
              <p className="text-sm text-white">{zodiacSign} ✨</p>
            )}
            <p className="text-xs mt-4 text-white">fordive.com</p>
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