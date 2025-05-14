import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote: "The quiz was so accurate! My Utopia scent matches my personality perfectly. I've received so many compliments.",
    name: "Anita S.",
    zodiac: "Pisces",
    rating: 5
  },
  {
    id: 2,
    quote: "As a Leo, I was skeptical, but the Scent Finder nailed it. Shelby has become my signature fragrance for important meetings.",
    name: "Michael K.",
    zodiac: "Leo",
    rating: 5
  },
  {
    id: 3,
    quote: "I bought Feeling Good after taking the quiz. It's like the fragrance was made for me! The zodiac insights were a nice touch.",
    name: "Sophia T.",
    zodiac: "Gemini",
    rating: 4.5
  }
];

export default function Testimonials() {
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
  
  const renderStars = (rating: number) => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
        );
      } else if (i - 0.5 <= rating) {
        stars.push(
          <div key={i} className="relative">
            <Star className="h-4 w-4 text-primary" />
            <Star className="absolute top-0 left-0 h-4 w-4 fill-primary text-primary" style={{ clipPath: 'inset(0 50% 0 0)' }} />
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className="h-4 w-4 text-primary" />
        );
      }
    }
    
    return stars;
  };
  
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-playfair font-bold text-center mb-16"
        >
          What People Say
        </motion.h2>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div 
              key={testimonial.id}
              variants={item}
              className="bg-secondary p-8 rounded-lg shadow-sm"
            >
              <div className="flex items-center mb-4">
                <div className="flex text-primary">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              <p className="mb-6 italic">{testimonial.quote}</p>
              <div className="flex items-center">
                <p className="font-semibold">{testimonial.name}</p>
                <span className="mx-2 text-primary">•</span>
                <p className="text-sm text-muted-foreground">{testimonial.zodiac}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
