import React, { useRef } from "react";
import { toPng } from "html-to-image";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getScentImageUrl } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

import logoImage from "../../assets/fordive-logo.png";
import fordivePattern from "@assets/bg_1750908182073.png";

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

export default function ResultImageGenerator({
  scent,
  userName,
  zodiacSign,
}: ResultImageGeneratorProps) {
  const { toast } = useToast();
  const storyRef = useRef<HTMLDivElement>(null);

  // === GET ZODIAC DESCRIPTION ===
  const { data: zodiacMappings } = useQuery({
    queryKey: ["/api/zodiac-mappings/sign", zodiacSign],
    queryFn: async () => {
      if (!zodiacSign) return [];
      try {
        const response = await fetch(`/api/zodiac-mappings/sign/${zodiacSign}`);
        return response.ok ? response.json() : [];
      } catch {
        return [];
      }
    },
    enabled: !!zodiacSign,
  });

  const getZodiacDescription = () => {
    if (!zodiacMappings || !Array.isArray(zodiacMappings)) return "";

    const mapping = zodiacMappings.find((m: any) => m.scentId === scent.id);
    if (mapping?.description) {
      const firstSentence = mapping.description.split(".")[0];
      return (
        firstSentence +
        (firstSentence.length < mapping.description.length ? "." : "")
      );
    }

    const fallback: { [key: string]: string } = {
      Aries:
        "Bold and energetic, you embrace life with passion and confidence.",
      Taurus: "Reliable and sensual, you appreciate the finer things in life.",
      Gemini: "Curious and versatile, you adapt easily to new experiences.",
      Cancer: "Intuitive and nurturing, you value emotional connections.",
      Leo: "Charismatic and generous, you naturally shine in any crowd.",
      Virgo: "Analytical and refined, you seek perfection in all things.",
      Libra: "Harmonious and elegant, you bring balance to every situation.",
      Scorpio: "Intense and mysterious, you possess deep emotional insight.",
      Sagittarius: "Adventurous and optimistic, you seek freedom and truth.",
      Capricorn: "Ambitious and practical, you build lasting foundations.",
      Aquarius: "Innovative and independent, you think outside the box.",
      Pisces: "Imaginative and compassionate, you connect deeply with others.",
    };

    return fallback[zodiacSign || ""] || "";
  };

  // === DOWNLOAD IMAGE FUNCTION ===
  const handleDownloadImage = async () => {
    if (!storyRef.current) return;

    try {
      const images = storyRef.current.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((res, rej) => {
                img.onload = res;
                img.onerror = rej;
              }),
        ),
      );

      await new Promise((r) => setTimeout(r, 500));

      const dataUrl = await toPng(storyRef.current, {
        quality: 1,
        pixelRatio: 2,
        canvasWidth: 750,
        canvasHeight: 1334,
      });

      const link = document.createElement("a");
      link.download = `fordive-${scent.name.toLowerCase().replace(/\s+/g, "-")}-result.png`;
      link.href = dataUrl;
      link.click();

      toast({
        title: "HD Image Downloaded",
        description:
          "Your high-quality personalized result image has been downloaded",
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    }
  };

  // === MAIN RENDER ===
  return (
    <div className="flex flex-col items-center">
      <div
        ref={storyRef}
        className="relative w-[375px] h-[667px] rounded-2xl overflow-hidden shadow-xl"
        style={{
          fontFamily: '"Playfair Display", "Montserrat", sans-serif',
          background:
            "linear-gradient(135deg, #FAF7F2 0%, #F7F4EF 50%, #F0EAD6 100%)",
        }}
      >
        {/* Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `url(${fordivePattern})`,
            backgroundSize: "400px",
            backgroundRepeat: "repeat",
          }}
        />

        {/* Header Section */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex justify-between items-start mb-4">
            <p
              className="text-sm font-semibold font-inter"
              style={{ color: "#d0ab65" }}
            >
              Scent Finder Result:
            </p>
            <img
              src={logoImage}
              alt="Fordive Logo"
              className="h-6"
              crossOrigin="anonymous"
            />
          </div>

          <h2 className="text-gray-60 text-lg font-light mb-0 font-inter">
            Your Scent Match
          </h2>

          <h1
            className="text-6xl font-normal text-left mb-1"
            style={{
              color: "#D4713A",
              fontFamily: "Playfair Display, serif",
              fontStyle: "italic",
              lineHeight: "1.1",
            }}
          >
            {scent.name}
          </h1>

          <div className="text-left mb-6">
            <div className="inline-block px-3 py-1 border border-amber-400 rounded-full">
              <span className="text-amber-700 text-xs font-medium">
                {scent.vibes.join(", ")}
              </span>
            </div>
          </div>
        </div>

        {/* Product Image */}
        <div className="absolute top-56 left-4 right-4 bottom-0">
          <div className="w-full h-full relative overflow-hidden rounded-t-xl shadow-2xl">
            <img
              src={
                scent.imageUrl
                  ? getScentImageUrl(scent.name, scent.imageUrl)
                  : getScentImageUrl(scent.name)
              }
              alt={scent.name}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
              loading="eager"
            />

            {/* Gradient Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-[#d0ab65]/95 via-[#e8d4aa]/85 via-[#f4ead3]/40 to-transparent" />

            {/* Text Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              {zodiacSign && (
                <div className="text-left mb-6">
                  <h3
                    className="text-white text-lg font-medium mb-2"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {userName}'s scent characteristics
                  </h3>
                  <p className="font-medium text-sm mb-2 font-inter italic">
                    Horoscope: {zodiacSign}
                  </p>
                  <p className="text-sm leading-relaxed font-inter">
                    {getZodiacDescription()}
                  </p>
                </div>
              )}

              <div className="text-left">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-inter italic">
                    Find your scent at{" "}
                    <span className="font-medium italic border-b border-white">
                      fordive.id
                    </span>
                  </p>
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
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
