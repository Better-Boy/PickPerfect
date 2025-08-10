# ==== README.md ====
# PickPerfect with RedisAI

A modern FastAPI-based e-commerce backend with vector search capabilities, user authentication, and personalized recommendations.

## Features

- 🔐 JWT-based authentication with token blacklisting
- 🛍️ Product search with vector embeddings (OpenAI)
- 📍 Geo-location based product filtering
- 🎯 Personalized recommendations using user behavior
- 📊 Real-time trending products and categories
- 🔍 Advanced multi-parameter search
- 🚀 Redis for caching and vector storage
- 📈 User event tracking and analytics

## Project Structure

```
backend/
├── pyproject.toml          # Project configuration and dependencies
├── uv.lock                 # Lock file for reproducible builds
├── .env                    # Environment variables (create from .env.example)
├── src/
│   └── ecommerce/
│       ├── __init__.py
│       ├── main.py         # FastAPI application entry point
│       ├── config/
│       │   ├── __init__.py
│       │   └── settings.py # Application configuration
│       ├── core/
│       │   ├── __init__.py
│       │   ├── security.py # Authentication and JWT handling
│       │   └── database.py # Redis client configuration
│       ├── models/
│       │   ├── __init__.py
│       │   ├── user.py     # User data models
│       │   ├── product.py  # Product data models
│       │   └── event.py    # Event tracking models
│       ├── api/
│       │   ├── __init__.py
│       │   ├── deps.py     # Dependency injection
│       │   └── v1/
│       │       ├── __init__.py
│       │       ├── auth.py     # Authentication endpoints
│       │       ├── products.py # Product endpoints
│       │       └── events.py   # Event tracking endpoints
│       ├── services/
│       │   ├── __init__.py
│       │   ├── user_service.py           # User business logic
│       │   ├── product_service.py        # Product business logic
│       │   ├── recommendation_service.py # Recommendation engine
│       │   └── embedding_service.py      # OpenAI embedding service
│       └── utils/
│           ├── __init__.py
│           └── helpers.py  # Utility functions
└── tests/                  # Test directory (to be created)
```

## Installation

### Prerequisites

- Python 3.11+
- Redis with redis-py
- OpenAI API key

### Using uv (recommended)

1. **Install uv** (if not already installed):
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

2. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd backend
   ```

3. **Create environment and install dependencies**:
   ```bash
   uv sync
   ```

4. **Activate the virtual environment**:
   ```bash
   source .venv/bin/activate  # On Linux/macOS
   # or
   .venv\Scripts\activate     # On Windows
   ```

5. **Create environment file**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   SECRET_KEY=your-super-secret-key-here
   OPENAI_API_KEY=your-openai-api-key-here
   REDIS_HOST=your-redis-host
   REDIS_PORT=your-redis-port
   REDIS_PASSWORD=your-redis-password
   ```

## Running the Application

### Development Mode

```bash
uv run uvicorn src.pickperfect.main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode

```bash
uv run uvicorn src.pickperfect.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Using the included runner

```bash
uv run python src/pickperfect/main.py
```

## Development

### Install dev dependencies

```bash
uv pip install ".[dev]"
```

### Code Formatting

```bash
uv run black src/
uv run isort src/
```

### Type Checking

```bash
uv run mypy src/
```

### Linting

```bash
uv run flake8 src/
```
## API Documentation

Once the server is running, you can access:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Key Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user

### Products
- `POST /api/v1/products/` - Search products
- `GET /api/v1/products/trending` - Get trending products
- `GET /api/v1/products/near-by` - Get products near user location
- `POST /api/v1/products/filter` - Filter products by criteria

### Events & Recommendations
- `POST /api/v1/events` - Track user events
- `GET /api/v1/recommendations` - Get personalized recommendations
- `GET /api/v1/categories/trending` - Get trending categories

### Health Check
- `GET /health` - Application health status

## Architecture Decisions

### 1. **Modular Structure**
- Separated concerns into distinct modules (models, services, API routes)
- Clear separation between business logic (services) and API layer
- Configuration centralized in settings module

### 2. **Dependency Injection**
- FastAPI's dependency system used for authentication and database connections
- Singleton pattern for Redis client to ensure connection reuse
- Service layer pattern for business logic encapsulation

### 3. **Security**
- JWT tokens with expiration and blacklisting capability
- Password hashing with bcrypt
- Environment-based configuration for sensitive data

### 4. **Performance Optimizations**
- Redis for fast data access and caching
- Vector search for intelligent product recommendations
- Bloom filter for efficient user existence checks
- Time-based decay for recommendation relevance

### 5. **Scalability Considerations**
- Stateless design for horizontal scaling
- Redis as external state store
- Service-oriented architecture for easy microservice migration

## Environment Variables

Create a `.env` file with the following variables:

```env
# Security
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Redis Configuration
REDIS_HOST=redis-13451.c85.us-east-1-2.ec2.redns.redis-cloud.com
REDIS_PORT=13451
REDIS_PASSWORD=your-redis-password
REDIS_USERNAME=default
SEARCH_INDEX_NAME=products_idx
REDIS_BLOOM_FILTER=usersBF

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# CORS Configuration (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://localhost:8080
CORS_ALLOW_CREDENTIALS=true

# Application
APP_TITLE=PickPerfect with RedisAI
APP_VERSION=1.0.0
```

