# Business Resilience Copilot

## Project Overview

The Business Resilience Copilot is an AI-powered application designed to help businesses proactively identify, assess, and mitigate risks. It provides tools for risk analysis, simulation, and action planning, leveraging AI to offer intelligent insights and recommendations.

## Key Features

### Core Functionality

- **AI-Powered Risk Analysis Engine**: 
  - Real-time risk assessment using machine learning models
  - Natural language processing for document analysis
  - Predictive analytics for future risk forecasting

- **Interactive Simulation Dashboard**:
  - Scenario modeling with adjustable parameters
  - Impact visualization through interactive charts
  - Comparative analysis of different risk mitigation strategies

- **Action Planning System**:
  - Automated recommendation engine
  - Customizable action checklists
  - Progress tracking and reporting

### Additional Features

- **Secure Document Upload**:
  - Encrypted file storage
  - Multi-format support (PDF, DOCX, XLSX) (Soon to be implemented)
  - Automated data extraction

- **Collaboration Tools**:
  - Team-based risk assessment
  - Commenting and annotation system
  - Role-based access control

## Technology Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS + PostCSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Data Visualization**: Chart.js
- **Testing**: Jest + React Testing Library

### Backend

- **Framework**: FastAPI
- **Database**: Supabase (PostgreSQL compatible)
- **Authentication**: JWT + OAuth2 (managed by Supabase Auth)
- **API Documentation**: Swagger UI + OpenAPI
- **Task Queue**: Celery
- **Caching**: Redis
- **File Storage**: Supabase Storage

### AI/ML Components

- **Core Engine**: Python 3.10
- **NLP**: spaCy + Transformers
- **Machine Learning**: Scikit-learn + XGBoost
- **Vector Database**: Supabase Vector (pgvector)
- **Embeddings**: Gemini API

### Infrastructure

- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack

## Database Schema

The application uses Supabase (PostgreSQL compatible) with the following key tables:

1. **users** - User accounts and authentication (managed by Supabase Auth)
2. **organizations** - Business entities
3. **risk_assessments** - Core risk evaluation records
4. **risk_factors** - Identified risk elements
5. **mitigation_actions** - Recommended actions
6. **simulations** - Scenario analysis records
7. **documents** - Uploaded business files (stored in Supabase Storage)
8. **annotations** - User comments on risks

## Development Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- Python 3.10+
- Supabase Account and Project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Shubhaannsaae/business-resilience-copilot.git
cd business-resilience-copilot
```

2. Backend setup:
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

3. Frontend setup:
```bash
cd ../frontend
npm install
```


## License

MIT License