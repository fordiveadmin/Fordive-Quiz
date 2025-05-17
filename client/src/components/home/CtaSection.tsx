import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import bannerImage from "../../assets/banner-image.png";

export default function CtaSection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div 
        style={{
          backgroundImage: `url(${bannerImage})`
        }} 
        className="absolute inset-0 bg-cover bg-center z-0 parallax-bg"
      ></div>
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-playfair font-bold text-white mb-6 text-shadow"
        >
          Begin Your Fragrance Journey
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-white mb-10 max-w-2xl mx-auto text-shadow"
        >
          Take our personality quiz to discover the scent that tells your unique story
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/quiz">
            <Button 
              className="bg-primary hover:bg-accent text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition duration-300 hover:scale-105"
            >
              Find Your Scent Now
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
