import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { getScentImageUrl } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import logoImage from "../../assets/logo.png";
import fordivePattern from '@assets/Vector Smart Object_1750266780273.png';

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
        pixelRatio: 2,  // High quality for Instagram Story
        canvasWidth: 1080, // 2x the visual width (540 * 2) 
        canvasHeight: 1920 // 2x the visual height (960 * 2)
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
        className="relative w-[540px] h-[960px] rounded-2xl overflow-hidden shadow-xl"
        style={{ 
          fontFamily: '"Inter", sans-serif',
          background: '#d2abe7'
        }}
      >
        {/* Background logo with opacity */}
        <div 
          className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none"
          style={{ transform: 'scale(1.2)' }}
        >
          <img 
            src={logoImage} 
            alt="" 
            className="w-32 h-32"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>

        {/* Header */}
        <div className="px-8 pt-8 pb-6">
          <div className="flex justify-between items-start mb-6">
            <div className="text-left">
              <p 
                style={{ 
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '32px',
                  color: '#d2abe7',
                  fontWeight: '500'
                }}
              >
                Scent Finder Result:
              </p>
            </div>
            <div className="flex items-center">
              <img 
                src={logoImage} 
                alt="Fordive Logo" 
                className="w-16 h-16" 
                crossOrigin="anonymous"
                loading="eager"
              />
            </div>
          </div>
          
          {/* Title */}
          <h2 
            style={{ 
              fontFamily: '"Inter", sans-serif',
              fontSize: '51.78px',
              color: 'white',
              fontWeight: '300'
            }}
            className="mb-6"
          >
            Your Scent Match
          </h2>
          
          {/* Scent Name */}
          <h1 
            style={{ 
              fontFamily: '"Playfair Display", serif',
              fontSize: '135.56px',
              color: 'white',
              fontStyle: 'italic',
              lineHeight: '1.1',
              fontWeight: '400'
            }}
            className="text-left mb-8"
          >
            {scent.name}
          </h1>
          
          {/* Vibes Badge */}
          <div className="text-left mb-8">
            <div 
              className="inline-block px-6 py-3 rounded-full"
              style={{ 
                backgroundColor: 'white',
                border: '2px solid #DA7346'
              }}
            >
              <span 
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '24px',
                  color: '#DA7346',
                  fontWeight: '400'
                }}
              >
                {scent.vibes.join(', ')}
              </span>
            </div>
          </div>
        </div>
        
        {/* Product Image Section */}
        <div className="absolute top-96 left-0 right-0 bottom-0">
          <div className="w-full h-full relative overflow-hidden">
            {/* Product Image - covering full remaining space */}
            <img 
              src={scent.imageUrl ? getScentImageUrl(scent.name, scent.imageUrl) : getScentImageUrl(scent.name)} 
              alt={scent.name} 
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
              loading="eager"
            />
            
            {/* Gradient overlay with #d2abe7 */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-80"
              style={{
                background: 'linear-gradient(180deg, transparent 0%, rgba(210, 171, 231, 0.8) 50%, #d2abe7 100%)'
              }}
            ></div>
            
            {/* Text overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              {zodiacSign && (
                <div className="text-left mb-6">
                  <h3 
                    style={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '24px',
                      color: 'white',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}
                  >
                    {userName}'s scent characteristics
                  </h3>
                  <p 
                    style={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '24px',
                      color: 'white',
                      fontWeight: '400',
                      marginBottom: '12px'
                    }}
                  >
                    Horoscope: {zodiacSign}
                  </p>
                  <p 
                    style={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '24px',
                      color: 'white',
                      fontWeight: '400',
                      lineHeight: '1.4',
                      marginBottom: '16px'
                    }}
                  >
                    {getZodiacDescription()}
                  </p>
                </div>
              )}
              
              {/* Bottom link with search icon */}
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <p 
                    style={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '24px',
                      color: 'white',
                      fontWeight: '400'
                    }}
                  >
                    Find your scent at{' '}
                    <span 
                      style={{
                        fontStyle: 'italic',
                        fontWeight: 'bold',
                        textDecoration: 'underline'
                      }}
                    >
                      fordive.id
                    </span>
                  </p>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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