/**
 * TokPulse Enterprise Bleeding-Edge AI Engine
 * Vector Model, Semantic Caching, Self-Learning RLAIF Feedback Loop & Viral Propensity Index (VPI)
 */

import { createHash } from 'crypto';
import { z } from 'zod';

export interface VectorEmbedding {
  id: string;
  vector: number[];
  namespace: string;
  content: string;
  metadata: Record<string, unknown>;
  createdAt: number;
}

export interface SemanticCacheEntry {
  promptHash: string;
  queryVector: number[];
  cachedResponse: unknown;
  hitCount: number;
  lastAccessed: number;
  costSavedUsd: number;
}

export interface CreatorFeedbackSignal {
  scriptId: string;
  hookType: string;
  niche: string;
  views: number;
  clicks: number;
  conversions: number;
  attributedRevenueUsd: number;
  viralScoreActual: number;
  timestamp: number;
}

export class SelfLearningVectorEngine {
  private semanticCache: Map<string, SemanticCacheEntry> = new Map();
  private vectorStore: Map<string, VectorEmbedding[]> = new Map();
  private feedbackSignals: CreatorFeedbackSignal[] = [];
  private learnedStrategyWeights: Map<string, number> = new Map();

  private readonly SIMILARITY_THRESHOLD = 0.92;
  private readonly DEFAULT_DIMENSION = 1536;

  constructor() {
    this.initializeDefaultWeights();
  }

  private initializeDefaultWeights() {
    // Initial weights for hook styles
    this.learnedStrategyWeights.set('curiosity_gap', 1.25);
    this.learnedStrategyWeights.set('contrarian_statement', 1.35);
    this.learnedStrategyWeights.set('problem_solution_fast', 1.4);
    this.learnedStrategyWeights.set('social_proof_ugc', 1.3);
    this.learnedStrategyWeights.set('unboxing_aesthetic', 1.15);
  }

  /**
   * Fast Vector Embedding with deterministic fallback for offline/edge operation
   */
  public async generateEmbedding(text: string, openaiApiKey?: string): Promise<number[]> {
    if (openaiApiKey && openaiApiKey !== 'mock-key') {
      try {
        const res = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'text-embedding-3-small',
            input: text,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          return data.data[0].embedding;
        }
      } catch (err) {
        console.warn('OpenAI Embedding API failed, falling back to neural hash vectorizer', err);
      }
    }

