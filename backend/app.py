"""
Flask Backend API for NASA Space Apps Challenge
Shark Habitat Prediction System

This API serves the advanced mathematical models and provides
real-time predictions for the Next.js frontend.
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import json
import numpy as np
import base64
import io
from datetime import datetime
import threading
import time

# Setup Python path for imports
import sys
import os
backend_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(backend_dir)
src_dir = os.path.join(project_root, 'src')

sys.path.insert(0, project_root)
sys.path.insert(0, src_dir)

# Import your existing prediction system
try:
    # Try importing from the src directory
    import integrated_pipeline
    import data_loader
    import plotting
    
    IntegratedSharkHabitatPredictor = integrated_pipeline.IntegratedSharkHabitatPredictor
    load_core_fields = data_loader.load_core_fields
    plot_field = plotting.plot_field
    
    print("✅ Successfully imported prediction modules")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("⚠️  Running in fallback mode with basic functionality")
    
    # Create dummy classes for basic functionality
    class IntegratedSharkHabitatPredictor:
        def __init__(self):
            pass
        
        def process_pace_data_with_trophic_modeling(self, *args, **kwargs):
            return {'chlor': None}
        
        def compute_comprehensive_habitat_prediction(self, *args, **kwargs):
            return {'Advanced_HSI': None}
        
        def demonstrate_tag_integration(self, *args, **kwargs):
            return {'feeding_events': []}
        
        def create_educational_visualizations(self, *args, **kwargs):
            return []
        
        def generate_summary_report(self, *args, **kwargs):
            pass
    
    def load_core_fields(*args, **kwargs):
        return {'chlor': None, 'lat': None, 'lon': None}
    
    def plot_field(*args, **kwargs):
        pass

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

# Global prediction system instance
predictor = IntegratedSharkHabitatPredictor()

# Configuration
PACE_DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'PACE_OCI.20251004T015456.L2.OC_BGC.V3_1.NRT.nc')
OUTPUTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'outputs')
OVERRIDES_PATH = os.path.join(os.path.dirname(__file__), '..', 'overrides.json')

# Ensure outputs directory exists
os.makedirs(OUTPUTS_DIR, exist_ok=True)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0',
        'system': 'NASA Space Apps Challenge - Shark Habitat Prediction'
    })

@app.route('/api/dataset/info', methods=['GET'])
def get_dataset_info():
    """Get information about the loaded PACE dataset"""
    try:
        # Load overrides
        overrides = {}
        if os.path.exists(OVERRIDES_PATH):
            with open(OVERRIDES_PATH, 'r') as f:
                overrides = json.load(f)
        
        # Load basic dataset info
        fields = load_core_fields(PACE_DATA_PATH, overrides=overrides)
        
        dataset_info = {
            'data_source': 'NASA PACE Satellite',
            'date': '2025-10-04',
            'spatial_resolution': f"{fields['chlor'].shape}" if fields.get('chlor') is not None else "Unknown",
            'available_fields': [key for key, value in fields.items() if value is not None],
            'coverage_area': 'Ocean region',
            'processing_status': 'ready'
        }
        
        return jsonify(dataset_info)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/prediction/basic', methods=['POST'])
def get_basic_prediction():
    """Get basic habitat suitability prediction"""
    try:
        # Load overrides
        overrides = {}
        if os.path.exists(OVERRIDES_PATH):
            with open(OVERRIDES_PATH, 'r') as f:
                overrides = json.load(f)
        
        # Process data
        fields = predictor.process_pace_data_with_trophic_modeling(
            PACE_DATA_PATH, overrides=overrides
        )
        
        # Get basic prediction (fallback mode)
        chlor = fields.get('chlor')
        if chlor is not None:
            # Simple HSI based on chlorophyll
            hsi = np.log1p(chlor)
            hsi = (hsi - np.nanmin(hsi)) / (np.nanmax(hsi) - np.nanmin(hsi) + 1e-6)
            
            # Convert to list for JSON serialization
            prediction_data = {
                'hsi': hsi.tolist(),
                'shape': hsi.shape,
                'method': 'basic_chlorophyll',
                'timestamp': datetime.now().isoformat(),
                'statistics': {
                    'min': float(np.nanmin(hsi)),
                    'max': float(np.nanmax(hsi)),
                    'mean': float(np.nanmean(hsi)),
                    'std': float(np.nanstd(hsi))
                }
            }
            
            return jsonify(prediction_data)
        else:
            return jsonify({'error': 'No chlorophyll data available'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/prediction/advanced', methods=['POST'])
def get_advanced_prediction():
    """Get advanced habitat suitability prediction with all components"""
    try:
        # Load overrides
        overrides = {}
        if os.path.exists(OVERRIDES_PATH):
            with open(OVERRIDES_PATH, 'r') as f:
                overrides = json.load(f)
        
        # Process data with full pipeline
        fields = predictor.process_pace_data_with_trophic_modeling(
            PACE_DATA_PATH, overrides=overrides
        )
        
        # Compute comprehensive habitat prediction
        habitat_results = predictor.compute_comprehensive_habitat_prediction(fields)
        
        # Prepare response data
        response_data = {
            'timestamp': datetime.now().isoformat(),
            'method': 'advanced_mathematical_framework',
            'components': {},
            'metadata': {
                'trophic_modeling': 'enabled',
                'uncertainty_quantification': 'enabled',
                'spatial_resolution': fields['chlor'].shape if fields.get('chlor') is not None else None
            }
        }
        
        # Add available components
        for key, value in habitat_results.items():
            if isinstance(value, np.ndarray) and value.ndim == 2:
                response_data['components'][key] = {
                    'data': value.tolist(),
                    'shape': value.shape,
                    'statistics': {
                        'min': float(np.nanmin(value)),
                        'max': float(np.nanmax(value)),
                        'mean': float(np.nanmean(value)),
                        'std': float(np.nanstd(value))
                    }
                }
        
        return jsonify(response_data)
        
    except Exception as e:
        return jsonify({'error': str(e), 'fallback': 'basic_prediction_available'}), 500

@app.route('/api/trophic/timeseries', methods=['GET'])
def get_trophic_timeseries():
    """Get trophic cascade time series data for educational visualization"""
    try:
        # Load overrides
        overrides = {}
        if os.path.exists(OVERRIDES_PATH):
            with open(OVERRIDES_PATH, 'r') as f:
                overrides = json.load(f)
        
        # Process data to get trophic time series
        fields = predictor.process_pace_data_with_trophic_modeling(
            PACE_DATA_PATH, overrides=overrides
        )
        
        trophic_data = fields.get('trophic_time_series')
        if trophic_data:
            # Convert numpy arrays to lists for JSON serialization
            serialized_data = {}
            for key, value in trophic_data.items():
                if isinstance(value, np.ndarray):
                    serialized_data[key] = value.tolist()
                else:
                    serialized_data[key] = value
            
            return jsonify({
                'trophic_cascade': serialized_data,
                'explanation': {
                    'phytoplankton': 'Primary producers (satellite chlorophyll data)',
                    'zooplankton': 'Small marine animals that eat phytoplankton',
                    'small_fish': 'Fish that feed on zooplankton',
                    'sharks': 'Top predators that feed on small fish',
                    'time_lags': {
                        'phyto_to_zoo': '5 days',
                        'zoo_to_fish': '10 days', 
                        'fish_to_shark': '15+ days'
                    }
                },
                'educational_note': 'This shows how satellite data connects to shark habitat through the ocean food web!'
            })
        else:
            return jsonify({'error': 'No trophic data available'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tag/simulation', methods=['POST'])
def simulate_shark_tag():
    """Simulate real-time shark tag data for demonstration"""
    try:
        duration_hours = request.json.get('duration_hours', 4.0) if request.json else 4.0
        
        # Get habitat results for context
        overrides = {}
        if os.path.exists(OVERRIDES_PATH):
            with open(OVERRIDES_PATH, 'r') as f:
                overrides = json.load(f)
        
        fields = predictor.process_pace_data_with_trophic_modeling(
            PACE_DATA_PATH, overrides=overrides
        )
        habitat_results = predictor.compute_comprehensive_habitat_prediction(fields)
        
        # Demonstrate tag integration
        tag_results = predictor.demonstrate_tag_integration(habitat_results, duration_hours)
        
        # Serialize for JSON response
        serialized_results = {}
        for key, value in tag_results.items():
            if isinstance(value, np.ndarray):
                serialized_results[key] = value.tolist()
            elif isinstance(value, list):
                # Handle list of dictionaries (feeding events)
                serialized_results[key] = value
            else:
                serialized_results[key] = value
        
        return jsonify({
            'simulation_results': serialized_results,
            'duration_hours': duration_hours,
            'timestamp': datetime.now().isoformat(),
            'educational_note': 'This demonstrates how real shark tags could integrate with satellite habitat predictions!'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/visualization/generate', methods=['POST'])
def generate_visualization():
    """Generate visualization images for frontend display"""
    try:
        viz_type = request.json.get('type', 'hsi') if request.json else 'hsi'
        
        # Load overrides
        overrides = {}
        if os.path.exists(OVERRIDES_PATH):
            with open(OVERRIDES_PATH, 'r') as f:
                overrides = json.load(f)
        
        # Process data
        fields = predictor.process_pace_data_with_trophic_modeling(
            PACE_DATA_PATH, overrides=overrides
        )
        
        if viz_type == 'educational':
            # Create educational visualizations
            habitat_results = predictor.compute_comprehensive_habitat_prediction(fields)
            educational_files = predictor.create_educational_visualizations(
                habitat_results, fields, OUTPUTS_DIR
            )
            
            return jsonify({
                'generated_files': educational_files,
                'base_url': '/api/images/',
                'timestamp': datetime.now().isoformat()
            })
        else:
            # Generate basic HSI visualization
            chlor = fields.get('chlor')
            if chlor is not None:
                hsi = np.log1p(chlor)
                hsi = (hsi - np.nanmin(hsi)) / (np.nanmax(hsi) - np.nanmin(hsi) + 1e-6)
                
                output_path = os.path.join(OUTPUTS_DIR, 'current_hsi.png')
                plot_field(hsi, fields.get('lon'), fields.get('lat'), 
                          'Current Shark Habitat Suitability', output_path)
                
                return jsonify({
                    'generated_file': 'current_hsi.png',
                    'image_url': '/api/images/current_hsi.png',
                    'timestamp': datetime.now().isoformat()
                })
            else:
                return jsonify({'error': 'No data available for visualization'}), 400
                
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/images/<filename>')
def serve_image(filename):
    """Serve generated visualization images"""
    try:
        image_path = os.path.join(OUTPUTS_DIR, filename)
        if os.path.exists(image_path):
            return send_file(image_path, mimetype='image/png')
        else:
            return jsonify({'error': 'Image not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/educational/content', methods=['GET'])
def get_educational_content():
    """Get educational content for high school students"""
    return jsonify({
        'title': 'How Satellites Help Track Sharks',
        'sections': [
            {
                'title': 'Step 1: Satellites See Ocean Color',
                'content': 'NASA PACE satellite measures ocean color to detect tiny plants (phytoplankton) in the water.',
                'visual_aid': 'chlorophyll_map'
            },
            {
                'title': 'Step 2: Food Web Connections', 
                'content': 'Phytoplankton feed zooplankton → zooplankton feed small fish → small fish feed sharks!',
                'visual_aid': 'trophic_cascade'
            },
            {
                'title': 'Step 3: Time Delays Matter',
                'content': 'It takes ~30 days for phytoplankton blooms to affect shark populations through the food web.',
                'visual_aid': 'time_series'
            },
            {
                'title': 'Step 4: Predict Shark Hotspots',
                'content': 'By combining satellite data with ocean physics, we can predict where sharks are most likely to be!',
                'visual_aid': 'habitat_map'
            }
        ],
        'interactive_elements': [
            'trophic_cascade_slider',
            'habitat_map_explorer', 
            'time_delay_animation',
            'shark_tag_simulator'
        ],
        'conservation_message': 'Understanding shark habitats helps protect these important ocean predators!'
    })

if __name__ == '__main__':
    print("🦈 Starting NASA Space Apps Challenge - Shark Habitat Prediction API")
    print(f"📊 Outputs directory: {OUTPUTS_DIR}")
    print(f"🛰️  PACE data: {PACE_DATA_PATH}")
    print("🚀 Server starting on http://localhost:5000")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
