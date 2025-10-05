'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio, Activity, MapPin, Clock, Play, Pause } from 'lucide-react';
import { apiService, SharkTagSimulation } from '../services/api';
import toast from 'react-hot-toast';

export default function SharkTagSimulator() {
  const [simulation, setSimulation] = useState<SharkTagSimulation | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(4.0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && simulation) {
      const totalSteps = simulation.simulation_results.behavioral_states?.length || 100;
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalSteps - 1) {
            setIsRunning(false);
            return totalSteps - 1;
          }
          return prev + 1;
        });
      }, 100); // 100ms per step
    }
    return () => clearInterval(interval);
  }, [isRunning, simulation]);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const data = await apiService.simulateSharkTag(duration);
      setSimulation(data);
      setCurrentTime(0);
      toast.success('Shark tag simulation completed!');
    } catch (error) {
      toast.error('Failed to run shark tag simulation');
      console.error('Simulation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSimulation = () => {
    if (!simulation) {
      runSimulation();
      return;
    }
    
    if (!isRunning) {
      setCurrentTime(0);
    }
    setIsRunning(!isRunning);
  };

  // Get current behavioral state
  const getCurrentBehavior = () => {
    if (!simulation?.simulation_results.behavioral_states) return 'unknown';
    const states = ['resting', 'traveling', 'hunting', 'feeding'];
    const stateIndex = simulation.simulation_results.behavioral_states[currentTime] || 0;
    return states[stateIndex] || 'unknown';
  };

  // Get current sensor values
  const getCurrentSensorData = () => {
    if (!simulation) return { accelerometer: 0, depth: 0 };
    
    return {
      accelerometer: simulation.simulation_results.accelerometer_data?.[currentTime] || 0,
      depth: simulation.simulation_results.depth_data?.[currentTime] || 0,
    };
  };

  // Get feeding events up to current time
  const getCurrentFeedingEvents = () => {
    if (!simulation?.simulation_results.feeding_events) return [];
    
    const currentTimeHours = (currentTime / 100) * duration; // Convert to hours
    return simulation.simulation_results.feeding_events.filter(
      event => event.timestamp <= currentTimeHours
    );
  };

  const behaviorColors = {
    resting: 'bg-blue-500',
    traveling: 'bg-green-500', 
    hunting: 'bg-yellow-500',
    feeding: 'bg-red-500',
    unknown: 'bg-gray-500'
  };

  const behaviorIcons = {
    resting: '😴',
    traveling: '🏊',
    hunting: '👁️',
    feeding: '🍽️',
    unknown: '❓'
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <Radio className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Real-time Shark Tag
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Simulated feeding detection
            </p>
          </div>
        </div>
        
        <motion.div
          animate={{ scale: isRunning ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
          className={`w-3 h-3 rounded-full ${isRunning ? 'bg-red-500' : 'bg-gray-400'}`}
        />
      </div>

      {/* Controls */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Simulation Duration (hours)
            </label>
            <input
              type="range"
              min="1"
              max="12"
              step="0.5"
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value))}
              disabled={loading || isRunning}
              className="w-full"
            />
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {duration} hours
            </div>
          </div>
          
          <button
            onClick={toggleSimulation}
            disabled={loading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isRunning
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400'
            }`}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
            ) : isRunning ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>
              {loading ? 'Loading...' : isRunning ? 'Pause' : simulation ? 'Replay' : 'Start'}
            </span>
          </button>
        </div>

        {/* Progress */}
        {simulation && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Time: {((currentTime / 100) * duration).toFixed(1)}h</span>
              <span>{duration}h total</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentTime / (simulation.simulation_results.behavioral_states?.length || 100)) * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Current Status */}
      {simulation && (
        <div className="space-y-4">
          {/* Behavior Status */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Behavior
              </span>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${behaviorColors[getCurrentBehavior() as keyof typeof behaviorColors]}`} />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {getCurrentBehavior()}
                </span>
              </div>
            </div>
            <div className="text-2xl text-center">
              {behaviorIcons[getCurrentBehavior() as keyof typeof behaviorIcons]}
            </div>
          </div>

          {/* Sensor Data */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Acceleration
                </span>
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {getCurrentSensorData().accelerometer.toFixed(2)} g
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Depth
                </span>
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {getCurrentSensorData().depth.toFixed(1)} m
              </div>
            </div>
          </div>

          {/* Feeding Events */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Feeding Events Detected
              </span>
            </div>
            
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
              {getCurrentFeedingEvents().length}
            </div>
            
            {getCurrentFeedingEvents().length > 0 && (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {getCurrentFeedingEvents().slice(-3).map((event, index) => (
                  <div key={index} className="text-xs bg-white dark:bg-gray-600 rounded p-2">
                    <div className="flex justify-between">
                      <span>Time: {event.timestamp.toFixed(1)}h</span>
                      <span>Duration: {event.duration.toFixed(1)}s</span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      Intensity: {event.intensity.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Educational Note */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <div className="text-lg">🏷️</div>
              <div>
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                  How Real Shark Tags Work
                </h4>
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  Real shark tags use accelerometers to detect feeding events by measuring jaw movements and body acceleration patterns. This data helps scientists understand shark behavior and validate habitat predictions!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Simulation State */}
      {!simulation && !loading && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Radio className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">Shark Tag Ready</p>
          <p className="text-sm">
            Click "Start" to simulate real-time shark tag data
          </p>
        </div>
      )}
    </div>
  );
}
