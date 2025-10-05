# Shark Habitat Prediction Frontend

A Next.js web application for visualizing and interacting with shark habitat predictions based on NASA PACE satellite data. This frontend provides educational visualizations and interactive displays of mathematical models for shark habitat suitability.

## Overview

This application serves as the user interface for the NASA Space Apps Challenge shark habitat prediction project. It displays:

- Real-time habitat suitability predictions
- Trophic cascade modeling results with 30-day lag systems
- Educational content explaining satellite-to-shark connections
- Advanced mathematical model visualizations
- Uncertainty quantification displays

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Custom SVG visualizations
- **API Integration**: RESTful backend communication

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, pnpm, or bun package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) to view the application.

### Backend Integration

The frontend expects a backend server running on port 5000. Start the backend from the project root:

```bash
cd ../backend
python serve_outputs.py
```

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── components/         # Reusable UI components
│   ├── services/          # API service layer
│   ├── hooks/             # Custom React hooks
│   ├── trophic/           # Trophic modeling page
│   └── page.tsx           # Main landing page
├── public/                # Static assets
└── tailwind.config.js     # Styling configuration
```

## Key Features

### Educational Visualizations
- Step-by-step habitat component breakdown
- Trophic cascade time series explanations
- Interactive mathematical model displays

### Real-time Data Integration
- Live habitat suitability maps
- Uncertainty quantification displays
- Analysis results from NASA PACE satellite data

### Mathematical Model Visualization
- Advanced Habitat Suitability Index displays
- Trophic lag modeling with time delays
- Multi-component habitat factor integration

## API Endpoints

The frontend communicates with these backend endpoints:

- `GET /api/trophic/timeseries` - Trophic cascade data
- `POST /api/prediction/advanced` - Advanced habitat predictions
- `POST /api/prediction/basic` - Basic habitat predictions
- `GET /api/analysis/outputs` - Analysis result metadata
- `GET /api/images/{filename}` - Visualization images

## Development

### Code Organization

- **Components**: Modular UI components with TypeScript interfaces
- **Services**: API communication layer with error handling
- **Hooks**: Custom React hooks for data management
- **Types**: TypeScript definitions for data structures

### Styling Guidelines

- Tailwind CSS utility classes for consistent styling
- Responsive design for mobile and desktop
- Accessible color schemes and typography
- Professional scientific visualization aesthetics

## Build and Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Configuration

The application automatically detects the backend URL. For production deployment, ensure the backend is accessible at the configured endpoint.

## Educational Content

This frontend is designed to make complex oceanographic and mathematical concepts accessible to high school students while maintaining scientific accuracy. The visualizations explain:

- How satellite data connects to shark habitat
- Mathematical modeling of ocean food webs
- Time-delayed ecological responses
- Uncertainty in scientific predictions
