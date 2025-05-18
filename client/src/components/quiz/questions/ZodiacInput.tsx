import { useState, useEffect } from 'react';
import { useStore } from '@/store/quizStore';
import { motion } from 'framer-motion';
import { zodiacSigns, getZodiacSign, ZodiacSign } from '@/lib/zodiac';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function ZodiacInput() {
  const { zodiacSign, setZodiacSign } = useStore();
  const [month, setMonth] = useState<number | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  const [revealZodiac, setRevealZodiac] = useState(false);
  
  // Set day options based on selected month
  useEffect(() => {
    if (month) {
      // Get days in the selected month
      let daysCount = 31; // Default for most months
      if (month === 2) {
        daysCount = 29; // February (include leap year possibility)
      } else if ([4, 6, 9, 11].includes(month)) {
        daysCount = 30; // April, June, September, November
      }
      
      const days = Array.from({ length: daysCount }, (_, i) => i + 1);
      setDaysInMonth(days);
    } else {
      setDaysInMonth([]);
    }
  }, [month]);
  
  // Determine zodiac sign when both month and day are selected
  useEffect(() => {
    if (month && day) {
      const sign = getZodiacSign(month, day);
      if (sign) {
        setZodiacSign(sign);
        setRevealZodiac(true);
      }
    }
  }, [month, day, setZodiacSign]);
  
  // Set initial values if zodiac sign already exists
  useEffect(() => {
    if (zodiacSign) {
      // This is just for interface display, we don't actually need to set the
      // month and day as we already have the zodiac sign
      setRevealZodiac(true);
    }
  }, [zodiacSign]);
  
  return (
    <div className="space-y-8">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-playfair font-semibold text-center text-foreground"
      >
        What's your birth date?
      </motion.h2>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center text-muted-foreground"
      >
        We'll use this to determine your zodiac sign's influence on your scent profile
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-md mx-auto"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="birth-month" className="block text-sm font-medium text-foreground mb-1">
              Month
            </Label>
            <Select
              value={month?.toString() || ""}
              onValueChange={(value) => {
                setMonth(parseInt(value));
                setDay(null); // Reset day when month changes
              }}
            >
              <SelectTrigger id="birth-month">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">January</SelectItem>
                <SelectItem value="2">February</SelectItem>
                <SelectItem value="3">March</SelectItem>
                <SelectItem value="4">April</SelectItem>
                <SelectItem value="5">May</SelectItem>
                <SelectItem value="6">June</SelectItem>
                <SelectItem value="7">July</SelectItem>
                <SelectItem value="8">August</SelectItem>
                <SelectItem value="9">September</SelectItem>
                <SelectItem value="10">October</SelectItem>
                <SelectItem value="11">November</SelectItem>
                <SelectItem value="12">December</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="birth-day" className="block text-sm font-medium text-foreground mb-1">
              Day
            </Label>
            <Select
              value={day?.toString() || ""}
              onValueChange={(value) => setDay(parseInt(value))}
              disabled={!month}
            >
              <SelectTrigger id="birth-day">
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent>
                {daysInMonth.map((d) => (
                  <SelectItem key={d} value={d.toString()}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {revealZodiac && zodiacSign && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
            className="mt-6 text-center"
          >
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 rounded-full bg-white border-2 border-[#C89F65] shadow-md flex items-center justify-center">
                <i className={`${zodiacSign.iconClass} text-[#C89F65] text-2xl`}></i>
              </div>
            </div>
            <p className="font-playfair font-semibold text-xl">
              {zodiacSign.name} {zodiacSign.symbol}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {zodiacSign.dateRange}
            </p>
            <p className="text-sm mt-2">
              <span className="font-medium">{zodiacSign.element} Element</span>
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
