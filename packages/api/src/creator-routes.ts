/**
 * TokPulse Creator Management, Payouts & Multi-Store Federation API
 */

import { Router, Request, Response, NextFunction } from 'express';
import { createHmac } from 'crypto';
import { CreatorProfile, AttributionToken } from '../../protocol/src';
import { SecurityGuardV2 } from '../../shared/src/security-guard-v2';

export function createCreatorRouter(): Router {
  const router = Router();

  // In-memory persistent creator store for instant execution & demonstration
  const creators: Map<string, CreatorProfile> = new Map([
    [
      'cr_tiktok_alex',
      {
        id: 'cr_tiktok_alex',
        handle: '@alexcreates',
        platform: 'tiktok',
        tier: 'macro',
        niche: ['Tech', 'Gadgets', 'E-Commerce'],
        metrics: {
          totalSalesAttributedUsd: 14850.00,
          totalOrdersAttributed: 320,
          avgOrderValueUsd: 46.40,
          conversionRatePercentage: 4.8,
          viralIndexScore: 92
        },
        commissionRate: 15.0,
        payoutMethod: 'stripe_connect',
        status: 'active',
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    [
      'cr_tiktok_maya',
      {
        id: 'cr_tiktok_maya',
        handle: '@mayalifestyle',
        platform: 'tiktok',
        tier: 'mid',
        niche: ['Home', 'Aesthetic', 'Wellness'],
        metrics: {
          totalSalesAttributedUsd: 6420.50,
          totalOrdersAttributed: 145,
          avgOrderValueUsd: 44.28,
          conversionRatePercentage: 3.9,
          viralIndexScore: 84
        },
        commissionRate: 12.0,
        payoutMethod: 'stripe_connect',
        status: 'active',
        createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  ]);

  // 1. List Creators with Metrics
  router.get('/creators', (req: Request, res: Response) => {
    const list = Array.from(creators.values());
    res.json({
      success: true,
      data: list,
      totalCreators: list.length,
      totalRevenueUsd: list.reduce((acc, c) => acc + c.metrics.totalSalesAttributedUsd, 0)
    });
  });

  // 2. Onboard / Register Creator
  router.post('/creators', (req: Request, res: Response) => {
    const { handle, platform = 'tiktok', commissionRate = 10, niche = [] } = req.body;
    if (!handle) {
      return res.status(400).json({ success: false, error: 'Missing creator handle' });
    }

    const id = `cr_${handle.replace(/[^a-zA-Z0-9]/g, '')}_${Math.random().toString(36).substring(2, 6)}`;
    const newCreator: CreatorProfile = {
      id,
      handle,
      platform,
      tier: 'micro',
      niche,
      metrics: {
        totalSalesAttributedUsd: 0,
        totalOrdersAttributed: 0,
        avgOrderValueUsd: 0,
        conversionRatePercentage: 0,
        viralIndexScore: 50
      },
      commissionRate,
      payoutMethod: 'stripe_connect',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    creators.set(id, newCreator);
    res.status(201).json({ success: true, data: newCreator });
  });

  // 3. Generate Tracked Creator Link with Cryptographic TAT Signature
  router.post('/creators/:id/links', (req: Request, res: Response) => {
    const creator = creators.get(req.params.id);
    if (!creator) {
      return res.status(404).json({ success: false, error: 'Creator not found' });
    }

    const { shopDomain = 'store.tokpulse.com', campaignId = 'spring_launch', targetPath = '/products/viral-trend' } = req.body;
    const secret = process.env.ATTRIBUTION_SIGNING_SECRET || 'tokpulse-tat-secret-key';

    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = issuedAt + (30 * 86400); // 30 days cookie window
    const payloadToSign = `${creator.id}:${shopDomain}:${issuedAt}:${expiresAt}`;
    const sig = createHmac('sha256', secret).update(payloadToSign).digest('hex').substring(0, 16);

    const token: AttributionToken = {
      v: 1,
      c_id: creator.id,
      cmp_id: campaignId,
      sh_dom: shopDomain,
      iat: issuedAt,
      exp: expiresAt,
      sig
    };

    const trackingUrl = `https://${shopDomain}${targetPath}?tat=${encodeURIComponent(JSON.stringify(token))}&ref=${creator.handle.replace('@', '')}`;

    res.json({
      success: true,
      data: {
        creatorId: creator.id,
        handle: creator.handle,
        trackingUrl,
        token
      }
    });
  });

  // 4. Multi-Store Federation Admin Overview
  router.get('/admin/federation', (req: Request, res: Response) => {
    res.json({
      success: true,
      data: {
        totalFederatedStores: 4,
        stores: [
          { shopDomain: 'us-store.hardonia.com', region: 'NA-East', health: 'HEALTHY', activeCreators: 18, monthlyGmvUsd: 142000 },
          { shopDomain: 'uk-store.hardonia.com', region: 'EU-West', health: 'HEALTHY', activeCreators: 12, monthlyGmvUsd: 89000 },
          { shopDomain: 'tokpulse-hydrogen.vercel.app', region: 'Global-Edge', health: 'HEALTHY', activeCreators: 24, monthlyGmvUsd: 215000 },
          { shopDomain: 'tiktok-shop-hardonia-us', region: 'TikTok-US', health: 'HEALTHY', activeCreators: 45, monthlyGmvUsd: 310000 }
        ],
        totalAggregateGmvUsd: 756000,
        realtimeAttributionSyncRate: '99.98%'
      }
    });
  });

  return router;
}
