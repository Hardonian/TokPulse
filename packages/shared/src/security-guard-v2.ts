/**
 * TokPulse Enterprise Zero-Trust Security & SaaS Tier Gating Engine (v2)
 */

import { createHmac, timingSafeEqual } from 'crypto';

export type SaaSPlanTier = 'FREE' | 'STARTER' | 'GROWTH' | 'SCALE' | 'ENTERPRISE';

export interface PlanLimits {
  maxConnectedStores: number;
  maxCreators: number;
  maxMonthlyCapiEvents: number;
  allowVectorSearch: boolean;
  allowAutonomousSelfHealing: boolean;
  allowMultiStoreFederation: boolean;
  rateLimitRequestsPerMinute: number;
}

export const TIER_LIMITS: Record<SaaSPlanTier, PlanLimits> = {
  FREE: {
    maxConnectedStores: 1,
    maxCreators: 3,
    maxMonthlyCapiEvents: 5_000,
    allowVectorSearch: false,
    allowAutonomousSelfHealing: false,
    allowMultiStoreFederation: false,
    rateLimitRequestsPerMinute: 60,
  },
  STARTER: {
    maxConnectedStores: 2,
    maxCreators: 15,
    maxMonthlyCapiEvents: 25_000,
    allowVectorSearch: true,
    allowAutonomousSelfHealing: false,
    allowMultiStoreFederation: false,
    rateLimitRequestsPerMinute: 300,
  },
  GROWTH: {
    maxConnectedStores: 5,
    maxCreators: 100,
    maxMonthlyCapiEvents: 250_000,
    allowVectorSearch: true,
    allowAutonomousSelfHealing: true,
    allowMultiStoreFederation: false,
    rateLimitRequestsPerMinute: 1_200,
  },
  SCALE: {
    maxConnectedStores: 20,
    maxCreators: 1_000,
    maxMonthlyCapiEvents: 2_000_000,
    allowVectorSearch: true,
    allowAutonomousSelfHealing: true,
    allowMultiStoreFederation: true,
    rateLimitRequestsPerMinute: 5_000,
  },
  ENTERPRISE: {
    maxConnectedStores: 1_000,
    maxCreators: 100_000,
    maxMonthlyCapiEvents: 100_000_000,
    allowVectorSearch: true,
    allowAutonomousSelfHealing: true,
    allowMultiStoreFederation: true,
    rateLimitRequestsPerMinute: 25_000,
  },
};

export interface TenantContext {
  organizationId: string;
  storeId?: string;
  userId?: string;
  planTier: SaaSPlanTier;
  ipAddress?: string;
}

export class SecurityGuardV2 {
  /**
   * Enforce tenant isolation wrapper
   */
  public static createTenantScope(context: TenantContext) {
    if (!context.organizationId || typeof context.organizationId !== 'string') {
      throw new Error('[Security Exception] Missing or invalid organizationId in TenantContext');
    }
    return {
      organizationId: context.organizationId,
      storeId: context.storeId,
      planTier: context.planTier,
      limits: TIER_LIMITS[context.planTier] || TIER_LIMITS.FREE,
    };
  }

  /**
   * Timing-Safe HMAC verification for Webhooks (TikTok & Shopify)
   */
  public static verifyWebhookSignature(
    rawBody: string | Buffer,
    signatureHeader: string,
    secret: string,
    algorithm: 'sha256' | 'sha1' = 'sha256',
  ): boolean {
    try {
      const hmac = createHmac(algorithm, secret);
      const digest = Buffer.from(hmac.update(rawBody).digest('base64'), 'utf8');
      const signature = Buffer.from(signatureHeader, 'utf8');

      if (digest.length !== signature.length) {
        return false;
      }
      return timingSafeEqual(digest, signature);
    } catch {
      return false;
    }
  }

  /**
   * Deep PII Redaction & Secret Sanitizer (GDPR/CCPA Compliance)
   */
  public static sanitizePII(text: string): string {
    return (
      text
        // Email addresses
        .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]')
        // Credit card numbers (Luhn candidate pattern)
        .replace(/\b(?:\d{4}[-\s]?){3}\d{4}\b/g, '[REDACTED_CARD]')
        // US SSN
        .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED_SSN]')
        // Phone numbers
        .replace(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[REDACTED_PHONE]')
        // Bearer / API Tokens
        .replace(
          /(?:bearer|token|apikey|secret)[\s:=]+([a-zA-Z0-9_\-.]{16,})/gi,
          '$1=[REDACTED_SECRET]',
        )
    );
  }

  /**
   * Check feature access against tenant plan
   */
  public static canAccessFeature(planTier: SaaSPlanTier, feature: keyof PlanLimits): boolean {
    const limits = TIER_LIMITS[planTier] || TIER_LIMITS.FREE;
    const value = limits[feature];
    return typeof value === 'boolean' ? value : true;
  }
}
