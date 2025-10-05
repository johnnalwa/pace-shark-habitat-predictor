// @ts-ignore
//@ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Satellite, Fish, Activity, GraduationCap, Waves, Map, BarChart3, Database, Info, ArrowUp } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import SharkIcon from './components/SharkIcon';
import AnimatedShark from './components/AnimatedShark';
import ScrollStack, { ScrollStackItem } from './components/ScrollStack';
import { apiService } from './services/api';

interface DatasetInfo {
  data_source: string;
  date: string;
  spatial_resolution: string;
  available_fields: string[];
  coverage_area: string;
  processing_status: string;
}

interface PredictionData {
  components?: {
    [key: string]: {
      data: number[][];
      shape: number[];
      statistics: {
        min: number;
        max: number;
        mean: number;
        std: number;
      };
    };
  };
  hsi?: number[][];
  shape?: number[];
  timestamp: string;
  method: string;
  statistics?: {
    min: number;
    max: number;
    mean: number;
    std: number;
  };
}

export default function SharkHabitatDashboard() {
  const [datasetInfo, setDatasetInfo] = useState<DatasetInfo | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    loadDatasetInfo();
    
    // Handle scroll for back-to-top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadDatasetInfo = async () => {
    try {
      const info = await apiService.getDatasetInfo();
      setDatasetInfo(info);
      
      // Check if we're in demo mode
      if (info.data_source.includes('Demo Mode')) {
        setIsDemoMode(true);
        toast.success('🚀 Demo Mode: Using simulated PACE data for demonstration', {
          duration: 4000,
        });
      } else {
        setIsDemoMode(false);
      }
    } catch (error) {
      toast.error('Failed to load dataset information');
      console.error('Dataset info error:', error);
    }
  };


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: { duration: 0.2, ease: "easeInOut" }
    }
  };

  function toggleRealTimeMode(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative">
      <Toaster position="top-right" />
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 relative overflow-hidden">
        {/* Ocean Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50">
          {/* Animated wave patterns */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: `
                radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 30%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 70%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)
              `
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          {/* Subtle wave lines */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.05) 50%, transparent 100%)
              `
            }}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
        
        {/* Swimming shark across navbar */}
        <motion.div
          className="absolute top-2 z-10 pointer-events-none"
          animate={{
            x: [-100, 2000],
            y: [0, -5, 5, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <AnimatedShark size={40} variant="swimming" />
        </motion.div>

        <div className="relative z-20 bg-white/80 backdrop-blur-md border-b border-blue-200/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 ml-8">
                  <motion.div 
                    className="relative"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: [0, -5, 5, 0]
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400,
                      damping: 10
                    }}
                  >
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg border border-blue-200">
                      <AnimatedShark size={28} variant="floating" />
                    </div>
                  </motion.div>
                  <div>
                    <motion.h1 
                      className="text-xl lg:text-2xl font-bold"
                      variants={textVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.span
                        animate={{ 
                          backgroundPosition: ['0%', '100%', '0%'],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="bg-gradient-to-r from-blue-900 via-blue-600 to-blue-900 bg-clip-text text-transparent bg-300%"
                        style={{ backgroundSize: '300% 100%' }}
                      >
                        PACE Shark Habitat Prediction
                      </motion.span>
                    </motion.h1>
                    <motion.p 
                      className="text-sm text-blue-600 hidden sm:block"
                      variants={textVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.2 }}
                    >
                      <motion.span
                        animate={{
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        Satellite Data Analysis for Marine Conservation
                      </motion.span>
                    </motion.p>
                  </div>
                </div>
              </div>
            
              <div className="flex items-center space-x-6">
              {/* Navigation Links */}
              <nav className="hidden md:flex items-center space-x-4">
                <motion.a
                  href="/habitat"
                  whileHover={{ 
                    scale: 1.08,
                    y: -2,
                    backgroundColor: "rgba(59, 130, 246, 0.15)",
                    borderColor: "rgba(59, 130, 246, 0.3)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="flex items-center space-x-2 px-4 py-2 text-blue-700 hover:text-blue-900 rounded-xl font-medium relative overflow-hidden border border-transparent bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md"
                >
                  <motion.div
                    whileHover={{ 
                      rotate: [0, -8, 8, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <Fish className="w-4 h-4" />
                  </motion.div>
                  <span>Habitat</span>
                  {/* Ripple effect */}
                  <motion.div
                    className="absolute inset-0 bg-blue-400 rounded-xl opacity-0"
                    whileHover={{ 
                      opacity: [0, 0.1, 0],
                      scale: [0.8, 1.2, 1.5]
                    }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.a>
                
                <motion.a
                  href="/trophic"
                  whileHover={{ 
                    scale: 1.08,
                    y: -2,
                    backgroundColor: "rgba(34, 197, 94, 0.15)",
                    borderColor: "rgba(34, 197, 94, 0.3)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="flex items-center space-x-2 px-4 py-2 text-blue-700 hover:text-blue-900 rounded-xl font-medium relative overflow-hidden border border-transparent bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md"
                >
                  <motion.div
                    whileHover={{ 
                      rotate: [0, 180, 360],
                      scale: [1, 1.15, 1]
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <Activity className="w-4 h-4" />
                  </motion.div>
                  <span>Trophic</span>
                  <motion.div
                    className="absolute inset-0 bg-green-400 rounded-xl opacity-0"
                    whileHover={{ 
                      opacity: [0, 0.1, 0],
                      scale: [0.8, 1.2, 1.5]
                    }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.a>
                
                <motion.a
                  href="/education"
                  whileHover={{ 
                    scale: 1.08,
                    y: -2,
                    backgroundColor: "rgba(147, 51, 234, 0.15)",
                    borderColor: "rgba(147, 51, 234, 0.3)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="flex items-center space-x-2 px-4 py-2 text-blue-700 hover:text-blue-900 rounded-xl font-medium relative overflow-hidden border border-transparent bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md"
                >
                  <motion.div
                    whileHover={{ 
                      y: [0, -4, 0],
                      rotateZ: [0, 12, -12, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <GraduationCap className="w-4 h-4" />
                  </motion.div>
                  <span>Learn</span>
                  <motion.div
                    className="absolute inset-0 bg-purple-400 rounded-xl opacity-0"
                    whileHover={{ 
                      opacity: [0, 0.1, 0],
                      scale: [0.8, 1.2, 1.5]
                    }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.a>
              </nav>

              {/* Demo Mode Indicator */}
              {isDemoMode && (
                <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm border border-blue-200">
                  <Database className="w-4 h-4" />
                  <span className="hidden sm:inline">Demo Mode</span>
                </div>
              )}
              
              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center space-x-2 text-blue-600">
                <Satellite className="w-5 h-5" />
                <span className="text-sm font-medium">Menu</span>
              </div>
            </div>
            </div>
          </div>
        </div>
      </header>
      
      {datasetInfo && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" id="dataset-status">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            variants={cardVariants}
            whileHover="hover"
            className="bg-white rounded-xl p-6 border border-blue-200 shadow-sm"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center space-x-3">
                  <Satellite className="w-5 h-5 text-blue-600" />
                  <span className="text-base font-semibold text-blue-900">
                    {datasetInfo.data_source}
                  </span>
                  <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {datasetInfo.date}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-blue-700">
                  <div className="flex items-center space-x-2">
                    <Map className="w-4 h-4" />
                    <span>Resolution: {datasetInfo.spatial_resolution}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Waves className="w-4 h-4" />
                    <span className="truncate max-w-xs lg:max-w-none">Fields: {datasetInfo.available_fields.join(', ')}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-sm font-medium text-blue-700">
                  {datasetInfo.processing_status}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Navigation Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="navigation">
        <motion.div 
          className="text-center mb-8"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-bold text-blue-900 mb-4">
            Explore Shark Habitat Analysis
          </h2>
          <p className="text-blue-600 text-lg max-w-2xl mx-auto">
            Choose your area of interest to dive deeper into satellite-based marine conservation
          </p>
        </motion.div>

        <ScrollStack>
          <ScrollStackItem>
            <div className="text-center relative overflow-hidden">
              <div className="mb-6 flex justify-center">
                <AnimatedShark size={100} variant="floating" />
              </div>
              <h2 className="text-3xl font-bold text-blue-900 mb-4">Habitat Analysis</h2>
              <p className="text-blue-600 text-lg leading-relaxed mb-8">
                Interactive habitat suitability mapping using PACE satellite data. Discover optimal shark habitats through advanced oceanographic modeling and real-time environmental analysis.
              </p>
              <motion.a
                href="/habitat"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-lg"
              >
                <Fish className="w-5 h-5 mr-2" />
                <span>Explore Habitat Maps</span>
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.div>
              </motion.a>
            </div>
          </ScrollStackItem>
          
          <ScrollStackItem>
            <div className="text-center relative overflow-hidden">
              <div className="mb-6 flex justify-center">
                <AnimatedShark size={100} variant="swimming" />
              </div>
              <h2 className="text-3xl font-bold text-blue-900 mb-4">Food Web Dynamics</h2>
              <p className="text-blue-600 text-lg leading-relaxed mb-8">
                Explore trophic cascade modeling and marine ecosystem interactions. Understand how changes in phytoplankton affect the entire marine food chain over time.
              </p>
              <motion.a
                href="/trophic"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors shadow-lg"
              >
                <Activity className="w-5 h-5 mr-2" />
                <span>Model Trophic Cascades</span>
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.div>
              </motion.a>
            </div>
          </ScrollStackItem>
          
          <ScrollStackItem>
            <div className="text-center relative overflow-hidden">
              <div className="mb-6 flex justify-center">
                <AnimatedShark size={100} variant="gliding" />
              </div>
              <h2 className="text-3xl font-bold text-blue-900 mb-4">Learning Center</h2>
              <p className="text-blue-600 text-lg leading-relaxed mb-8">
                Educational resources on satellite remote sensing and marine conservation. Interactive lessons designed for high school students and marine science enthusiasts.
              </p>
              <motion.a
                href="/education"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors shadow-lg"
              >
                <GraduationCap className="w-5 h-5 mr-2" />
                <span>Start Learning</span>
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.div>
              </motion.a>
            </div>
          </ScrollStackItem>
        </ScrollStack>
      </div>

      {/* Welcome Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" id="main-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 text-white text-center"
        >
          <motion.div
            className="mb-8 flex justify-center"
          >
            <AnimatedShark size={120} variant="hero" className="mx-auto" />
          </motion.div>
          
          <h2 className="text-4xl font-bold mb-6">
            NASA PACE Satellite Data for Shark Conservation
          </h2>
          
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover how satellite technology helps scientists track and protect shark populations 
            through advanced habitat modeling and marine ecosystem analysis.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-200">30 Days</div>
              <div className="text-blue-100">Trophic Cascade Delay</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-200">Real-time</div>
              <div className="text-blue-100">Satellite Data Processing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-200">Global</div>
              <div className="text-blue-100">Ocean Coverage</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-20 right-6 z-50 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}

      {/* Footer with Navigation */}
      <footer className="bg-gradient-to-b from-blue-900 to-blue-950 border-t border-blue-200 mt-12 relative overflow-hidden" id="footer">
        {/* Animated background sharks */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-4 left-10"
            animate={{
              x: [0, 100, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <AnimatedShark size={60} variant="swimming" />
          </motion.div>
          <motion.div
            className="absolute bottom-4 right-10"
            animate={{
              x: [0, -80, 0],
              y: [0, 15, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
          >
            <AnimatedShark size={50} variant="gliding" />
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Simple Navigation Links */}
          <div className="mb-8 text-center">
            <div className="flex flex-wrap justify-center gap-6 text-blue-200">
              <motion.button
                onClick={() => scrollToSection('dataset-status')}
                whileHover={{ scale: 1.05, color: "#ffffff" }}
                className="text-sm font-medium hover:text-white transition-colors cursor-pointer"
              >
                Dataset Info
              </motion.button>
              <motion.button
                onClick={() => scrollToSection('navigation')}
                whileHover={{ scale: 1.05, color: "#ffffff" }}
                className="text-sm font-medium hover:text-white transition-colors cursor-pointer"
              >
                Navigation
              </motion.button>
              <motion.button
                onClick={() => scrollToSection('main-content')}
                whileHover={{ scale: 1.05, color: "#ffffff" }}
                className="text-sm font-medium hover:text-white transition-colors cursor-pointer"
              >
                Analysis
              </motion.button>
              <motion.button
                onClick={() => scrollToSection('footer')}
                whileHover={{ scale: 1.05, color: "#ffffff" }}
                className="text-sm font-medium hover:text-white transition-colors cursor-pointer"
              >
                About
              </motion.button>
            </div>
          </div>

          <div className="text-center space-y-8">
            <motion.div 
              className="flex items-center justify-center space-x-6"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="p-4 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-2xl">
                  <AnimatedShark size={48} variant="hero" />
                </div>
                {/* Pulsing glow effect */}
                <motion.div
                  className="absolute inset-0 bg-blue-400 rounded-2xl opacity-30 blur-xl"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
              <div className="text-white space-y-2">
                <motion.h3 
                  className="text-xl font-bold"
                  animate={{
                    backgroundPosition: ['0%', '100%', '0%'],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    background: 'linear-gradient(90deg, #ffffff, #60a5fa, #06b6d4, #ffffff)',
                    backgroundSize: '300% 100%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  🚀 NASA Space Apps Challenge 2025 🛰️
                </motion.h3>
                <motion.p 
                  className="text-blue-200 text-sm"
                  animate={{
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  PACE Satellite Data for Shark Conservation
                </motion.p>
              </div>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-blue-200"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                className="space-y-3"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Satellite className="w-5 h-5" />
                  </motion.div>
                  <h4 className="font-semibold text-white">Technology</h4>
                </div>
                <ul className="space-y-1">
                  <li>PACE Ocean Color Instrument</li>
                  <li>Mathematical Habitat Modeling</li>
                  <li>Real-time Data Processing</li>
                </ul>
              </motion.div>
              
              <motion.div 
                className="space-y-3"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <motion.div
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Waves className="w-5 h-5" />
                  </motion.div>
                  <h4 className="font-semibold text-white">Science</h4>
                </div>
                <ul className="space-y-1">
                  <li>Trophic Cascade Analysis</li>
                  <li>Habitat Suitability Mapping</li>
                  <li>Marine Ecosystem Modeling</li>
                </ul>
              </motion.div>
              
              <motion.div 
                className="space-y-3"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <GraduationCap className="w-5 h-5" />
                  </motion.div>
                  <h4 className="font-semibold text-white">Education</h4>
                </div>
                <ul className="space-y-1">
                  <li>STEM Learning Resources</li>
                  <li>Interactive Visualizations</li>
                  <li>Conservation Awareness</li>
                </ul>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="pt-6 border-t border-blue-700"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <motion.p 
                className="text-sm text-blue-300"
                animate={{
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Advancing marine conservation through satellite technology and education
              </motion.p>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
}
