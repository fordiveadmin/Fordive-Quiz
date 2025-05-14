import { useState } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navigation({ transparent = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  return (
    <header 
      className={cn(
        "py-4 px-6 w-full z-10",
        transparent 
          ? "absolute bg-transparent" 
          : "bg-white shadow-sm"
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <a className="font-playfair text-2xl font-bold text-charcoal">FORDIVE</a>
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <Link href="/">
            <a className={cn(
              transparent ? "text-white" : "text-charcoal",
              "hover:text-primary transition-colors duration-300",
              location === "/" && "text-primary font-medium"
            )}>
              Home
            </a>
          </Link>
          <Link href="/quiz">
            <a className={cn(
              transparent ? "text-white" : "text-charcoal",
              "hover:text-primary transition-colors duration-300",
              location === "/quiz" && "text-primary font-medium"
            )}>
              Find Your Scent
            </a>
          </Link>
          <a 
            href="#" 
            className={cn(
              transparent ? "text-white" : "text-charcoal",
              "hover:text-primary transition-colors duration-300"
            )}
          >
            About
          </a>
          <a 
            href="#" 
            className={cn(
              transparent ? "text-white" : "text-charcoal",
              "hover:text-primary transition-colors duration-300"
            )}
          >
            Contact
          </a>
        </nav>
        
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "md:hidden",
            transparent ? "text-white" : "text-charcoal"
          )}
          onClick={toggleMenu}
          aria-label="Menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-20"
        >
          <div className="flex flex-col p-4">
            <Link href="/">
              <a 
                className="py-3 px-4 text-charcoal hover:bg-muted rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Home
              </a>
            </Link>
            <Link href="/quiz">
              <a 
                className="py-3 px-4 text-charcoal hover:bg-muted rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Find Your Scent
              </a>
            </Link>
            <a href="#" className="py-3 px-4 text-charcoal hover:bg-muted rounded-md">
              About
            </a>
            <a href="#" className="py-3 px-4 text-charcoal hover:bg-muted rounded-md">
              Contact
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
}
