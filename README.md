# CIO Assistant Dashboard

A comprehensive executive dashboard for IT management with AI-powered insights, file analysis, and forecasting capabilities.

## Features

### Frontend (React + Tailwind CSS)
- **Dashboard**: Executive overview with key metrics and performance indicators
- **AI Assistant**: Chat interface with RAG (Retrieval-Augmented Generation) capabilities
- **File Upload**: Support for PDF, DOCX, XLSX, CSV, and TXT files
- **Risk Heatmap**: Regional risk analysis with interactive visualizations
- **Forecast**: What-if scenarios and Monte Carlo simulations
- **Daily Brief**: Automated executive summaries with risks, wins, and blockers

### Backend (FastAPI)
- **File Processing**: Extract and analyze content from uploaded documents
- **AI Integration**: Azure OpenAI GPT-4o for intelligent responses
- **Vector Store**: FAISS-based document embeddings for RAG
- **REST API**: Comprehensive endpoints for all dashboard features
- **Real-time Analytics**: Performance monitoring and alerting

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, TypeScript
- **Backend**: FastAPI, Python 3.9+
- **AI/ML**: Azure OpenAI GPT-4o, FAISS vector store
- **File Processing**: PyPDF2, python-docx, openpyxl, pandas
- **Database**: PostgreSQL (optional)
- **Deployment**: Docker, Docker Compose

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Azure OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cio-assistant-dashboard
   ```

2. **Frontend Setup**
   ```bash
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   cd backend
  python -m pip install -r requirements.txt
   
   # Set up environment variables
   cp .env.example .env
   # Edit .env with your Azure OpenAI credentials
   
   # Start API server
   python main.py
   ```

### Configuration

1. **Azure OpenAI Setup**
   - Create an Azure OpenAI resource
   - Deploy GPT-4o model
   - Update `.env` with your credentials:
     ```
     AZURE_OPENAI_API_KEY=your_key_here
     AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
     AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
     ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and configure:
   - Azure OpenAI credentials
   - Database connection (optional)
   - File upload settings
   - CORS origins

## Usage

### Dashboard
- Access the main dashboard at `http://localhost:3000`
- View key metrics, system performance, and recent alerts
- Use quick actions for common tasks

### AI Assistant
- Upload documents (PDF, DOCX, XLSX, CSV, TXT)
- Chat with the AI assistant about your documents
- Get insights and analysis based on uploaded content

### File Upload
- Drag and drop files or click to select
- Supports up to 10MB per file
- Real-time processing status and progress

### Risk Heatmap
- View regional risk analysis
- Interactive heatmap with severity levels
- Drill-down capabilities for detailed analysis

### Forecast
- Create what-if scenarios
- Adjust budget and time horizon parameters
- Generate Monte Carlo simulations
- Export results as PDF

### Daily Brief
- Generate executive summaries
- View risks, wins, and blockers
- Export briefings as PDF
- Track key metrics and action items

## API Endpoints

### File Upload
```
POST /upload
- Upload multiple files for processing
- Returns processing status and file metadata
```

### Chat
```
POST /chat
- Send message to AI assistant
- Returns AI response with context from uploaded files
```

### Daily Brief
```
GET /brief
- Generate daily executive brief
- Returns risks, wins, blockers, and metrics
```

### Forecast
```
POST /forecast
- Generate forecast scenarios
- Parameters: budget_increase, time_horizon, metric
- Returns scenario analysis and predictions
```

## File Processing

The system supports the following file formats:

- **PDF**: Text extraction using PyPDF2
- **DOCX**: Document processing with python-docx
- **XLSX**: Excel file parsing with openpyxl
- **CSV**: Data analysis with pandas
- **TXT**: Plain text processing

All files are processed into chunks and stored in the vector database for RAG queries.

## Vector Store

The system uses FAISS for efficient similarity search:

- **Embeddings**: Generated using Azure OpenAI text-embedding-ada-002
- **Chunking**: Configurable chunk size and overlap
- **Search**: K-nearest neighbor search for relevant context
- **Persistence**: Save and load vector indices

## Security

- **CORS**: Configured for development origins
- **File Validation**: Extension and size checks
- **Input Sanitization**: Prevent injection attacks
- **Rate Limiting**: Protect against abuse
- **Authentication**: JWT-based (optional)

## Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build

# Access services
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Production Deployment
1. Set up environment variables
2. Configure database connections
3. Set up reverse proxy (nginx)
4. Enable HTTPS
5. Configure monitoring and logging

## Development

### Frontend Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

### Backend Development
```bash
# Start development server
python main.py

# Run tests
python -m pytest

# Format code
black .
```

## Troubleshooting

### Common Issues

1. **File Upload Errors**
   - Check file size limits
   - Verify file format support
   - Ensure proper CORS configuration

2. **AI Response Issues**
   - Verify Azure OpenAI credentials
   - Check API rate limits
   - Ensure model deployment is active

3. **Vector Store Issues**
   - Check FAISS installation
   - Verify embedding model access
   - Ensure sufficient disk space

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API documentation at `/docs`