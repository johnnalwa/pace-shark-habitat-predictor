import { useState, useEffect, useCallback } from 'react';

export interface TrophicLevel {
  name: string;
  biomass: number;
  energy: number;
  color: string;
  icon: string;
}

export interface TrophicCascadeData {
  levels: TrophicLevel[];
  timeDelay: number;
  phytoplanktonChange: number;
  timestamp: string;
}

export const useTrophicData = () => {
  const [trophicData, setTrophicData] = useState<TrophicCascadeData>({
    levels: [
      { name: 'Phytoplankton', biomass: 100, energy: 1000, color: '#10B981', icon: '🦠' },
      { name: 'Zooplankton', biomass: 80, energy: 800, color: '#3B82F6', icon: '🦐' },
      { name: 'Small Fish', biomass: 60, energy: 600, color: '#8B5CF6', icon: '🐟' },
      { name: 'Large Fish', biomass: 40, energy: 400, color: '#F59E0B', icon: '🐠' },
      { name: 'Sharks', biomass: 20, energy: 200, color: '#EF4444', icon: '🦈' },
    ],
    timeDelay: 30,
    phytoplanktonChange: 0,
    timestamp: new Date().toISOString()
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);

  const updatePhytoplankton = useCallback((change: number) => {
    setTrophicData(prev => ({
      ...prev,
      phytoplanktonChange: change,
      timestamp: new Date().toISOString()
    }));
  }, []);

  const simulateCascade = useCallback(() => {
    if (isSimulating) return;
    
    setIsSimulating(true);
    const baseChange = trophicData.phytoplanktonChange;
    
    // Simulate cascade effect over time
    const cascadeSteps = 5;
    let step = 0;
    
    const interval = setInterval(() => {
      step++;
      const progress = step / cascadeSteps;
      
      setTrophicData(prev => ({
        ...prev,
        levels: prev.levels.map((level, index) => {
          const delay = index * 0.2; // Staggered effect
          const effectiveProgress = Math.max(0, progress - delay);
          const impact = baseChange * effectiveProgress * (0.8 ** index); // Diminishing effect
          
          return {
            ...level,
            biomass: Math.max(10, Math.min(150, 100 + impact)),
            energy: Math.max(100, Math.min(1500, 1000 + impact * 10))
          };
        }),
        timestamp: new Date().toISOString()
      }));
      
      if (step >= cascadeSteps + 2) {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 1000 / simulationSpeed);
    
    return () => clearInterval(interval);
  }, [trophicData.phytoplanktonChange, isSimulating, simulationSpeed]);

  const resetSimulation = useCallback(() => {
    setTrophicData(prev => ({
      ...prev,
      levels: prev.levels.map(level => ({
        ...level,
        biomass: 100,
        energy: 1000
      })),
      phytoplanktonChange: 0,
      timestamp: new Date().toISOString()
    }));
    setIsSimulating(false);
  }, []);

  return {
    trophicData,
    isSimulating,
    simulationSpeed,
    updatePhytoplankton,
    simulateCascade,
    resetSimulation,
    setSimulationSpeed
  };
};
