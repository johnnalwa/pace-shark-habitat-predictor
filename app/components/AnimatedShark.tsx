'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface AnimatedSharkProps {
  size?: number;
  className?: string;
  variant?: 'hero' | 'floating' | 'swimming' | 'gliding';
}

export default function AnimatedShark({ 
  size = 200, 
  className = '', 
  variant = 'swimming' 
}: AnimatedSharkProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      });
    };

    if (variant === 'hero') {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [variant]);

  const getAnimationVariants = () => {
    switch (variant) {
      case 'hero':
        return {
          initial: { 
            opacity: 0, 
            scale: 0.5, 
            rotateY: -30,
            z: -100
          },
          animate: { 
            opacity: 1, 
            scale: 1, 
            rotateY: 0,
            z: 0,
            x: mousePosition.x,
            y: mousePosition.y,
          },
          transition: {
            duration: 2,
            ease: "easeOut",
            x: { type: "spring", stiffness: 100, damping: 30 },
            y: { type: "spring", stiffness: 100, damping: 30 },
          }
        };

      case 'floating':
        return {
          animate: {
            y: [-6, 6, -6],
            rotateZ: [-1, 1, -1],
            scale: [1, 1.02, 1],
          },
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }
        };

      case 'swimming':
        return {
          animate: {
            x: [-15, 15, -15],
            y: [-3, 3, -3],
            rotateY: [-3, 3, -3],
            rotateZ: [-0.5, 0.5, -0.5],
          },
          transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }
        };

      case 'gliding':
        return {
          animate: {
            x: [0, 60, 0],
            y: [0, -12, 0],
            rotateZ: [0, -6, 0],
          },
          transition: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }
        };

      default:
        return {};
    }
  };

  const variants = getAnimationVariants();

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Animated bubbles - reduced for performance */}
      {variant !== 'hero' && variant !== 'floating' && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-blue-300 rounded-full opacity-50"
              animate={{
                x: [-30 - i * 8, -60 - i * 12],
                y: [Math.random() * 15 - 7, Math.random() * 15 - 7],
                opacity: [0.5, 0.1, 0],
                scale: [1, 0.3, 0],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeOut",
              }}
              style={{
                left: `${25 + i * 8}%`,
                top: `${50 + Math.sin(i) * 8}%`,
              }}
            />
          ))}
        </>
      )}

      {/* Water ripple effect */}
      {variant === 'hero' && (
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-blue-300 opacity-30"
          animate={{
            scale: [1, 1.5, 2],
            opacity: [0.3, 0.1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      )}

      {/* Main shark image */}
      <motion.div
        className="relative w-full h-full"
        {...variants}
        whileHover={variant === 'hero' ? {
          scale: 1.1,
          rotateY: 10,
          transition: { duration: 0.3 }
        } : {}}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20 blur-xl"
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Shark image */}
        <motion.div
          className="relative z-10"
          animate={variant === 'swimming' ? {
            rotateY: [0, 5, 0, -5, 0],
          } : {}}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src="/shark1.png"
            alt="Realistic Shark"
            width={size}
            height={size}
            className="object-contain drop-shadow-2xl"
            style={{
              filter: 'drop-shadow(0 10px 20px rgba(59, 130, 246, 0.3))',
            }}
          />
        </motion.div>

        {/* Animated fins effect */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-4 h-4 bg-blue-400 rounded-full opacity-40"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        {/* Swimming trail effect */}
        {variant === 'swimming' && (
          <motion.div
            className="absolute left-0 top-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-30"
            animate={{
              scaleX: [0, 1, 0],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>

      {/* Particle effects for hero variant */}
      {variant === 'hero' && (
        <>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              animate={{
                x: [0, Math.cos(i * 30) * 100],
                y: [0, Math.sin(i * 30) * 100],
                opacity: [1, 0],
                scale: [1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut",
              }}
              style={{
                left: '50%',
                top: '50%',
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