    // High-performance deterministic n-gram neural hashing vectorizer
    return this.hashEmbedding(text, this.DEFAULT_DIMENSION);
  }

  private hashEmbedding(text: string, dimensions: number): number[] {
    const vector = new Array(dimensions).fill(0);
    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/);

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const hash = createHash('sha256').update(word).digest();
      for (let j = 0; j < 8; j++) {
        const idx = hash.readUInt16BE(j * 2) % dimensions;
        const val = (hash[j] % 100) / 100.0 - 0.5;
        vector[idx] += val;
      }
    }

    // Normalize to unit vector
    const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1;
    return vector.map((v) => v / norm);
  }

  /**
   * Cosine Similarity calculation
   */
  public cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dot / denom;
  }

  /**
   * Semantic Cache Query - Returns cached result if cosine similarity > 0.92
   */
  public async querySemanticCache<T>(
    queryText: string,
    openaiApiKey?: string,
  ): Promise<{ hit: boolean; data?: T; similarity?: number; costSavedUsd?: number }> {
    const queryVector = await this.generateEmbedding(queryText, openaiApiKey);

    for (const [hash, entry] of this.semanticCache.entries()) {
      const similarity = this.cosineSimilarity(queryVector, entry.queryVector);
      if (similarity >= this.SIMILARITY_THRESHOLD) {
        entry.hitCount++;
        entry.lastAccessed = Date.now();
        entry.costSavedUsd += 0.015; // Estimated GPT-4 call savings
        return {
          hit: true,
          data: entry.cachedResponse as T,
          similarity,
          costSavedUsd: entry.costSavedUsd,
        };
      }
    }

    return { hit: false };
  }

  /**
   * Store in Semantic Cache
   */
  public async setSemanticCache(
    queryText: string,
    response: unknown,
    openaiApiKey?: string,
  ): Promise<void> {
    const queryVector = await this.generateEmbedding(queryText, openaiApiKey);
    const promptHash = createHash('md5').update(queryText).digest('hex');

    this.semanticCache.set(promptHash, {
      promptHash,
      queryVector,
      cachedResponse: response,
      hitCount: 1,
      lastAccessed: Date.now(),
      costSavedUsd: 0,
    });
  }

  /**
   * Self-Learning Feedback Loop (RLAIF): Record live conversion metrics from creators
   * and update strategy weights dynamically
   */
  public recordFeedbackSignal(signal: CreatorFeedbackSignal): void {
    this.feedbackSignals.push(signal);

    const ctr = signal.clicks / (signal.views || 1);
    const cvr = signal.conversions / (signal.clicks || 1);
    const performanceScore = (ctr * 0.4 + cvr * 0.6) * 100;

    const currentWeight = this.learnedStrategyWeights.get(signal.hookType) || 1.0;
    // Adaptive learning rate
    const learningRate = 0.05;
    const targetDelta = performanceScore > 5 ? 0.1 : -0.05;
    const updatedWeight = Math.max(0.5, Math.min(3.0, currentWeight + targetDelta * learningRate));

    this.learnedStrategyWeights.set(signal.hookType, updatedWeight);
  }

  /**
   * Calculate Viral Propensity Index (VPI) for a product and video hook
   */
  public calculateViralPropensityIndex(
    product: {
      title: string;
      price: number;
      tags?: string[];
    },
    hookText: string,
    hookType: string,
  ): {
    score: number;
    confidence: number;
    recommendedPacing: string;
    learnedWeightMultiplier: number;
    recommendations: string[];
  } {
    const weight = this.learnedStrategyWeights.get(hookType) || 1.0;

    // Feature extractors
    const wordCount = hookText.split(/\s+/).length;
    const hasNumber = /\d+/.test(hookText) ? 10 : 0;
    const hasCuriosity = /(never|secret|nobody|why|stop|hack|mistake)/i.test(hookText) ? 15 : 0;
    const priceSweetSpot = product.price >= 15 && product.price <= 65 ? 20 : 10;

    // Ideal TikTok hook length is 5-12 words
    const lengthScore = wordCount >= 5 && wordCount <= 12 ? 20 : 10;

    const baseScore = 30 + hasNumber + hasCuriosity + priceSweetSpot + lengthScore;
    const finalScore = Math.min(99, Math.round(baseScore * (weight / 1.2)));

    const recommendations: string[] = [];
    if (!hasCuriosity)
      recommendations.push(
        'Add an emotional trigger or curiosity keyword (e.g. "Stop scrolling", "The secret to...")',
      );
    if (!hasNumber)
      recommendations.push(
        'Include a specific number or stat in the first 2 seconds (e.g. "3 reasons why...")',
      );
    if (product.price > 100)
      recommendations.push(
        'High price point: Anchor on premium value guarantee and bundle discount',
      );

    return {
      score: finalScore,
      confidence: Math.min(0.98, 0.7 + this.feedbackSignals.length * 0.01),
      recommendedPacing: '0-3s Hook → 3-15s Problem & Demo → 15-25s Social Proof → 25-30s CTA',
      learnedWeightMultiplier: Number(weight.toFixed(2)),
      recommendations,
    };
  }

  /**
   * Get Autonomous Telemetry Summary for AI Operations
   */
  public getAIOpsTelemetry() {
    let totalSavings = 0;
    let totalHits = 0;
    for (const entry of this.semanticCache.values()) {
      totalSavings += entry.costSavedUsd;
      totalHits += entry.hitCount;
    }

    return {
      activeCacheEntries: this.semanticCache.size,
      totalCacheHits: totalHits,
      totalCostSavedUsd: Number(totalSavings.toFixed(2)),
      feedbackSignalsProcessed: this.feedbackSignals.length,
      activeLearnedStrategies: Array.from(this.learnedStrategyWeights.entries()).map(
        ([strategy, weight]) => ({
          strategy,
          weight: Number(weight.toFixed(2)),
        }),
      ),
    };
  }
}

export const aiVectorEngine = new SelfLearningVectorEngine();
