'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { IconHeart, IconPhoto, IconMessage } from '@tabler/icons-react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface TimelineItem {
  date: string;
  title: string;
  description: string;
  image?: string;
  icon?: 'heart' | 'photo' | 'message';
}

interface TimelineProps {
  items: TimelineItem[];
}

const iconMap = {
  heart: IconHeart,
  photo: IconPhoto,
  message: IconMessage,
};

const TimelineEvent = ({ item, index }: { item: TimelineItem; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      className="flex flex-col md:flex-row items-center gap-8 my-12 md:my-16"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Content */}
      <div className={`flex-1 text-center md:text-left ${index % 2 === 0 ? 'md:text-right md:order-1' : 'md:order-3'}`}>
        <motion.h3 
          className="text-2xl font-bold text-primary mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {item.title}
        </motion.h3>
        <motion.p 
          className="text-sm text-muted-foreground mb-2"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {item.date}
        </motion.p>
        <motion.p 
          className="text-foreground"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {item.description}
        </motion.p>
      </div>

      {/* Timeline Node */}
      <div className={`relative flex items-center justify-center md:order-2`}>
        <motion.div 
          className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center relative z-10"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {item.icon && React.createElement(iconMap[item.icon], {
            className: "w-8 h-8 text-primary",
            stroke: 1.5
          })}
        </motion.div>
        <div className="absolute w-1 bg-primary/20 h-24 md:h-full top-full"></div>
        {index !== 0 && <div className="absolute w-1 bg-primary/20 h-24 md:h-full bottom-full"></div>}
      </div>

      {/* Image */}
      {item.image && (
        <motion.div 
          className={`flex-1 ${index % 2 === 0 ? 'md:order-3' : 'md:order-1'}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-lg">
            <img 
              src={item.image} 
              alt={item.title}
              className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <div className="max-w-7xl mx-auto py-8 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="relative">
        {items.map((item, index) => (
          <TimelineEvent key={index} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}; 