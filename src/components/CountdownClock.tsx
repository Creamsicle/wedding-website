"use client";

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function CountdownClock() {
  const [timeLeft, setTimeLeft] = useState({
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = dayjs.tz('2025-10-10 08:00', 'America/New_York');

    const calculateTimeLeft = () => {
      const now = dayjs();
      const diff = targetDate.diff(now, 'second');

      if (diff <= 0) {
        return {
          months: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }

      // Calculate total days first
      const totalDays = Math.floor(diff / (24 * 60 * 60));
      
      // Calculate months (assuming average month length of 30.44 days)
      const months = Math.floor(totalDays / 30.44);
      
      // Remaining days after removing months
      const days = Math.floor(totalDays % 30.44);
      
      // Calculate hours, minutes, seconds
      const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((diff % (60 * 60)) / 60);
      const seconds = diff % 60;

      return {
        months,
        days,
        hours,
        minutes,
        seconds
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white/5 rounded-lg p-4 min-w-[100px] backdrop-blur-sm border border-white/10">
        <div className="text-4xl font-bold text-[#FFF8E7]">{value.toString().padStart(2, '0')}</div>
        <div className="text-sm text-white/80 uppercase tracking-wider mt-1">{label}</div>
      </div>
    </div>
  );

  return (
    <div className="text-center space-y-8">
      <h2 className="text-3xl font-serif text-[#FFF8E7]">The First Ceremony Begins In</h2>
      <div className="flex flex-wrap justify-center gap-4">
        <TimeUnit value={timeLeft.months} label="Months" />
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  );
} 