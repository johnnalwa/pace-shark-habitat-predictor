'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Fish, Activity, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import HabitatMap from '../components/HabitatMap';
import SharkTagSimulator from '../components/SharkTagSimulator';
import SharkIcon from '../components/SharkIcon';
import { apiService } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

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
  timestamp: string;
  method: string;
}

export default function HabitatPage() {
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPredictionData();
  }, []);

  const loadPredictionData = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAdvancedPrediction();
      setPredictionData(data);
      toast.success('Habitat data loaded successfully!');
    } catch (error) {
      toast.error('Failed to load habitat data');
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  const runPrediction = async (advanced = true) => {
    setLoading(true);
    try {
      const data = advanced 
        ? await apiService.getAdvancedPrediction()
        : await apiService.getBasicPrediction();
      
      setPredictionData(data);
      toast.success(`${advanced ? 'Advanced' : 'Basic'} prediction completed!`);
    } catch (error) {
      toast.error('Prediction failed');
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

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
                <span>Home</span>
              </Link>
              
              <div className="flex items-center space-x-3 ml-8">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <SharkIcon size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-blue-900">
                    Habitat Suitability Analysis
                  </h1>
                  <p className="text-blue-600">
                    PACE satellite data for shark habitat prediction
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Navigation Links */}
              <nav className="hidden md:flex items-center space-x-4">
                <Link
                  href="/trophic"
                  className="flex items-center space-x-2 px-3 py-2 text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                >
                  <Activity className="w-4 h-4" />
                  <span>Trophic</span>
                </Link>
                
                <Link
                  href="/education"
                  className="flex items-center space-x-2 px-3 py-2 text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Learn</span>
                </Link>
              </nav>
            
              <button
                onClick={() => runPrediction(true)}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <Fish className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} />
                <span>{loading ? 'Analyzing...' : 'Run Analysis'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <HabitatMap predictionData={predictionData} loading={loading} />
            </motion.div>
          </div>
          
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <SharkTagSimulator />
            </motion.div>
            
            {/* Info Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl p-6 border border-blue-200 shadow-sm"
            >
              <h3 className="text-lg font-bold text-blue-900 mb-4">
                About This Analysis
              </h3>
              <div className="space-y-4 text-sm text-blue-700">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Data Sources</h4>
                  <ul className="space-y-1">
                    <li>• PACE Ocean Color Instrument</li>
                    <li>• Chlorophyll-a concentrations</li>
                    <li>• Sea surface temperature</li>
                    <li>• Bathymetry data</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Analysis Method</h4>
                  <p>
                    Advanced Habitat Suitability Index (HSI) modeling combines 
                    multiple environmental variables to predict optimal shark habitats.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Time Delay</h4>
                  <p>
                    Trophic cascade effects take approximately 30 days to propagate 
                    from phytoplankton changes to shark populations.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
