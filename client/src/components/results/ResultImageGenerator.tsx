import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { getScentImageUrl } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import logoImage from "../../assets/logo.png";

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

  // Get zodiac description for this scent (shortened to first sentence only)
  const getZodiacDescription = () => {
    if (!zodiacMappings || !Array.isArray(zodiacMappings)) return "";
    
    const mapping = zodiacMappings.find((m: any) => m.scentId === scent.id);
    if (mapping && mapping.description) {
      // Return only text up to the first period
      const firstSentence = mapping.description.split('.')[0];
      return firstSentence + (firstSentence.length < mapping.description.length ? '.' : '');
    }
    
    // Default zodiac descriptions (already short)
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
      // Wait for all images to load before capturing
      const images = storyRef.current.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
        })
      );

      // Add a small delay to ensure everything is rendered
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use higher quality settings for better resolution
      const dataUrl = await toPng(storyRef.current, { 
        quality: 1.0, 
        pixelRatio: 2,  // 2x pixel ratio for good quality with smaller file size
        canvasWidth: 700, // 2x the visual width
        canvasHeight: 1240 // 2x the visual height
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
        className="relative w-[350px] h-[620px] rounded-2xl overflow-hidden shadow-xl"
        style={{ 
          fontFamily: '"Playfair Display", "Montserrat", sans-serif',
          background: 'linear-gradient(to bottom, #FAF7F2 0%, #F5F1E8 50%, #E8DCC0 100%)'
        }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex justify-between items-start mb-6">
            <div className="text-left">
              <p className="text-amber-600 text-sm font-medium">Scent Finder Result:</p>
            </div>
            <div className="flex items-center">
              <img 
                src={logoImage} 
                alt="Fordive Logo" 
                className="h-6" 
                crossOrigin="anonymous"
                loading="eager"
              />
            </div>
          </div>
          
          {/* Title */}
          <h2 className="text-gray-800 text-lg font-medium mb-4">Your Scent Match</h2>
          
          {/* Scent Name */}
          <h1 className="text-3xl font-bold text-center mb-3" style={{ 
            color: '#D4713A', 
            fontFamily: 'Playfair Display, serif',
            fontStyle: 'italic',
            lineHeight: '1.1'
          }}>
            {scent.name}
          </h1>
          
          {/* Vibes Badge */}
          <div className="text-center mb-4">
            <div className="inline-block px-3 py-1 border border-amber-400 rounded-full">
              <span className="text-amber-700 text-xs font-medium">
                {scent.vibes.join(', ')}
              </span>
            </div>
          </div>
        </div>
        
        {/* Large Product Image Section */}
        <div className="px-6 mb-4 flex-1">
          <div className="w-full h-56 relative rounded-lg overflow-hidden shadow-lg">
            {/* Background with subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-50 to-amber-100 opacity-80"></div>
            <img 
              src={scent.imageUrl ? getScentImageUrl(scent.name, scent.imageUrl) : getScentImageUrl(scent.name)} 
              alt={scent.name} 
              className="w-full h-full object-contain relative z-10"
              crossOrigin="anonymous"
              loading="eager"
            />
          </div>
        </div>
        
        {/* Bottom Section with overlay on image */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
          {zodiacSign && (
            <div className="mb-4">
              {/* Semi-transparent background */}
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 text-white">
                <h3 className="text-white text-base font-medium mb-2">
                  {userName}'s scent characteristics
                </h3>
                <p className="text-amber-200 font-medium text-xs mb-1">
                  Horoscope: {zodiacSign}
                </p>
                <p className="text-white text-xs leading-relaxed">
                  {getZodiacDescription()}
                </p>
              </div>
            </div>
          )}
          
          <div className="text-center">
            <p className="text-gray-700 text-xs">
              Find your scent at <span className="text-amber-700 font-medium italic">fordive.id</span>
            </p>
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