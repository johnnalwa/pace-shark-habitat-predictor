'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Lenis from 'lenis';

interface ScrollStackProps {
  children: React.ReactNode;
}

interface ScrollStackItemProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollStackItem({ children, className = '' }: ScrollStackItemProps) {
  return (
    <div className={`scroll-stack-item ${className}`}>
      {children}
    </div>
  );
}

export default function ScrollStack({ children }: ScrollStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const items = Array.isArray(children) ? children : [children];

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative" style={{ height: `${items.length * 100}vh` }}>
      {items.map((item, index) => {
        const start = index / items.length;
        const end = (index + 1) / items.length;
        
        const opacity = useTransform(
          scrollYProgress,
          [start - 0.1, start, end - 0.1, end],
          [0, 1, 1, 0]
        );
        
        const scale = useTransform(
          scrollYProgress,
          [start - 0.1, start, end - 0.1, end],
          [0.9, 1, 1, 0.95]
        );
        
        const y = useTransform(
          scrollYProgress,
          [start, end],
          [0, -50]
        );

        return (
          <motion.div
            key={index}
            style={{ 
              opacity, 
              scale, 
              y,
              zIndex: items.length - index
            }}
            className="sticky top-20 w-full max-w-4xl mx-auto px-4 mb-8"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-8 backdrop-blur-sm bg-white/95">
              {item}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
