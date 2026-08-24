import { z } from 'zod';
import { aiVectorEngine } from './self_learning_vector_engine';

export const CapCutScriptSchema = z.object({
  hook: z.string(),
  hookType: z.enum([
    'curiosity_gap',
    'contrarian_statement',
    'problem_solution_fast',
    'social_proof_ugc',
    'unboxing_aesthetic',
  ]),
  body: z.array(z.string()),
  callToAction: z.string(),
  visualPrompts: z.array(z.string()),
  viralPropensityScore: z.number().min(0).max(100),
  estimatedPacing: z.string(),
  optimizationRecommendations: z.array(z.string()),
  cached: z.boolean().default(false),
});

export type CapCutScript = z.infer<typeof CapCutScriptSchema>;

export class CapCutScriptGenerator {
  /**
   * Generates a CapCut-ready script with VPI scoring and Semantic Caching
   */
  async generateScriptForProduct(
    productData: {
      id?: string;
      title: string;
      description?: string;
      price: number;
      tags?: string[];
    },
    hookType:
      | 'curiosity_gap'
      | 'contrarian_statement'
      | 'problem_solution_fast'
      | 'social_proof_ugc'
      | 'unboxing_aesthetic' = 'problem_solution_fast',
  ): Promise<CapCutScript> {
    const cacheKey = `script:${productData.title}:${hookType}:${productData.price}`;

    // 1. Check Semantic Cache
    const cached = await aiVectorEngine.querySemanticCache<CapCutScript>(cacheKey);
    if (cached.hit && cached.data) {
      return {
        ...cached.data,
        cached: true,
      };
    }

    // 2. Generate hook variations and evaluate Viral Propensity
    let hookText = 'Stop wasting time with ordinary products — this changes everything.';
    if (hookType === 'curiosity_gap') {
      hookText = "Nobody is talking about this $20 TikTok secret, and it's almost sold out.";
    } else if (hookType === 'contrarian_statement') {
      hookText = "Why everything you've been told about this is completely wrong.";
    } else if (hookType === 'social_proof_ugc') {
      hookText =
        "I tested 10 different brands so you don't have to — here's the undisputed winner.";
    } else if (hookType === 'unboxing_aesthetic') {
      hookText = 'Unbox the viral item everyone has in their cart right now.';
    }

    const vpi = aiVectorEngine.calculateViralPropensityIndex(productData, hookText, hookType);

    const script: CapCutScript = {
      hook: hookText,
      hookType,
      body: [
        `Look at how effortlessly the ${productData.title} works in real life.`,
        'Engineered for maximum performance without the ridiculous markup.',
        "Over 10,000 verified 5-star customer reviews can't be wrong.",
      ],
      callToAction: `Tap the TikTok Shop link below to claim the flash sale before inventory runs out!`,
      visualPrompts: [
        `Dynamic hyper-crisp macro close-up of ${productData.title} being unboxed with ASMR audio`,
        `Real-life usage split-screen demonstration showing immediate results`,
        `Fast-paced cuts of product details with bold captions and upbeat trending TikTok audio`,
        `Final hero shot with price banner and animated tap-to-buy arrow`,
      ],
      viralPropensityScore: vpi.score,
      estimatedPacing: vpi.recommendedPacing,
      optimizationRecommendations: vpi.recommendations,
      cached: false,
    };

    // 3. Save to Semantic Cache
    await aiVectorEngine.setSemanticCache(cacheKey, script);

    return script;
  }

  /**
   * Generates hyper-detailed prompts for video models like Google Veo or OpenAI Sora / Imagen 3
   */
  async generateVideoPrompts(script: CapCutScript): Promise<string[]> {
    return script.visualPrompts.map(
      (vp, index) =>
        `Cinematic 8k shot [Scene ${index + 1}], ultra-realistic lighting, TikTok vertical 9:16 aspect ratio, trending aesthetic, shallow depth of field: ${vp}`,
    );
  }
}

export const capCutScriptGenerator = new CapCutScriptGenerator();
