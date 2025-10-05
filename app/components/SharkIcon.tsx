'use client';

import { motion } from 'framer-motion';

interface SharkIconProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export default function SharkIcon({ size = 32, className = '', animated = false }: SharkIconProps) {
  return (
    <motion.div
      className={`inline-block ${className}`}
      animate={animated ? {
        x: [0, 5, -5, 0],
        y: [0, -2, 2, 0]
      } : {}}
      transition={{
        duration: 4,
        repeat: animated ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shark body - more realistic shape */}
        <motion.path
          d="M15 30 C15 20, 25 15, 40 18 C55 20, 70 22, 85 25 C95 27, 100 30, 100 30 C100 30, 95 33, 85 35 C70 38, 55 40, 40 42 C25 45, 15 40, 15 30 Z"
          fill="currentColor"
          opacity="0.95"
        />
        
        {/* Shark belly - lighter shade */}
        <motion.path
          d="M20 30 C20 35, 30 38, 45 40 C60 42, 75 40, 85 35 C75 37, 60 38, 45 38 C30 38, 20 35, 20 30 Z"
          fill="currentColor"
          opacity="0.7"
        />
        
        {/* Dorsal fin - more realistic */}
        <motion.path
          d="M50 25 C52 15, 58 12, 62 15 C65 18, 68 22, 65 25 C62 28, 55 27, 50 25 Z"
          fill="currentColor"
          opacity="0.95"
        />
        
        {/* Pectoral fins */}
        <motion.path
          d="M35 32 C30 35, 25 38, 22 35 C20 32, 25 28, 35 32 Z"
          fill="currentColor"
          opacity="0.8"
        />
        
        {/* Tail fin - more realistic */}
        <motion.path
          d="M100 30 C105 25, 110 20, 115 25 C118 28, 115 32, 110 35 C105 38, 102 35, 100 30 Z"
          fill="currentColor"
          opacity="0.9"
        />
        
        {/* Lower tail fin */}
        <motion.path
          d="M100 30 C105 35, 108 38, 112 35 C115 32, 110 30, 100 30 Z"
          fill="currentColor"
          opacity="0.7"
        />
        
        {/* Gills - more realistic curved lines */}
        <motion.g opacity="0.4">
          <path d="M45 28 C44 29, 43 30, 42 32" stroke="currentColor" strokeWidth="0.8" fill="none"/>
          <path d="M48 28 C47 29, 46 30, 45 32" stroke="currentColor" strokeWidth="0.8" fill="none"/>
          <path d="M51 28 C50 29, 49 30, 48 32" stroke="currentColor" strokeWidth="0.8" fill="none"/>
          <path d="M54 28 C53 29, 52 30, 51 32" stroke="currentColor" strokeWidth="0.8" fill="none"/>
          <path d="M57 28 C56 29, 55 30, 54 32" stroke="currentColor" strokeWidth="0.8" fill="none"/>
        </motion.g>
        
        {/* Eye - more realistic */}
        <motion.ellipse
          cx="32"
          cy="26"
          rx="3"
          ry="2.5"
          fill="white"
          opacity="0.9"
        />
        <motion.ellipse
          cx="33"
          cy="26"
          rx="1.5"
          ry="1.2"
          fill="black"
        />
        <motion.ellipse
          cx="33.5"
          cy="25.5"
          rx="0.5"
          ry="0.4"
          fill="white"
          opacity="0.8"
        />
        
        {/* Mouth line */}
        <motion.path
          d="M20 32 C25 34, 30 35, 35 34"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
          opacity="0.7"
        />
        
        {/* Nostril */}
        <motion.circle
          cx="25"
          cy="28"
          r="0.8"
          fill="currentColor"
          opacity="0.5"
        />
        
        {/* Subtle body shading */}
        <motion.path
          d="M25 25 C35 24, 50 25, 70 27 C75 28, 80 29, 85 30"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          opacity="0.2"
        />
        
        {animated && (
          <>
            {/* Swimming bubbles */}
            <motion.circle
              cx="10"
              cy="25"
              r="1"
              fill="currentColor"
              opacity="0.3"
              animate={{
                x: [0, -20, -40],
                y: [0, -5, -10],
                opacity: [0.3, 0.1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: 0
              }}
            />
            <motion.circle
              cx="8"
              cy="35"
              r="0.8"
              fill="currentColor"
              opacity="0.2"
              animate={{
                x: [0, -15, -30],
                y: [0, 3, 5],
                opacity: [0.2, 0.1, 0]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: 1
              }}
            />
          </>
        )}
      </svg>
    </motion.div>
  );
}
