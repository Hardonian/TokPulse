import { z } from 'zod';

/**
 * Creator Profile & Performance Metric Standard
 */
export const CreatorProfileSchema = z.object({
  id: z.string(),
  handle: z.string(),
  platform: z.enum(['tiktok', 'instagram', 'youtube', 'other']),
  tier: z.enum(['micro', 'mid', 'macro', 'vip']).default('micro'),
  niche: z.array(z.string()).default([]),
  metrics: z.object({
    totalSalesAttributedUsd: z.number().default(0),
    totalOrdersAttributed: z.number().int().default(0),
    avgOrderValueUsd: z.number().default(0),
    conversionRatePercentage: z.number().default(0),
    viralIndexScore: z.number().min(0).max(100).default(50),
  }),
  commissionRate: z.number().min(0).max(100).default(10), // Percentage
  payoutMethod: z
    .enum(['stripe_connect', 'paypal', 'direct_deposit', 'crypto'])
    .default('stripe_connect'),
  status: z.enum(['active', 'paused', 'pending_kyc', 'suspended']).default('active'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type CreatorProfile = z.infer<typeof CreatorProfileSchema>;
