import { motion } from 'framer-motion';

interface QuizProgressProps {
  current: number;
  total: number;
}

export default function QuizProgress({ current, total }: QuizProgressProps) {
  const progressPercentage = ((current - 1) / total) * 100;
  
  return (
    <div className="w-full bg-gray-200 h-1">
      <motion.div 
        className="progress-bar h-1"
        initial={{ width: `${((current - 1) / total) * 100}%` }}
        animate={{ width: `${progressPercentage}%` }}
        transition={{ duration: 0.3 }}
      />
      <div className="max-w-5xl mx-auto px-6 py-3 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Question <span className="font-medium">{current}</span> of <span>{total}</span>
        </div>
      </div>
    </div>
  );
}
