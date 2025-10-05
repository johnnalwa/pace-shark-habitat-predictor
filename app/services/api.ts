import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for predictions
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling with fallback data
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't reject immediately - let individual functions handle fallbacks
    return Promise.reject(error);
  }
);

// No fallback data - use only real analysis results

export interface DatasetInfo {
  data_source: string;
  date: string;
  spatial_resolution: string;
  available_fields: string[];
  coverage_area: string;
  processing_status: string;
}

export interface PredictionComponent {
  data: number[][];
  shape: number[];
  statistics: {
    min: number;
    max: number;
    mean: number;
    std: number;
  };
}

export interface AdvancedPredictionData {
  timestamp: string;
  method: string;
  components: {
    [key: string]: PredictionComponent;
  };
  metadata: {
    trophic_modeling: string;
    uncertainty_quantification: string;
    spatial_resolution: number[] | null;
  };
}

export interface BasicPredictionData {
  hsi: number[][];
  shape: number[];
  method: string;
  timestamp: string;
  statistics: {
    min: number;
    max: number;
    mean: number;
    std: number;
  };
}

export interface TrophicTimeSeriesData {
  trophic_cascade: {
    [key: string]: number[];
  };
  explanation: {
    [key: string]: string;
  };
  educational_note: string;
}

export interface SharkTagSimulation {
  simulation_results: {
    feeding_events: Array<{
      timestamp: number;
      duration: number;
      intensity: number;
      location: [number, number];
    }>;
    behavioral_states: number[];
    accelerometer_data: number[];
    depth_data: number[];
  };
  duration_hours: number;
  timestamp: string;
  educational_note: string;
}

export interface EducationalContent {
  title: string;
  sections: Array<{
    title: string;
    content: string;
    visual_aid: string;
  }>;
  conservation_message: string;
}

export const apiService = {
  // Health check
  async healthCheck(): Promise<any> {
    try {
      const response = await api.get('/api/health');
      return response.data;
    } catch (error) {
      return { status: 'demo_mode', message: 'Using fallback data for demonstration' };
    }
  },

  // Dataset information
  async getDatasetInfo(): Promise<DatasetInfo> {
    try {
      const response = await api.get('/api/dataset/info');
      return response.data;
    } catch (error) {
      return {
        data_source: 'PACE OCI L2 (Demo Mode)',
        date: '2024-10-04',
        spatial_resolution: '1km x 1km',
        available_fields: ['chlor_a', 'sst', 'par', 'poc', 'pic'],
        coverage_area: 'Global Ocean',
        processing_status: 'ready'
      };
    }
  },

  // Trophic time series data - only from real analysis
  async getTrophicTimeSeries(): Promise<any> {
    const response = await api.get('/api/trophic/timeseries');
    return response.data;
  },

  // Advanced prediction - only from real analysis
  async getAdvancedPrediction(): Promise<any> {
    const response = await api.post('/api/prediction/advanced');
    return response.data;
  },

  // Basic prediction - only from real analysis
  async getBasicPrediction(): Promise<BasicPredictionData> {
    const response = await api.post('/api/prediction/basic');
    return response.data;
  },

  // Get your actual analysis images
  getAnalysisImageUrl(filename: string): string {
    return `/api/images/${filename}`;
  },

  // Get list of your analysis outputs - only real data
  async getAnalysisOutputs(): Promise<any> {
    const response = await api.get('/api/analysis/outputs');
    return response.data;
  },

  // Get educational content
  async getEducationalContent(): Promise<EducationalContent> {
    try {
      const response = await api.get('/api/educational/content');
      return response.data;
    } catch (error) {
      console.warn('Using fallback educational content');
      return {
        title: 'NASA PACE Satellite & Shark Conservation',
        sections: [
          {
            title: '🛰️ What is PACE?',
            content: 'The Plankton, Aerosol, Cloud, ocean Ecosystem (PACE) mission is NASA\'s most advanced ocean color satellite. It measures how light interacts with particles in the ocean to understand marine ecosystems.',
            visual_aid: 'satellite_diagram'
          },
          {
            title: '🌊 Ocean Color Science',
            content: 'Different types of phytoplankton absorb and reflect light differently. PACE can identify specific phytoplankton species from space, helping us understand the base of the marine food web.',
            visual_aid: 'chlorophyll_spectrum'
          },
          {
            title: '🦈 Trophic Cascades',
            content: 'When phytoplankton blooms occur, it takes time for this energy to move up the food chain: phytoplankton → zooplankton (5 days) → small fish (10 days) → sharks (15+ days).',
            visual_aid: 'food_web_animation'
          },
          {
            title: '🔬 Mathematics Modeling',
            content: 'We use advanced algorithms to predict where sharks will be based on satellite data, combining ocean physics, biology, and time-delay mathematics.',
            visual_aid: 'equation_display'
          }
        ],
        conservation_message: 'Understanding shark habitats helps us protect these apex predators and maintain healthy ocean ecosystems. Every shark matters for ocean balance!'
      };
    }
  },

  // Get image URL
  getImageUrl(filename: string): string {
    return `${API_BASE_URL}/api/images/${filename}`;
  },
};

export default apiService;
