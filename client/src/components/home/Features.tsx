import { motion } from "framer-motion";
import { 
  CircleHelp, 
  Star, 
  FlaskRound
} from "lucide-react";

export default function Features() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <section className="py-24 px-6 bg-[#F9F7F2]">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-playfair font-medium text-center mb-16 text-[#3A3A3A]"
        >
          How It Works
        </motion.h2>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          <motion.div 
            variants={item}
            className="flex flex-col items-center text-center premium-card p-8 hover:translate-y-[-5px] transition-all duration-500"
          >
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm border border-[#EDEAE0]">
              <CircleHelp className="h-10 w-10 text-[#C89F65]" />
            </div>
            <h3 className="text-xl font-playfair font-semibold mb-4 text-[#555555]">Answer Questions</h3>
            <p className="text-gray-600">
              Tell us about your preferences, personality, and lifestyle through our interactive quiz
            </p>
          </motion.div>
          
          <motion.div 
            variants={item}
            className="flex flex-col items-center text-center premium-card p-8 hover:translate-y-[-5px] transition-all duration-500"
          >
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm border border-[#EDEAE0]">
              <Star className="h-10 w-10 text-[#C89F65]" />
            </div>
            <h3 className="text-xl font-playfair font-semibold mb-4 text-[#555555]">Reveal Your Zodiac</h3>
            <p className="text-gray-600">
              Share your birth date to discover how your zodiac influences your scent preferences
            </p>
          </motion.div>
          
          <motion.div 
            variants={item}
            className="flex flex-col items-center text-center premium-card p-8 hover:translate-y-[-5px] transition-all duration-500"
          >
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm border border-[#EDEAE0]">
              <FlaskRound className="h-10 w-10 text-[#C89F65]" />
            </div>
            <h3 className="text-xl font-playfair font-semibold mb-4 text-[#555555]">Find Your Match</h3>
            <p className="text-gray-600">
              Get paired with your perfect Fordive fragrance based on your unique personality
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
