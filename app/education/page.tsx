'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import EducationalPanel from '../components/EducationalPanel';
import SharkIcon from '../components/SharkIcon';
import { Toaster } from 'react-hot-toast';

export default function EducationPage() {
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
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-blue-900">
                    Marine Science Learning Center
                  </h1>
                  <p className="text-blue-600">
                    Educational resources for satellite oceanography
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

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-blue-900 mb-6">
            Discover How Satellites Help Protect Sharks
          </h2>
          <p className="text-xl text-blue-600 max-w-3xl mx-auto leading-relaxed">
            Learn about cutting-edge satellite technology, marine ecosystems, 
            and the science behind shark conservation through interactive lessons and activities.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          {[
            { number: '100+', label: 'Species Tracked', icon: '🦈' },
            { number: '24/7', label: 'Satellite Monitoring', icon: '🛰️' },
            { number: '30 Days', label: 'Prediction Window', icon: '📅' },
            { number: '90%', label: 'Accuracy Rate', icon: '🎯' }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center border border-blue-200 shadow-sm">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-blue-900 mb-1">{stat.number}</div>
              <div className="text-blue-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Main Educational Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <EducationalPanel />
        </motion.div>
        
        {/* Additional Learning Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="bg-white rounded-xl p-8 border border-blue-200 shadow-sm">
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              🌊 Ocean Science Basics
            </h3>
            <div className="space-y-4 text-blue-700">
              <div>
                <h4 className="font-semibold mb-2">What is Remote Sensing?</h4>
                <p className="text-sm leading-relaxed">
                  Remote sensing uses satellites to collect information about Earth's 
                  oceans without direct contact. Satellites measure light reflected 
                  from the ocean surface to determine water properties.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Ocean Color Science</h4>
                <p className="text-sm leading-relaxed">
                  Different ocean colors indicate different types and amounts of 
                  microscopic marine life. Green water often means lots of 
                  phytoplankton, while blue water is typically nutrient-poor.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-8 border border-blue-200 shadow-sm">
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              🦈 Shark Conservation
            </h3>
            <div className="space-y-4 text-blue-700">
              <div>
                <h4 className="font-semibold mb-2">Why Sharks Matter</h4>
                <p className="text-sm leading-relaxed">
                  Sharks are apex predators that help maintain healthy ocean 
                  ecosystems. They control fish populations and keep marine 
                  food webs in balance.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Conservation Challenges</h4>
                <p className="text-sm leading-relaxed">
                  Shark populations face threats from overfishing, habitat loss, 
                  and climate change. Satellite technology helps scientists 
                  track sharks and protect their habitats.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">
            Ready to Become a Marine Conservation Scientist?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Explore our interactive tools to see how satellite data connects to shark 
            populations and learn about the cutting-edge science protecting our oceans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/habitat"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Explore Habitat Analysis
            </Link>
            <Link
              href="/trophic"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-400 transition-colors border border-blue-400"
            >
              Try Trophic Modeling
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
