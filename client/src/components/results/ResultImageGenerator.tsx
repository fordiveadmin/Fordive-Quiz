import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { getScentImageUrl } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import logoImage from "../../assets/fordive-logo-white.png";

interface ResultImageGeneratorProps {
  scent: {
    id: number;
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
  
  // Get zodiac mapping description
  const { data: zodiacMappings } = useQuery({
    queryKey: ['/api/zodiac-mappings/sign', zodiacSign],
    queryFn: async () => {
      if (!zodiacSign) return [];
      
      try {
        const response = await fetch(`/api/zodiac-mappings/sign/${zodiacSign}`);
        if (!response.ok) {
          return [];
        }
        return response.json();
      } catch (error) {
        return [];
      }
    },
    enabled: !!zodiacSign,
  });

  // Get zodiac description for this scent
  const getZodiacDescription = () => {
    if (!zodiacMappings || !Array.isArray(zodiacMappings)) return "";
    
    const mapping = zodiacMappings.find((m: any) => m.scentId === scent.id);
    if (mapping && mapping.description) {
      return mapping.description;
    }
    
    // Default zodiac descriptions
    const defaultDescriptions: { [key: string]: string } = {
      'Aries': 'Bold and energetic, you embrace life with passion and confidence.',
      'Taurus': 'Reliable and sensual, you appreciate the finer things in life.',
      'Gemini': 'Curious and versatile, you adapt easily to new experiences.',
      'Cancer': 'Intuitive and nurturing, you value emotional connections.',
      'Leo': 'Charismatic and generous, you naturally shine in any crowd.',
      'Virgo': 'Analytical and refined, you seek perfection in all things.',
      'Libra': 'Harmonious and elegant, you bring balance to every situation.',
      'Scorpio': 'Intense and mysterious, you possess deep emotional insight.',
      'Sagittarius': 'Adventurous and optimistic, you seek freedom and truth.',
      'Capricorn': 'Ambitious and practical, you build lasting foundations.',
      'Aquarius': 'Innovative and independent, you think outside the box.',
      'Pisces': 'Imaginative and compassionate, you connect deeply with others.'
    };
    
    return defaultDescriptions[zodiacSign || ''] || '';
  };
  
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
        className="relative w-[350px] h-[620px] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-amber-50 to-amber-100"
        style={{ fontFamily: '"Playfair Display", "Montserrat", sans-serif' }}
      >
        {/* Background image with darker gradient overlay */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-b from-black/60 via-black/30 to-black/60 z-10 absolute" />
          <img 
            src={scent.imageUrl ? getScentImageUrl(scent.name, scent.imageUrl) : getScentImageUrl(scent.name)} 
            alt={scent.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 text-white">
          {/* Header - Logo Fordive */}
          <div className="text-center pt-6">
            <div className="flex justify-center mb-4">
              <img src={logoImage} alt="Fordive Logo" className="h-12" />
            </div>
            <h1 className="text-sm font-light tracking-wider text-white/90 mb-4">Scent Finder Result</h1>
          </div>
          
          {/* Middle content - Main Result */}
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="bg-black/50 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-[300px] text-center">
              <p className="text-xs uppercase tracking-wider mb-3 text-white/80">YOUR SCENT MATCH</p>
              <h2 className="text-4xl font-bold mb-4 text-white">{scent.name}</h2>
              
              {/* Notes */}
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {scent.notes.slice(0, 4).map((note, index) => (
                  <span 
                    key={index} 
                    className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium"
                  >
                    {note}
                  </span>
                ))}
              </div>
              
              {/* Quote/Tagline */}
              <p className="text-sm italic text-white/90 leading-relaxed mb-6">"{scent.mood}"</p>
            </div>
          </div>
          
          {/* Footer - User Characteristics */}
          <div className="text-center pb-6">
            <div className="bg-black/40 backdrop-blur-sm py-4 px-6 rounded-xl mb-4">
              <p className="text-lg font-semibold text-white mb-2">
                {userName}'s Scent Characteristics
              </p>
              {zodiacSign && (
                <>
                  <p className="text-sm text-white/90 mb-2">
                    <span className="font-medium">Horoscope:</span> {zodiacSign}
                  </p>
                  <p className="text-xs text-white/80 leading-relaxed px-2">
                    {getZodiacDescription()}
                  </p>
                </>
              )}
            </div>
            <p className="text-xs text-white/70 font-light">fordive.id</p>
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