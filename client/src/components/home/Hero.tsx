import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="relative h-screen w-full overflow-hidden pt-16">
      <div className="absolute inset-0 bg-charcoal opacity-30 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-charcoal opacity-70 z-0"></div>
      <div 
        style={{
          backgroundImage: "url('https://pixabay.com/get/g74e065384229ae05934f20db3fe4c1d2d623f2eeb077c8fd3bca4418b0ee7d27f2e3b8a836732499f130c672f0ece5b09ad9c79ef45e0e7ddd19dd71977a4c6e_1280.jpg')"
        }} 
        className="absolute inset-0 bg-cover bg-center z-[-1]"
      ></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-playfair font-bold text-white mb-6 text-shadow"
        >
          Discover Your Signature Scent
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-white mb-10 max-w-2xl text-shadow"
        >
          Find the perfect fragrance that complements your personality, mood, and zodiac sign
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/quiz">
            <Button 
              className="bg-primary hover:bg-accent text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition duration-300 hover:scale-105"
            >
              Find Your Scent
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
