import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="relative h-screen w-full overflow-hidden pt-16 bg-[#F9F7F2]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F9F7F2]/80 z-0"></div>
      <div 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1920&auto=format&fit=crop')"
        }} 
        className="absolute inset-0 bg-cover bg-center z-[-1] opacity-60"
      ></div>
      
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 h-[80vh] relative z-10">
          <div className="flex flex-col justify-center pr-4 md:pl-10 text-left">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-playfair font-medium italic text-[#C17A50] mb-4"
            >
              <span className="block">Love More</span>
              <span className="block">Live More</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-gray-700 mb-8 max-w-md"
            >
              Since the first day we believe that Fordive is not just a Product, we are a brand with vision. 
              <span className="font-semibold">"Always have a positive impact on society".</span> So we deliver the importance of self love and share it with others.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-8"
            >
              <Link href="/quiz">
                <Button 
                  className="btn-premium py-3 px-8 rounded-md text-base font-medium"
                >
                  <span className="mr-2">Find Your Scent</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </Button>
              </Link>
            </motion.div>
          </div>
          
          <div className="hidden md:flex items-center justify-center relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="float"
            >
              <div className="relative w-[400px] h-[400px]">
                <img 
                  src="https://i.imgur.com/h3N3cHJ.png" 
                  alt="Fordive Perfume Collection" 
                  className="object-contain w-full h-full z-10"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Golden line divider */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C89F65] to-transparent"></div>
    </div>
  );
}
