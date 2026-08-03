# numbers

A neural network that predicts the digit a user draws on a 28×28 circular-node grid.

## Folder structure

```
numbersCNN/
├── backend/
│   ├── app.py              # Flask API (/api/health, /api/predict)
│   ├── model.py            # Network class (required to unpickle the model)
│   ├── train_model.py      # Train on MNIST and write trained_model.pkl
│   ├── trained_model.pkl   # Saved weights
│   ├── requirements.txt
│   ├── .env.example
│   └── data/               # MNIST binaries (for training)
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    ├── .env.example
    ├── public/
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api.js            # VITE_API_ENDPOINT
        └── components/       # Grid, nodes, boot overlay
```

## Setup (development)

### Prerequisites

- Python 3.10+
- Node.js 18+

### Backend

```bash
cd backend
python -m venv .venv
# Windows (Git Bash / Cygwin): source .venv/Scripts/activate
# macOS / Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Set `ALLOWED_ORIGINS` in `backend/.env` to a comma-separated list of frontend origins, for example:

```
ALLOWED_ORIGINS=http://localhost:5173
```

Load env vars, then start Flask (default port `5000`):

```bash
# Git Bash / Cygwin example
export $(grep -v '^#' .env | xargs)
python app.py
```

Optional — retrain the model (expects MNIST files under `backend/data/`):

```bash
python train_model.py
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

`frontend/.env` should point at the API base URL (trailing slash included):

```
VITE_API_ENDPOINT=http://localhost:5000/api/
```

Start the Vite dev server (default port `5173`):

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Draw on the grid and submit to get a prediction.

## Production

### Backend

1. Install dependencies the same way as in development.
2. Set environment variables for the host process (do not rely on debug mode):

   ```
   ALLOWED_ORIGINS=https://your-frontend-domain.example
   ```

   Multiple origins are comma-separated:

   ```
   ALLOWED_ORIGINS=https://app.example.com,https://www.example.com
   ```

3. Serve with Gunicorn instead of `python app.py`:

   ```bash
   cd backend
   gunicorn -b 0.0.0.0:5000 app:app
   ```

   Put a reverse proxy (nginx, Caddy, etc.) in front if you terminate TLS or expose a public URL.

### Frontend

1. Set the production API URL in the environment used at **build** time:

   ```
   VITE_API_ENDPOINT=https://your-api-domain.example/api/
   ```

2. Build static assets:

   ```bash
   cd frontend
   npm ci
   npm run build
   ```

3. Deploy the contents of `frontend/dist/` to any static host (nginx, Netlify, S3 + CDN, etc.).

Ensure the production frontend origin is listed in the backend’s `ALLOWED_ORIGINS`, and that `VITE_API_ENDPOINT` matches the public API URL.
