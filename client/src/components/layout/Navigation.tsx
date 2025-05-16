import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navigation({ transparent = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
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
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
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
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <div className={cn(
              "font-playfair text-2xl font-bold transition-colors duration-300",
              transparent && !scrolled ? "gold-gradient" : "text-[#C89F65]"
            )}>
              <div className="flex items-center space-x-2">
                <span className="text-3xl">F</span>
                <span>ORDIVE</span>
              </div>
            </div>
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-12">
          <Link href="/">
            <div className={cn(
              transparent && !scrolled ? "text-white" : "text-gray-800",
              "hover:text-[#C89F65] transition-colors duration-300 font-medium text-sm uppercase tracking-wide",
              location === "/" && "text-[#C89F65]"
            )}>
              Shop
            </div>
          </Link>
          <Link href="/quiz">
            <div className={cn(
              transparent && !scrolled ? "text-white" : "text-gray-800",
              "hover:text-[#C89F65] transition-colors duration-300 font-medium text-sm uppercase tracking-wide",
              location === "/quiz" && "text-[#C89F65]"
            )}>
              Find Your Scent
            </div>
          </Link>
          <div 
            className={cn(
              transparent && !scrolled ? "text-white" : "text-gray-800",
              "hover:text-[#C89F65] transition-colors duration-300 font-medium text-sm uppercase tracking-wide cursor-pointer"
            )}
          >
            Mission
          </div>
          <div 
            className={cn(
              transparent && !scrolled ? "text-white" : "text-gray-800",
              "hover:text-[#C89F65] transition-colors duration-300 font-medium text-sm uppercase tracking-wide cursor-pointer"
            )}
          >
            About Us
          </div>
          <div 
            className={cn(
              transparent && !scrolled ? "text-white" : "text-gray-800",
              "hover:text-[#C89F65] transition-colors duration-300 font-medium text-sm uppercase tracking-wide cursor-pointer"
            )}
          >
            Distributor
          </div>
        </nav>
        
        <div className="md:hidden">
          <button 
            onClick={toggleMenu}
            className={cn(
              "text-2xl transition-colors duration-300",
              transparent && !scrolled ? "text-white" : "text-[#C89F65]"
            )}
            aria-label="Toggle Menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md p-6 z-50 overflow-hidden"
          >
            <div className="flex justify-end mb-4">
              <button 
                onClick={toggleMenu}
                className="text-2xl text-[#C89F65]"
                aria-label="Close Menu"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col space-y-4">
              <Link href="/">
                <div 
                  className={cn(
                    "py-2 text-gray-800 hover:text-[#C89F65] font-medium text-sm uppercase tracking-wide",
                    location === "/" && "text-[#C89F65]"
                  )}
                  onClick={toggleMenu}
                >
                  Shop
                </div>
              </Link>
              <Link href="/quiz">
                <div 
                  className={cn(
                    "py-2 text-gray-800 hover:text-[#C89F65] font-medium text-sm uppercase tracking-wide",
                    location === "/quiz" && "text-[#C89F65]"
                  )}
                  onClick={toggleMenu}
                >
                  Find Your Scent
                </div>
              </Link>
              <div 
                className="py-2 text-gray-800 hover:text-[#C89F65] font-medium text-sm uppercase tracking-wide cursor-pointer"
                onClick={toggleMenu}
              >
                Mission
              </div>
              <div 
                className="py-2 text-gray-800 hover:text-[#C89F65] font-medium text-sm uppercase tracking-wide cursor-pointer"
                onClick={toggleMenu}
              >
                About Us
              </div>
              <div 
                className="py-2 text-gray-800 hover:text-[#C89F65] font-medium text-sm uppercase tracking-wide cursor-pointer"
                onClick={toggleMenu}
              >
                Distributor
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}