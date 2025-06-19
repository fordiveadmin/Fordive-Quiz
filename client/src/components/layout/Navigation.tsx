import { useState, useEffect } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import logoImage from "../../assets/fordive-logo.png";

export default function Navigation({ transparent = false }) {
  const [scrolled, setScrolled] = useState(false);
  
  // Detect scroll for transparent header
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  return (
    <header 
      className={cn(
        "fixed top-0 py-4 w-full z-50 transition-all duration-300",
        transparent 
          ? scrolled 
            ? "bg-white/95 backdrop-blur-sm shadow-sm px-6" 
            : "bg-transparent px-6" 
          : "bg-white shadow-sm px-6"
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-start items-center">
        <Link href="/">
          <div className="transition-opacity duration-300 hover:opacity-90">
            <img 
              src={logoImage} 
              alt="Fordive Logo" 
              className={cn(
                "h-8 md:h-10 w-auto",
                transparent && !scrolled ? "brightness-100" : "brightness-100"
              )} 
            />
          </div>
        </Link>
      </div>
    </header>
  );
}