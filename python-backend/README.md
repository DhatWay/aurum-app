# AURUM ML Engine

Python FastAPI backend for AURUM's advanced ML algorithms.

## Algorithms

- `/drl` — Deep Reinforcement Learning (multi-agent)
- `/gru` — Attention-Augmented GRU
- `/flspi` — Fuzzy Least-Squares Policy Iteration
- `/autoencoder` — Dual Autoencoder Stock Selection
- `/mamba` — State-Space Model (Mamba-style)
- `/orchestrate` — Master Algorithm Orchestrator

## Deploy to Render (Free)

1. Go to render.com
2. New Web Service
3. Connect your GitHub repo
4. Set Root Directory to `python-backend`
5. Build Command: `pip install -r requirements.txt`
6. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
7. Deploy

## Connect to AURUM

Once deployed add your Render URL to Supabase secrets:

- Name: `PYTHON_BACKEND_URL`
- Value: `https://your-app.onrender.com`

## Status

All algorithms are plug and play ready.
Connect trained model weights to upgrade from simulation to full ML inference.
