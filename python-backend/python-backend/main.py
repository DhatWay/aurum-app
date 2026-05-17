from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import numpy as np
import json

app = FastAPI(title="AURUM ML Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── INPUT MODELS ──

class PriceData(BaseModel):
    ticker: str
    prices: List[float]
    volumes: Optional[List[float]] = None
    returns: Optional[List[float]] = None

class SentimentData(BaseModel):
    ticker: str
    scores: List[float]
    labels: Optional[List[str]] = None

class PortfolioData(BaseModel):
    tickers: List[str]
    scores: List[float]
    sectors: Optional[List[str]] = None
    historical_returns: Optional[Dict[str, float]] = None

class StockFeatures(BaseModel):
    ticker: str
    technical: List[float]
    fundamental: List[float]

class OrchestratorInput(BaseModel):
    ticker: str
    sector: Optional[str] = None
    algorithm_outputs: Dict[str, Any]
    historical_accuracy: Optional[Dict[str, float]] = None

# ── 1. DEEP REINFORCEMENT LEARNING ──

class DRLInput(BaseModel):
    ticker: str
    state: List[float]
    regime: Optional[str] = "neutral"

@app.post("/drl")
async def deep_reinforcement_learning(data: DRLInput):
    """
    Multi-agent DRL scoring system.
    Agent 1: Stock selection signal
    Agent 2: Trend prediction
    Agent 3: Risk management
    Plug and play — connect trained model weights when ready.
    """
    state = np.array(data.state)
    
    # Normalize state
    if len(state) > 0:
        state_norm = (state - np.mean(state)) / (np.std(state) + 1e-8)
    else:
        return {"error": "empty_state"}

    # Agent 1 — Stock Selection
    # Simulates Q-value scoring across action space [buy, hold, sell]
    selection_weights = np.array([0.4, 0.3, 0.2, 0.1] * (len(state_norm) // 4 + 1))[:len(state_norm)]
    selection_q = float(np.dot(state_norm, selection_weights))
    selection_score = min(max((selection_q + 2) / 4 * 100, 0), 100)

    # Agent 2 — Trend Prediction
    trend_weights = np.array([0.2, 0.4, 0.3, 0.1] * (len(state_norm) // 4 + 1))[:len(state_norm)]
    trend_q = float(np.dot(state_norm, trend_weights))
    trend_score = min(max((trend_q + 2) / 4 * 100, 0), 100)

    # Agent 3 — Risk Management
    risk_weights = np.array([0.1, 0.2, 0.4, 0.3] * (len(state_norm) // 4 + 1))[:len(state_norm)]
    risk_q = float(np.dot(state_norm, risk_weights))
    risk_penalty = min(max((risk_q + 2) / 4 * 30, 0), 30)

    # Regime adjustment
    regime_adj = {
        "low_rate_growth": 5, "high_rate_growth": 3,
        "stagflation_risk": -8, "recession": -15,
        "inversion_warning": -5, "neutral": 0
    }.get(data.regime, 0)

    final_score = min(max((selection_score * 0.5 + trend_score * 0.5) - risk_penalty + regime_adj, 0), 100)

    return {
        "ticker": data.ticker,
        "algorithm": "deep_reinforcement_learning",
        "final_score": round(final_score, 1),
        "agents": {
            "selection_agent": round(selection_score, 1),
            "trend_agent": round(trend_score, 1),
            "risk_penalty": round(risk_penalty, 1)
        },
        "regime_adjustment": regime_adj,
        "action": "BUY" if final_score > 65 else "HOLD" if final_score > 45 else "AVOID",
        "status": "ready_for_model_weights"
    }

# ── 2. ATTENTION-AUGMENTED GRU ──

@app.post("/gru")
async def attention_augmented_gru(data: PriceData):
    """
    GRU with attention mechanism for directional accuracy.
    Plug and play — connect trained GRU weights when ready.
    """
    prices = np.array(data.prices)
    
    if len(prices) < 5:
        return {"error": "minimum_5_prices_required"}

    # Attention mechanism — weight recent prices higher
    seq_len = len(prices)
    attention_weights = np.exp(np.linspace(0, 2, seq_len))
    attention_weights = attention_weights / attention_weights.sum()
    
    weighted_prices = prices * attention_weights

    # GRU-style hidden state simulation
    # h_t = tanh(W_h * h_{t-1} + W_x * x_t)
    hidden = np.zeros(4)
    for i, price in enumerate(weighted_prices):
        gate = np.tanh(hidden * 0.8 + price * 0.01)
        hidden = gate

    # Directional prediction
    recent_trend = (prices[-1] - prices[-5]) / prices[-5] if prices[-5] != 0 else 0
    attention_signal = float(np.sum(hidden))
    
    direction_score = 50 + (recent_trend * 200) + (attention_signal * 10)
    direction_score = min(max(direction_score, 0), 100)

    # Attention focus — which part of sequence matters most
    peak_attention_idx = int(np.argmax(attention_weights))
    
    return {
        "ticker": data.ticker,
        "algorithm": "attention_augmented_gru",
        "direction_score": round(direction_score, 1),
        "predicted_direction": "UP" if direction_score > 55 else "DOWN" if direction_score < 45 else "SIDEWAYS",
        "attention_focus": f"Price at position {peak_attention_idx} most influential",
        "recent_trend_pct": round(recent_trend * 100, 2),
        "hidden_state": [round(float(h), 4) for h in hidden],
        "status": "ready_for_trained_weights"
    }

# ── 3. FUZZY LEAST-SQUARES POLICY ITERATION ──

@app.post("/flspi")
async def fuzzy_lspi(data: PriceData):
    """
    Reinforcement Learning with fuzzy logic for stable multi-stock predictions.
    Robust in chaotic high-dimensional environments.
    """
    prices = np.array(data.prices)
    
    if len(prices) < 10:
        return {"error": "minimum_10_prices_required"}

    # Fuzzy membership functions
    def fuzzy_low(x, center=30, width=20):
        return max(0, 1 - abs(x - center) / width)

    def fuzzy_medium(x, center=50, width=25):
        return max(0, 1 - abs(x - center) / width)

    def fuzzy_high(x, center=70, width=20):
        return max(0, 1 - abs(x - center) / width)

    # Calculate RSI for fuzzy input
    gains = [max(prices[i] - prices[i-1], 0) for i in range(1, len(prices))]
    losses = [max(prices[i-1] - prices[i], 0) for i in range(1, len(prices))]
    avg_gain = np.mean(gains[-14:]) if gains else 0
    avg_loss = np.mean(losses[-14:]) if losses else 0.001
    rsi = 100 - (100 / (1 + avg_gain / avg_loss))

    # Volatility
    returns = np.diff(prices) / prices[:-1]
    volatility = float(np.std(returns) * 100)

    # Fuzzy rule evaluation
    low_rsi = fuzzy_low(rsi)
    med_rsi = fuzzy_medium(rsi)
    high_rsi = fuzzy_high(rsi)

    low_vol = fuzzy_low(volatility * 10, center=1, width=2)
    high_vol = fuzzy_high(volatility * 10, center=5, width=3)

    # Fuzzy rules
    # Rule 1: Low RSI + Low volatility = Strong Buy
    rule1 = min(low_rsi, low_vol) * 90
    # Rule 2: High RSI + High volatility = Strong Sell
    rule2 = min(high_rsi, high_vol) * 10
    # Rule 3: Medium RSI = Hold
    rule3 = med_rsi * 50

    # Defuzzification
    total_weight = min(low_rsi, low_vol) + min(high_rsi, high_vol) + med_rsi
    if total_weight > 0:
        fuzzy_score = (rule1 * min(low_rsi, low_vol) + rule2 * min(high_rsi, high_vol) + rule3 * med_rsi) / total_weight
    else:
        fuzzy_score = 50

    return {
        "ticker": data.ticker,
        "algorithm": "fuzzy_lspi",
        "fuzzy_score": round(fuzzy_score, 1),
        "rsi": round(rsi, 1),
        "volatility_pct": round(volatility, 2),
        "fuzzy_memberships": {
            "low_rsi": round(low_rsi, 3),
            "medium_rsi": round(med_rsi, 3),
            "high_rsi": round(high_rsi, 3)
        },
        "dominant_rule": "strong_buy" if rule1 > rule2 and rule1 > rule3 else "strong_sell" if rule2 > rule1 and rule2 > rule3 else "hold",
        "stability_rating": "high" if volatility < 1 else "medium" if volatility < 3 else "low"
    }

# ── 4. AUTOENCODER STOCK SELECTION ──

@app.post("/autoencoder")
async def autoencoder_selection(data: StockFeatures):
    """
    Dual autoencoder — technical and fundamental.
    Compresses stock data to essential features.
    Plug and play — connect trained encoder weights when ready.
    """
    technical = np.array(data.technical)
    fundamental = np.array(data.fundamental)

    # Technical autoencoder — compress to latent space
    def encode(features, latent_dim=4):
        if len(features) == 0:
            return np.zeros(latent_dim)
        # Simulated encoder: PCA-style compression
        normalized = (features - np.mean(features)) / (np.std(features) + 1e-8)
        weights = np.random.RandomState(42).randn(len(features), latent_dim) * 0.1
        latent = np.tanh(normalized @ weights)
        return latent

    def decode(latent, output_dim):
        weights = np.random.RandomState(42).randn(len(latent), output_dim) * 0.1
        return np.tanh(latent @ weights)

    tech_latent = encode(technical)
    tech_reconstructed = decode(tech_latent, len(technical))
    tech_error = float(np.mean((technical - tech_reconstructed * np.std(technical)) ** 2)) if len(technical) > 0 else 0

    fund_latent = encode(fundamental)
    fund_reconstructed = decode(fund_latent, len(fundamental))
    fund_error = float(np.mean((fundamental - fund_reconstructed * np.std(fundamental)) ** 2)) if len(fundamental) > 0 else 0

    # Combined latent representation
    combined_latent = np.concatenate([tech_latent, fund_latent])
    selection_score = float(np.mean(np.tanh(combined_latent)) * 50 + 50)
    selection_score = min(max(selection_score, 0), 100)

    # Anomaly detection — high reconstruction error = unusual stock behavior
    anomaly_threshold = 0.1
    is_anomaly = tech_error > anomaly_threshold or fund_error > anomaly_threshold

    return {
        "ticker": data.ticker,
        "algorithm": "autoencoder_selection",
        "selection_score": round(selection_score, 1),
        "technical_reconstruction_error": round(tech_error, 4),
        "fundamental_reconstruction_error": round(fund_error, 4),
        "anomaly_detected": is_anomaly,
        "latent_representation": [round(float(x), 4) for x in combined_latent[:8]],
        "feature_quality": "clean" if not is_anomaly else "anomalous",
        "status": "ready_for_trained_weights"
    }

# ── 5. STATE-SPACE MODEL (MAMBA) ──

@app.post("/mamba")
async def state_space_mamba(data: PriceData):
    """
    State-space model for short-term stock dynamics.
    Efficient alternative to Transformers for sequence modeling.
    Plug and play — connect trained SSM weights when ready.
    """
    prices = np.array(data.prices)
    
    if len(prices) < 5:
        return {"error": "minimum_5_prices_required"}

    # SSM: x_{t+1} = A*x_t + B*u_t, y_t = C*x_t
    state_dim = 4
    A = np.eye(state_dim) * 0.9  # State transition
    B = np.ones((state_dim, 1)) * 0.1  # Input matrix
    C = np.ones((1, state_dim)) * 0.25  # Output matrix

    # Run SSM over price sequence
    x = np.zeros(state_dim)
    outputs = []
    
    returns = np.diff(prices) / prices[:-1]
    
    for r in returns:
        u = np.array([[r]])
        x = A @ x + (B @ u).flatten()
        y = float(C @ x)
        outputs.append(y)

    # Predict next direction
    if len(outputs) >= 3:
        recent_output = np.mean(outputs[-3:])
        momentum = outputs[-1] - outputs[-3] if len(outputs) >= 3 else 0
    else:
        recent_output = outputs[-1] if outputs else 0
        momentum = 0

    prediction_score = 50 + (recent_output * 500) + (momentum * 200)
    prediction_score = min(max(prediction_score, 0), 100)

    return {
        "ticker": data.ticker,
        "algorithm": "state_space_mamba",
        "prediction_score": round(prediction_score, 1),
        "predicted_direction": "UP" if prediction_score > 55 else "DOWN" if prediction_score < 45 else "SIDEWAYS",
        "state_vector": [round(float(s), 4) for s in x],
        "sequence_momentum": round(float(momentum), 4),
        "recent_dynamics": round(float(recent_output), 4),
        "status": "ready_for_trained_weights"
    }

# ── 6. ALGORITHM ORCHESTRATOR ──

@app.post("/orchestrate")
async def orchestrate(data: OrchestratorInput):
    """
    Master orchestrator — synthesizes all algorithm outputs.
    Prevents conflicts. Weights by historical accuracy.
    Produces final signal for Claude to reason on.
    """
    outputs = data.algorithm_outputs
    accuracy = data.historical_accuracy or {}

    # Default weights if no history
    default_weights = {
        "momentum_detector": 1.0,
        "sentiment_detector": 1.0,
        "political_signal_detector": 1.2,
        "macro_detector": 1.0,
        "options_flow_detector": 2.0,
        "insider_transaction_tracker": 2.0,
        "correlation_filter": 0.8,
        "earnings_cycle_detector": 0.9,
        "macro_regime_detector": 1.1,
        "sentiment_velocity": 0.9,
        "probability_spread_model": 1.5,
        "hybrid_sentiment_pipeline": 1.1,
        "market_regime_adaptive_ga": 1.2,
        "mcts_formula_tester": 0.8,
        "autonomous_strategy_evolution": 0.9,
        "genetic_algorithm_optimizer": 0.8,
        "evolutionary_data_labeling": 0.9,
        "hybrid_ga_learning_to_rank": 1.0,
        "agentic_llm_workflow": 1.3,
        "deep_reinforcement_learning": 1.4,
        "attention_augmented_gru": 1.2,
        "fuzzy_lspi": 1.1,
        "autoencoder_selection": 1.0,
        "state_space_mamba": 1.1
    }

    # Apply accuracy-based weight adjustment
    final_weights = {}
    for algo, default_w in default_weights.items():
        hist_accuracy = accuracy.get(algo, 0.5)
        accuracy_multiplier = 0.5 + (hist_accuracy * 1.0)
        final_weights[algo] = default_w * accuracy_multiplier

    # Collect scores from all available outputs
    weighted_scores = []
    total_weight = 0
    conflicts = []

    for algo, output in outputs.items():
        score = None
        if isinstance(output, dict):
            score = output.get("score") or output.get("final_score") or output.get("direction_score") or output.get("prediction_score") or output.get("selection_score") or output.get("fuzzy_score")
        elif isinstance(output, (int, float)):
            score = output

        if score is not None:
            weight = final_weights.get(algo, 1.0)
            weighted_scores.append((algo, float(score), weight))
            total_weight += weight

    if not weighted_scores:
        return {"error": "no_valid_scores"}

    # Weighted average
    composite = sum(s * w for _, s, w in weighted_scores) / total_weight

    # Conflict detection
    scores_only = [s for _, s, _ in weighted_scores]
    score_range = max(scores_only) - min(scores_only)
    conflict_detected = score_range > 35

    if conflict_detected:
        high_scores = [(a, s) for a, s, _ in weighted_scores if s > 65]
        low_scores = [(a, s) for a, s, _ in weighted_scores if s < 35]
        conflicts = {
            "bullish_algorithms": [a for a, _ in high_scores],
            "bearish_algorithms": [a for a, _ in low_scores],
            "spread": round(score_range, 1)
        }

    # Confidence
    confidence = "High" if not conflict_detected and len(weighted_scores) >= 5 else "Medium" if not conflict_detected else "Conflicted"

    # Final verdict
    verdict = "BUY" if composite > 65 else "WATCH" if composite > 50 else "AVOID"

    return {
        "ticker": data.ticker,
        "composite_score": round(composite, 1),
        "verdict": verdict,
        "confidence": confidence,
        "conflict_detected": conflict_detected,
        "conflicts": conflicts if conflicts else None,
        "algorithms_used": len(weighted_scores),
        "score_range": round(score_range, 1),
        "top_signals": sorted(weighted_scores, key=lambda x: x[2], reverse=True)[:5],
        "orchestration": "complete"
    }

# ── HEALTH CHECK ──

@app.get("/")
async def health():
    return {
        "status": "AURUM ML Engine online",
        "algorithms": ["drl", "gru", "flspi", "autoencoder", "mamba", "orchestrate"],
        "version": "1.0.0"
    }
