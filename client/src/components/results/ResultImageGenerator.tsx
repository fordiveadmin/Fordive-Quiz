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
        pixelRatio: 1.5,  // Adjusted for new larger size
        canvasWidth: 810, // 1.5x the visual width (540 * 1.5)
        canvasHeight: 1200 // 1.5x the visual height (800 * 1.5)
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
        className="relative w-[540px] h-[800px] rounded-2xl overflow-hidden shadow-xl"
        style={{ 
          fontFamily: '"Playfair Display", "Montserrat", sans-serif',
          background: 'linear-gradient(135deg, #FAF7F2 0%, #F5F1E8 30%, #E8DCC0 70%, #D4B896 100%)'
        }}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6">
          <div className="flex justify-between items-start mb-8">
            <div className="text-left">
              <p className="text-amber-600 text-base font-medium">Scent Finder Result:</p>
            </div>
            <div className="flex items-center">
              <img 
                src={logoImage} 
                alt="Fordive Logo" 
                className="h-8" 
                crossOrigin="anonymous"
                loading="eager"
              />
            </div>
          </div>
          
          {/* Title */}
          <h2 className="text-gray-800 text-2xl font-medium mb-6">Your Scent Match</h2>
          
          {/* Scent Name */}
          <h1 className="text-5xl font-bold text-center mb-4" style={{ 
            color: '#D4713A', 
            fontFamily: 'Playfair Display, serif',
            fontStyle: 'italic',
            lineHeight: '1.1'
          }}>
            {scent.name}
          </h1>
          
          {/* Vibes Badge */}
          <div className="text-center mb-8">
            <div className="inline-block px-6 py-2 border-2 border-amber-400 rounded-full">
              <span className="text-amber-700 text-base font-medium">
                {scent.vibes.join(', ')}
              </span>
            </div>
          </div>
        </div>
        
        {/* Large Product Image Section with Overlay - Landscape style */}
        <div className="flex-1 relative mx-8 mb-8">
          <div className="w-full h-full relative overflow-hidden rounded-xl">
            {/* Product Image - covering full space */}
            <img 
              src={scent.imageUrl ? getScentImageUrl(scent.name, scent.imageUrl) : getScentImageUrl(scent.name)} 
              alt={scent.name} 
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
              loading="eager"
            />
            
            {/* Soft golden gradient overlay like in template */}
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-yellow-900/90 via-yellow-800/70 via-amber-700/50 to-transparent"></div>
            
            {/* Text overlay on the gradient */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              {zodiacSign && (
                <div className="text-left mb-8">
                  <h3 className="text-white text-2xl font-medium mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {userName}'s scent characteristics
                  </h3>
                  <p className="text-yellow-200 font-medium text-lg mb-3">
                    Horoscope: {zodiacSign}
                  </p>
                  <p className="text-white text-base leading-relaxed max-w-md">
                    {getZodiacDescription()}
                  </p>
                </div>
              )}
              
              {/* Bottom link with search icon */}
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <p className="text-white text-base">
                    Find your scent at <span className="text-yellow-200 font-medium italic border-b border-yellow-200">fordive.id</span>
                  </p>
                  <svg className="w-4 h-4 text-yellow-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
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