import { z } from 'zod';

/**
 * TokPulse Attribution Token (TAT) Specification
 * Cryptographically verifiable token for decentralized creator tracking
 */
export const AttributionTokenSchema = z.object({
  v: z.literal(1).default(1),
  c_id: z.string(), // Creator ID
  cmp_id: z.string().optional(), // Campaign ID
  sh_dom: z.string(), // Shop Domain
  iat: z.number().int().positive(), // Issued at
  exp: z.number().int().positive(), // Expires at
  sig: z.string(), // HMAC-SHA256 signature
  meta: z.record(z.string(), z.string()).optional(),
});

export type AttributionToken = z.infer<typeof AttributionTokenSchema>;

/**
 * TikTok Conversions API (CAPI) Standard Bridge Payload
 */
export const TikTokCapiPayloadSchema = z.object({
  pixel_code: z.string(),
  event: z.string(),
  event_id: z.string(),
  timestamp: z.string(),
  context: z.object({
    ad: z
      .object({
        callback: z.string().optional(),
        campaign_id: z.string().optional(),
      })
      .optional(),
    page: z
      .object({
        url: z.string().url(),
        referrer: z.string().optional(),
      })
      .optional(),
    user: z.object({
      email: z.string().optional(),
      phone_number: z.string().optional(),
      ttp: z.string().optional(),
      external_id: z.string().optional(),
    }),
  }),
  properties: z.object({
    currency: z.string().default('USD'),
    value: z.number().optional(),
    content_type: z.string().default('product'),
    contents: z
      .array(
        z.object({
          content_id: z.string(),
          content_name: z.string().optional(),
          price: z.number().optional(),
          quantity: z.number().optional(),
        }),
      )
      .default([]),
  }),
});

export type TikTokCapiPayload = z.infer<typeof TikTokCapiPayloadSchema>;
