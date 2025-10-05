'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Satellite, Fish, Activity, Heart, ChevronRight, ChevronDown } from 'lucide-react';
import { apiService, EducationalContent } from '../services/api';
import toast from 'react-hot-toast';

export default function EducationalPanel() {
  const [content, setContent] = useState<EducationalContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState<number | null>(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [interactiveDemo, setInteractiveDemo] = useState<string | null>(null);

  useEffect(() => {
    loadEducationalContent();
  }, []);

  const loadEducationalContent = async () => {
    setLoading(true);
    try {
      const data = await apiService.getEducationalContent();
      setContent(data);
    } catch (error) {
      toast.error('Failed to load educational content');
      console.error('Educational content error:', error);
    } finally {
      setLoading(false);
    }
  };

  const sectionIcons = {
    0: Satellite,
    1: Activity,
    2: Fish,
    3: Heart
  };

  const interactiveElements = [
    {
      id: 'trophic_cascade_slider',
      title: 'Food Web Time Slider',
      description: 'Drag the slider to see how changes in phytoplankton affect sharks over time',
      component: 'TrophicSlider'
    },
    {
      id: 'habitat_map_explorer',
      title: 'Habitat Map Explorer', 
      description: 'Click different areas on the map to see habitat suitability scores',
      component: 'MapExplorer'
    },
    {
      id: 'time_delay_animation',
      title: 'Time Delay Animation',
      description: 'Watch the 30-day delay from satellite data to shark response',
      component: 'TimeAnimation'
    },
    {
      id: 'shark_tag_simulator',
      title: 'Virtual Shark Tag',
      description: 'Experience what data looks like from a real shark tag',
      component: 'TagSimulator'
    }
  ];

  if (loading) {
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
              Loading educational content...
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
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {content?.title || 'Learn About Shark Tracking'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover how satellites help scientists protect sharks
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center space-x-2 mb-6">
          {content?.sections.map((_, index) => (
            <div key={index} className="flex items-center">
              <button
                onClick={() => setCurrentStep(index)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  currentStep === index
                    ? 'bg-blue-500 text-white'
                    : currentStep > index
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {currentStep > index ? '✓' : index + 1}
              </button>
              {index < (content?.sections.length || 0) - 1 && (
                <div className={`w-8 h-1 mx-2 rounded ${
                  currentStep > index ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={() => setCurrentStep(Math.min((content?.sections.length || 1) - 1, currentStep + 1))}
            disabled={currentStep === (content?.sections.length || 1) - 1}
            className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Current Section */}
      {content?.sections[currentStep] && (
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              {(() => {
                const IconComponent = sectionIcons[currentStep as keyof typeof sectionIcons] || BookOpen;
                return <IconComponent className="w-8 h-8 text-blue-600 dark:text-blue-400" />;
              })()}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {content.sections[currentStep].title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                {content.sections[currentStep].content}
              </p>
            </div>
          </div>

          {/* Visual Aid Placeholder */}
          <div className="mt-6 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900 to-cyan-900 rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">
              {currentStep === 0 && '🛰️'}
              {currentStep === 1 && '🔗'}
              {currentStep === 2 && '⏰'}
              {currentStep === 3 && '🎯'}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Visual aid: {content.sections[currentStep].visual_aid}
            </p>
          </div>
        </motion.div>
      )}

      {/* Interactive Elements */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Interactive Learning Tools
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interactiveElements.map((element, index) => (
            <div
              key={element.id}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
            >
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                {element.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {element.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  Try it out →
                </span>
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-sm">{index + 1}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Concepts */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Key Concepts to Remember
        </h3>
        
        <div className="space-y-3">
          {[
            {
              concept: 'Satellite Remote Sensing',
              explanation: 'Satellites can measure ocean color to detect tiny plants (phytoplankton) from space'
            },
            {
              concept: 'Food Web Connections',
              explanation: 'Everything in the ocean is connected: plants → small animals → fish → sharks'
            },
            {
              concept: 'Time Delays',
              explanation: 'It takes about 30 days for changes in phytoplankton to affect shark populations'
            },
            {
              concept: 'Mathematical Modeling',
              explanation: 'Scientists use math to predict where sharks are most likely to be found'
            }
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                {index + 1}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {item.concept}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conservation Message */}
      {content?.conservation_message && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">🌊</div>
            <div>
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                Why This Matters for Conservation
              </h4>
              <p className="text-green-800 dark:text-green-200">
                {content.conservation_message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Quiz Section */}
      <motion.div 
        className="bg-white rounded-xl border border-blue-200 shadow-sm p-6"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        }}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-600 rounded-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-blue-900">
            Interactive Knowledge Check
          </h3>
        </div>
        
        <div className="space-y-6">
          <motion.div 
            className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h4 className="font-semibold text-blue-900 mb-4 text-lg">
              🌊 Marine Science Challenge: Trophic Time Delays
            </h4>
            <p className="text-blue-700 mb-4">
              How long does it typically take for changes in phytoplankton (detected by satellites) to affect shark populations?
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {[
                { text: '1-3 days', correct: false, explanation: 'Too fast - marine food webs need time to respond' },
                { text: '1 week', correct: false, explanation: 'Still too quick for ecosystem-wide changes' },
                { text: '30 days', correct: true, explanation: 'Correct! This is the typical trophic cascade delay' },
                { text: '1 year', correct: false, explanation: 'Too long - sharks would respond faster than this' }
              ].map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = option.correct;
                const showResult = showQuizResult && isSelected;
                
                return (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setSelectedAnswer(index);
                      setShowQuizResult(true);
                      if (option.correct) {
                        setQuizCompleted(true);
                        toast.success('🎉 Excellent! You understand trophic delays!');
                      } else {
                        toast.error('Not quite right. Try again!');
                      }
                    }}
                    disabled={showQuizResult}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                      isSelected
                        ? isCorrect
                          ? 'border-green-500 bg-green-50 text-green-800'
                          : 'border-red-500 bg-red-50 text-red-800'
                        : 'border-blue-200 bg-white hover:border-blue-400 hover:bg-blue-50 text-blue-700'
                    } ${showQuizResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option.text}</span>
                      {showResult && (
                        <span className="text-2xl">
                          {isCorrect ? '✅' : '❌'}
                        </span>
                      )}
                    </div>
                    {showResult && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 text-sm"
                      >
                        {option.explanation}
                      </motion.p>
                    )}
                  </motion.button>
                );
              })}
            </div>
            
            {quizCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-100 border border-green-300 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <h5 className="font-semibold text-green-800">Great job!</h5>
                    <p className="text-green-700 text-sm">
                      You understand how satellite data connects to marine ecosystems through trophic cascades!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            
            <button
              onClick={() => {
                setSelectedAnswer(null);
                setShowQuizResult(false);
                setQuizCompleted(false);
              }}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Interactive Demos Section */}
      <motion.div 
        className="bg-white rounded-xl border border-blue-200 shadow-sm p-6"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        }}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-blue-900">
            Interactive Learning Demos
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              id: 'trophic-slider',
              title: 'Trophic Cascade Simulator',
              description: 'See how phytoplankton changes affect the entire food web',
              icon: '🌊',
              color: 'blue'
            },
            {
              id: 'satellite-data',
              title: 'Satellite Data Explorer',
              description: 'Explore real PACE satellite measurements',
              icon: '🛰️',
              color: 'green'
            },
            {
              id: 'shark-tracker',
              title: 'Virtual Shark Tag',
              description: 'Experience data from a simulated shark tag',
              icon: '🦈',
              color: 'purple'
            },
            {
              id: 'habitat-map',
              title: 'Habitat Suitability Map',
              description: 'Interactive habitat prediction visualization',
              icon: '🗺️',
              color: 'orange'
            }
          ].map((demo) => (
            <motion.button
              key={demo.id}
              onClick={() => {
                setInteractiveDemo(interactiveDemo === demo.id ? null : demo.id);
                toast.success(`${demo.title} ${interactiveDemo === demo.id ? 'closed' : 'opened'}!`);
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`p-6 rounded-xl border-2 text-left transition-all duration-300 ${
                interactiveDemo === demo.id
                  ? `border-${demo.color}-500 bg-${demo.color}-50`
                  : 'border-blue-200 bg-white hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{demo.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-2">{demo.title}</h4>
                  <p className="text-blue-700 text-sm mb-3">{demo.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-blue-600">
                      {interactiveDemo === demo.id ? 'Click to close' : 'Click to explore'}
                    </span>
                    <motion.div
                      animate={{ rotate: interactiveDemo === demo.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-4 h-4 text-blue-600" />
                    </motion.div>
                  </div>
                </div>
              </div>
              
              {interactiveDemo === demo.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-blue-200"
                >
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800 text-sm mb-3">
                      🚀 <strong>Interactive Demo:</strong> This would connect to the actual {demo.title.toLowerCase()} component.
                    </p>
                    <div className="flex space-x-2">
                      <div className="flex-1 bg-blue-200 h-2 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-600"
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                      <span className="text-xs text-blue-600">Loading...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
