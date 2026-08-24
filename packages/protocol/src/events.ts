import { z } from 'zod';

/**
 * TokPulse Standard Creator Commerce Event Types
 */
export const CreatorEventType = z.enum([
  'tokpulse.creator.view',
  'tokpulse.creator.click',
  'tokpulse.creator.cart_add',
  'tokpulse.creator.checkout_initiate',
  'tokpulse.creator.purchase',
  'tokpulse.creator.lead',
  'tokpulse.creator.custom',
]);

export type CreatorEventType = z.infer<typeof CreatorEventType>;

/**
 * Open Standard Payload Schema for Creator Events
 */
export const CreatorEventSchema = z.object({
  version: z.literal('1.0.0').default('1.0.0'),
  eventId: z.string().uuid(),
  eventType: CreatorEventType,
  timestamp: z.number().int().positive(),
  source: z.enum([
    'tiktok_shop',
    'shopify_storefront',
    'headless_hydrogen',
    'creator_link',
    'custom',
  ]),
  creator: z.object({
    creatorId: z.string(),
    handle: z.string().optional(),
    campaignId: z.string().optional(),
    referralCode: z.string().optional(),
    platform: z.enum(['tiktok', 'instagram', 'youtube', 'snapchat', 'other']).default('tiktok'),
  }),
  context: z.object({
    shopDomain: z.string(),
    currency: z.string().length(3).default('USD'),
    orderId: z.string().optional(),
    value: z.number().nonnegative().optional(),
    products: z
      .array(
        z.object({
          productId: z.string(),
          variantId: z.string().optional(),
          title: z.string(),
          price: z.number().nonnegative(),
          quantity: z.number().int().positive().default(1),
        }),
      )
      .default([]),
    user: z.object({
      anonymousId: z.string(),
      hashedEmail: z.string().optional(),
      hashedPhone: z.string().optional(),
      userAgent: z.string().optional(),
      ipAddressHash: z.string().optional(),
    }),
  }),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export type CreatorEvent = z.infer<typeof CreatorEventSchema>;
