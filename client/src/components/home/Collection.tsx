import { motion, useInView, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { getScentImageUrl } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

interface Scent {
  id: number;
  name: string;
  vibes: string[];
  notes: string[];
  mood: string;
  imageUrl?: string;
  purchaseUrl?: string;
}

export default function Collection() {
  const { data: scents, isLoading } = useQuery<Scent[]>({
    queryKey: ['/api/scents'],
  });

  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  
  const [hoveredScent, setHoveredScent] = useState<number | null>(null);
  
  useEffect(() => {
    if (isInView) {
      controls.start("show");
    }
  }, [controls, isInView]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring", 
        stiffness: 100,
        damping: 12
      }
    }
  };

  const imageVariants = {
    hover: { 
      scale: 1.08,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    initial: { 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeIn"
      }
    }
  };
  
  const overlayVariants = {
    hover: { 
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    initial: { 
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };
  
  const buttonVariants = {
    hover: { 
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    initial: { 
      y: 20,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };
  
  const notesVariants = {
    hover: { 
      y: 0,
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
        duration: 0.3,
        ease: "easeOut"
      }
    },
    initial: { 
      y: 10,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };
  
  const noteItemVariants = {
    hover: { 
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    initial: { 
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };
  
  const getTitleColor = (index: number) => {
    const colors = [
      'text-[#B37D55]', // copper/bronze
      'text-[#926E52]', // amber
      'text-[#A88455]', // golden tan
      'text-[#9C7A54]', // honey 
      'text-[#C17A50]', // terracotta
    ];
    return colors[index % colors.length];
  };
  
  return (
    <section className="py-24 px-6 bg-[#F9F7F2] relative overflow-hidden" ref={ref}>
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.04 }}
          transition={{ duration: 2 }}
          className="absolute -top-[20%] -right-[20%] w-[600px] h-[600px] rounded-full bg-[#C89F65]"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.04 }}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute top-[60%] -left-[10%] w-[400px] h-[400px] rounded-full bg-[#C89F65]"
        />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-[#F2ECE3] border border-[#E5D9C3] text-[#C17A50] font-medium text-sm mb-4">
            Exclusive Collection
          </span>
          <h2 className="text-4xl md:text-5xl font-playfair font-medium mb-4">
            Our <span className="italic text-[#C17A50]">Signature</span> Scents
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Each fragrance tells a unique story, crafted to evoke emotions and memories that stay with you.
          </p>
        </motion.div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="premium-card h-[480px] flex flex-col relative">
                <div className="h-[280px] w-full relative bg-gradient-to-b from-[#F9F7F2] to-[#EDEAE0] animate-pulse"></div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="h-6 w-32 bg-[#EDEAE0] rounded animate-pulse mb-3"></div>
                  <div className="h-4 w-40 bg-[#EDEAE0] rounded animate-pulse mb-4"></div>
                  <div className="h-4 w-full bg-[#EDEAE0] rounded animate-pulse"></div>
                  <div className="mt-auto pt-4 flex space-x-3">
                    <div className="h-10 w-full bg-[#EDEAE0] rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {(scents || []).map((scent, index) => (
              <motion.div
                key={scent.id}
                variants={item}
                className="premium-card h-[480px] flex flex-col relative group"
                onMouseEnter={() => setHoveredScent(scent.id)}
                onMouseLeave={() => setHoveredScent(null)}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                <div className="h-[280px] w-full relative overflow-hidden">
                  <motion.img 
                    src={(scent as any).imageUrl ? getScentImageUrl(scent.name, (scent as any).imageUrl) : getScentImageUrl(scent.name)} 
                    alt={`${scent.name} Perfume`} 
                    className="w-full h-full object-cover"
                    variants={imageVariants}
                    initial="initial"
                    animate={hoveredScent === scent.id ? "hover" : "initial"}
                  />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6"
                    variants={overlayVariants}
                    initial="initial"
                    animate={hoveredScent === scent.id ? "hover" : "initial"}
                  >
                    <motion.div
                      className="flex flex-wrap gap-2"
                      variants={notesVariants}
                      initial="initial"
                      animate={hoveredScent === scent.id ? "hover" : "initial"}
                    >
                      {scent.notes && scent.notes.slice(0, 3).map((note, idx) => (
                        <motion.span 
                          key={idx}
                          variants={noteItemVariants}
                          className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white"
                        >
                          {note}
                        </motion.span>
                      ))}
                    </motion.div>
                  </motion.div>
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className={`font-playfair text-2xl font-medium mb-2 ${getTitleColor(index)}`}>
                    {scent.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3">
                    {scent.vibes && scent.vibes.slice(0, 3).join(' • ')}
                  </p>
                  <p className="italic text-sm text-gray-600 flex-grow">"{scent.mood}"</p>
                  
                  <motion.div 
                    className="mt-4 flex space-x-3"
                    variants={buttonVariants}
                    initial="initial"
                    animate={hoveredScent === scent.id ? "hover" : "initial"}
                  >
                    <Link href="/quiz">
                      <div className="bg-[#F2ECE3] hover:bg-[#E5D9C3] text-[#B37D55] font-medium py-2 px-4 rounded-md text-sm transition-colors duration-300 flex-1 text-center cursor-pointer">
                        Match With Me
                      </div>
                    </Link>
                    {scent.purchaseUrl && (
                      <a 
                        href={scent.purchaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-premium py-2 px-4 rounded-md text-sm flex-1 text-center"
                      >
                        Buy Now
                      </a>
                    )}
                  </motion.div>
                </div>
                
                <motion.div 
                  className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C89F65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                  </svg>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <Link href="/quiz">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center btn-premium py-3 px-8 rounded-md text-base font-medium group cursor-pointer"
            >
              <span>Find Your Perfect Match</span>
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
                className="ml-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </motion.span>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
