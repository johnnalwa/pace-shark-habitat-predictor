'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Map, Layers, Info, Download, BarChart3 } from 'lucide-react';

interface HabitatMapProps {
  predictionData: any;
  loading: boolean;
}

export default function HabitatMap({ predictionData, loading }: HabitatMapProps) {
  const [selectedLayer, setSelectedLayer] = useState('Advanced_HSI');
  const [showInfo, setShowInfo] = useState(false);

  // Get available layers from prediction data
  const availableLayers = useMemo(() => {
    if (!predictionData?.components) return [];
    return Object.keys(predictionData.components);
  }, [predictionData]);

  // Get current layer data
  const currentLayerData = useMemo(() => {
    if (!predictionData?.components?.[selectedLayer]) return null;
    return predictionData.components[selectedLayer];
  }, [predictionData, selectedLayer]);

  // Convert 2D array to heatmap visualization
  const renderHeatmap = (data: number[][], statistics: any) => {
    if (!data || !data.length) return null;

    const rows = Math.min(data.length, 100); // Limit for performance
    const cols = Math.min(data[0].length, 100);
    const { min, max } = statistics;

    // Sample data for performance
    const sampledData = data.slice(0, rows).map(row => row.slice(0, cols));

    return (
      <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
        <div className="grid gap-0 w-full h-full" style={{ 
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`
        }}>
          {sampledData.map((row, i) =>
            row.map((value, j) => {
              // Normalize value to 0-1 range
              const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));
              
              // Create color based on value (blue = low, red = high)
              const red = Math.round(255 * normalized);
              const blue = Math.round(255 * (1 - normalized));
              const opacity = 0.7 + 0.3 * normalized;
              
              return (
                <div
                  key={`${i}-${j}`}
                  className="w-full h-full"
                  style={{
                    backgroundColor: `rgb(${red}, 0, ${blue})`,
                    opacity: opacity
                  }}
                  title={`Value: ${value.toFixed(3)}`}
                />
              );
            })
          )}
        </div>
        
        {/* Color scale legend */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
          <div className="text-xs font-medium mb-2">Habitat Suitability</div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-xs">Low</span>
            <div className="w-8 h-2 bg-gradient-to-r from-blue-500 to-red-500 rounded"></div>
            <span className="text-xs">High</span>
            <div className="w-4 h-4 bg-red-500 rounded"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Map className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-blue-900">
              Habitat Suitability Map
            </h3>
            <p className="text-sm text-blue-600">
              Satellite-derived habitat analysis
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 rounded-lg transition-all duration-200 border border-blue-200"
          >
            <Info className="w-5 h-5" />
          </button>
          <button className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 rounded-lg transition-all duration-200 border border-blue-200">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Layer Selection */}
      {availableLayers.length > 0 && (
        <div className="flex items-center space-x-3 bg-blue-50 rounded-lg px-4 py-3 mb-6 border border-blue-200">
          <Layers className="w-4 h-4 text-blue-600" />
          <select
            value={selectedLayer}
            onChange={(e) => setSelectedLayer(e.target.value)}
            className="text-sm border border-blue-200 rounded-md px-3 py-2 bg-white text-blue-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {availableLayers.map((layer) => (
              <option key={layer} value={layer}>
                {layer.replace(/_/g, ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="h-96 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-200">
          <div className="text-center text-blue-600">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
            />
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <p className="text-sm font-medium">
                Processing satellite data...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Map Content */}
      {!loading && (
        <div>
          {currentLayerData ? (
          <div>
            {renderHeatmap(currentLayerData.data, currentLayerData.statistics)}
            
            {/* Statistics Panel */}
            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(currentLayerData.statistics).map(([key, value]) => (
                <div key={key} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-xs text-blue-600 uppercase tracking-wide font-medium mb-1">
                    {key}
                  </div>
                  <div className="text-lg font-bold text-blue-900">
                    {typeof value === 'number' ? value.toFixed(3) : String(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-96 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-200">
            <div className="text-center text-blue-600">
              <Map className="w-16 h-16 mx-auto mb-4 opacity-60" />
              <p className="text-lg font-semibold mb-2">No Data Available</p>
              <p className="text-sm opacity-80">
                Click "Run Analysis" to generate habitat suitability maps
              </p>
            </div>
          </div>
        )}
        </div>
      )}

      {/* Info Panel */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Info className="w-5 h-5 text-blue-600" />
            <h4 className="font-bold text-blue-900">
              Understanding Habitat Predictions
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-700">
            <div className="space-y-3">
              <h5 className="font-semibold text-blue-900 flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Color Scale</span>
              </h5>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>High habitat suitability</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Low habitat suitability</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h5 className="font-semibold text-blue-900 flex items-center space-x-2">
                <Layers className="w-4 h-4" />
                <span>Data Sources</span>
              </h5>
              <ul className="space-y-2">
                <li>PACE satellite chlorophyll measurements</li>
                <li>Trophic cascade modeling with time delays</li>
                <li>Physical oceanographic features</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
