'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Play, Pause, RotateCcw, Info, Sliders } from 'lucide-react';
import { useTrophicData } from '../hooks/useTrophicData';
import toast from 'react-hot-toast';

export default function TrophicCascade() {
  const { 
    trophicData, 
    isSimulating, 
    simulationSpeed,
    updatePhytoplankton, 
    simulateCascade, 
    resetSimulation,
    setSimulationSpeed 
  } = useTrophicData();
  
  const [animationDay, setAnimationDay] = useState(0);
  const [showExplanation, setShowExplanation] = useState(true);
  const [phytoplanktonSlider, setPhytoplanktonSlider] = useState(0);

  const handlePhytoplanktonChange = (value: number) => {
    setPhytoplanktonSlider(value);
    updatePhytoplankton(value);
  };

  const handleSimulation = () => {
    if (isSimulating) {
      resetSimulation();
    } else {
      simulateCascade();
      toast.success('Trophic cascade simulation started!');
    }
  };

  // Prepare chart data from trophic levels
  const chartData = trophicData ? 
    trophicData.levels.map((level, index) => ({
      name: level.name,
      biomass: level.biomass,
      energy: level.energy,
      color: level.color,
      icon: level.icon
    })) : [];

  // Use trophic levels from our hook data
  const trophicLevels = trophicData ? trophicData.levels : [];

  if (!trophicData) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Initializing trophic cascade model...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Ocean Food Web Animation
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Watch how satellite data connects to shark populations through the food web
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              <Info className="w-5 h-5" />
            </button>
            <button
              onClick={resetSimulation}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={handleSimulation}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isSimulating
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isSimulating ? 'Stop' : 'Start'} Simulation</span>
            </button>
          </div>
        </div>

        {/* Phytoplankton Control */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3 mb-3">
            <Sliders className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium text-blue-900">Phytoplankton Change</h4>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-blue-700 w-16">-50%</span>
            <input
              type="range"
              min="-50"
              max="50"
              value={phytoplanktonSlider}
              onChange={(e) => handlePhytoplanktonChange(Number(e.target.value))}
              className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-blue-700 w-16">+50%</span>
          </div>
          <div className="text-center mt-2">
            <span className="text-lg font-semibold text-blue-900">
              {phytoplanktonSlider > 0 ? '+' : ''}{phytoplanktonSlider}%
            </span>
          </div>
        </div>
      </div>

      {/* Explanation Panel */}
      {showExplanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6"
        >
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
            How Satellites Connect to Sharks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trophicLevels.map((level, index) => (
              <div key={level.name} className="text-center relative">
                <div className="text-4xl mb-2">{level.icon}</div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  {level.name}
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                  {level.name === 'Phytoplankton' ? 'Tiny ocean plants detected by satellites' :
                   level.name === 'Zooplankton' ? 'Small animals that eat phytoplankton' :
                   level.name === 'Small Fish' ? 'Fish that feed on zooplankton' :
                   'Top predators we want to track'}
                </p>
                <div className="text-xs text-blue-600 dark:text-blue-300 font-medium">
                  Response delay: {index * 7} days
                </div>
                {index < trophicLevels.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                    <div className="text-blue-400 text-2xl">→</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Chart */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Population Dynamics Over Time
        </h3>
        
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                label={{ value: 'Trophic Level', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                label={{ value: 'Biomass Index', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  typeof value === 'number' ? value.toFixed(1) : value,
                  name
                ]}
              />
              <Legend />
              
              <Line
                type="monotone"
                dataKey="biomass"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                name="Biomass"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Current Values Display */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {trophicLevels.map((level) => (
            <div key={level.name} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">{level.icon}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {level.name}
              </div>
              <div className="text-lg font-semibold" style={{ color: level.color }}>
                {level.biomass.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">
                Energy: {level.energy.toFixed(0)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Educational Note */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">💡</div>
          <div>
            <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
              Key Insight
            </h4>
            <p className="text-green-800 dark:text-green-200">
              Changes in phytoplankton (detected by satellites) cascade through the marine food web, 
              affecting shark populations after approximately {trophicData?.timeDelay || 30} days. 
              This delay is crucial for understanding how satellite data connects to shark conservation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
