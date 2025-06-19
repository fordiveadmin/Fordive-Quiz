import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroPerfumes from "../../assets/hero-perfumes.png";

export default function Hero() {
  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };
  
  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const floatingBottles = {
    initial: { y: 0 },
    animate: { 
      y: [0, -15, 0],
      transition: { 
        duration: 4,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut"
      }
    }
  };
  
  const rotateBottle = {
    initial: { rotate: 0 },
    animate: { 
      rotate: [0, -5, 5, 0],
      transition: { 
        duration: 6,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="relative min-h-[90vh] md:min-h-screen w-full overflow-hidden pt-20 bg-gradient-to-b from-[#F9F7F2] to-white">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-[#E0D5C1]"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] rounded-full bg-[#d2b183]"
        />
      </div>
      
      {/* Content section */}
      <div className="container mx-auto relative z-10">
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="flex flex-col md:flex-row items-center justify-between h-[70vh] md:h-[85vh] px-4 md:px-6 pt-4"
        >
          {/* Left Text Content */}
          <motion.div 
            variants={fadeInUp}
            className="w-full text-center md:text-left mb-12 md:mb-0"
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="inline-block mb-4 px-4 py-1 rounded-full bg-[#F2ECE3] border border-[#E5D9C3] mx-auto md:mx-0"
            >
              <span className="text-[#C17A50] font-medium text-sm">Discover Your Perfect Scent</span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-playfair font-medium text-[#C17A50] mb-6 leading-tight"
            >
              <span className="block">Find the Scent</span>
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="block italic relative"
              >
                That Defines You
                <motion.span 
                  initial={{ width: 0 }}
                  animate={{ width: "70%" }}
                  transition={{ duration: 1.2, delay: 1 }}
                  className="absolute -bottom-2 left-0 h-[3px] bg-gradient-to-r from-[#d2b183] to-transparent"
                />
              </motion.span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-gray-700 mb-8 max-w-lg"
            >
              <span className="italic text-[#C17A50] font-semibold">"Because fragrance isn't just a smell—it's a signature."</span> Discover the aroma that reflects your personality and becomes part of your story.
            </motion.p>
            
            <motion.div
              variants={fadeInUp}
              className="flex items-center justify-center md:justify-start space-x-6"
            >
              <Link href="/quiz">
                <Button 
                  className="btn-premium py-3 px-8 rounded-md text-base font-medium group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    <span className="mr-2">Find Your Scent</span>
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </motion.span>
                  </span>
                  <motion.span 
                    className="absolute inset-0 bg-[#D7B37A] transform origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                </Button>
              </Link>
              
              <motion.a
                href="#features"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="text-[#C17A50] font-medium underline-offset-4 hover:underline cursor-pointer"
              >
                Learn More
              </motion.a>
            </motion.div>
          </motion.div>
          
          {/* Right Perfume Bottles Display - Only on Desktop */}
          <motion.div 
            variants={fadeInUp}
            className="hidden md:block w-full md:w-1/2 relative h-[300px] md:h-[600px]"
          >
            {/* Perfume bottles with individual animations */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Background glow effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 2 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[500px] md:h-[500px] rounded-full bg-gradient-to-br from-[#FBF7F2] via-[#F5EDDE] to-[#FBEEE1] blur-3xl"
                style={{ zIndex: 0 }}
              />
              
              {/* Complete Perfume Collection */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  transition: { 
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "mirror" 
                  }
                }}
                className="relative w-full h-full flex items-center justify-center scale-100 md:scale-[5.5] lg:scale-[6]"
              >
                <motion.img 
                  src={heroPerfumes}
                  alt="Fordive Perfume Collection" 
                  className="w-auto h-auto md:min-w-[600px] max-h-[280px] md:max-h-[800px] object-contain drop-shadow-2xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Bottom decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="w-full"
        >
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#d2b183] to-transparent w-full mb-6"></div>
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            className="flex justify-center mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d2b183" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
