'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Activity } from 'lucide-react';
import Link from 'next/link';
import TrophicCascade from '../components/TrophicCascade';
import AdvancedMathModels from '../components/AdvancedMathModels';
import SharkIcon from '../components/SharkIcon';
import { Toaster } from 'react-hot-toast';

export default function TrophicPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-blue-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
              
              <div className="flex items-center space-x-3 ml-8">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-blue-900">
                    Food Web Dynamics
                  </h1>
                  <p className="text-blue-600">
                    Interactive trophic cascade modeling
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <SharkIcon size={32} className="text-blue-600" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AdvancedMathModels />
        </motion.div>
        
        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 bg-white rounded-xl p-8 border border-blue-200 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Understanding Trophic Cascades
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                What are Trophic Cascades?
              </h3>
              <p className="text-blue-700 leading-relaxed mb-4">
                Trophic cascades are powerful indirect effects that occur when predators 
                suppress the abundance or alter the behavior of their prey, thereby 
                releasing the next lower trophic level from predation pressure.
              </p>
              <p className="text-blue-700 leading-relaxed">
                In marine ecosystems, changes in phytoplankton (detected by satellites) 
                cascade up through zooplankton, small fish, and eventually affect 
                shark populations.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                Time Delays in Marine Systems
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-blue-700">
                    <strong>Phytoplankton:</strong> Immediate response (0 days)
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-700">
                    <strong>Zooplankton:</strong> 7-day response delay
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-blue-700">
                    <strong>Small Fish:</strong> 14-day response delay
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-blue-700">
                    <strong>Sharks:</strong> 21-day response delay
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              🛰️ Satellite Connection
            </h3>
            <p className="text-blue-700 leading-relaxed">
              NASA's PACE satellite can detect changes in ocean color that indicate 
              phytoplankton abundance. By understanding trophic cascade delays, 
              scientists can predict how these changes will affect shark populations 
              weeks in advance, enabling better conservation strategies.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
