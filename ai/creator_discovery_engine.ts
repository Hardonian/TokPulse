/**
 * TokPulse AI Creator Discovery & Autonomous Outreach Engine
 */

export interface CandidateCreator {
  handle: string;
  name: string;
  platform: 'TIKTOK' | 'INSTAGRAM' | 'YOUTUBE';
  followers: number;
  avgViews: number;
  engagementRatePercent: number;
  niche: string[];
  estimatedMonthlyGmvUsd: number;
  matchScore: number; // 0 - 100
}

export interface OutreachPitch {
  creatorHandle: string;
  channel: 'TIKTOK_DM' | 'EMAIL' | 'INSTAGRAM_DM';
  subjectLine?: string;
  pitchBody: string;
  proposedCommissionRate: number;
  freeSampleProductTitle: string;
}

export class CreatorDiscoveryEngine {
  private candidatePool: CandidateCreator[] = [
    {
      handle: '@techtrends_daily',
      name: 'Marcus Bell',
      platform: 'TIKTOK',
      followers: 240000,
      avgViews: 85000,
      engagementRatePercent: 6.4,
      niche: ['Tech', 'Desk Setup', 'Gadgets'],
      estimatedMonthlyGmvUsd: 18500,
      matchScore: 95
    },
    {
      handle: '@glowwithchloe',
      name: 'Chloe Simmons',
      platform: 'TIKTOK',
      followers: 125000,
      avgViews: 42000,
      engagementRatePercent: 7.2,
      niche: ['Beauty', 'Aesthetic', 'Skincare'],
      estimatedMonthlyGmvUsd: 11200,
      matchScore: 91
    },
    {
      handle: '@fitness_hacks_sam',
      name: 'Sam Rodriguez',
      platform: 'INSTAGRAM',
      followers: 310000,
      avgViews: 65000,
      engagementRatePercent: 4.9,
      niche: ['Fitness', 'Hydration', 'Activewear'],
      estimatedMonthlyGmvUsd: 22000,
      matchScore: 88
    }
  ];

  /**
   * Search and rank creators based on merchant catalog niche
   */
  public discoverCandidatesByNiche(nicheKeyword: string): CandidateCreator[] {
    const kw = nicheKeyword.toLowerCase();
    return this.candidatePool.filter(c => 
      c.niche.some(n => n.toLowerCase().includes(kw)) || kw === 'all'
    ).sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Generate AI-personalized outreach email/DM
   */
  public generatePersonalizedPitch(
    candidate: CandidateCreator,
    product: { title: string; price: number },
    brandName: string = 'Hardonia / TokPulse Store'
  ): OutreachPitch {
    const isDM = candidate.platform === 'TIKTOK';

    const pitchBody = isDM 
      ? `Hey ${candidate.name}! Loved your recent ${candidate.niche[0]} video. We’re launching the ${product.title} on TikTok Shop and would love to send you a complimentary unit + give you an exclusive ${candidate.matchScore > 90 ? '18%' : '15%'} affiliate commission per sale. Tap below if you'd like us to ship your sample today! 🚀`
      : `Hi ${candidate.name},\n\nI came across your ${candidate.platform} content in the ${candidate.niche.join(', ')} space and was really impressed by your engagement.\n\nAt ${brandName}, we just dropped the ${product.title} ($${product.price}). We'd love to gift you a sample to test out on your channel with a dedicated tracking link offering an ongoing ${candidate.matchScore > 90 ? '18%' : '15%'} commission.\n\nLet me know your shipping address if you're interested and I'll dispatch it priority!\n\nBest,\nCreator Partnerships Team`;

    return {
      creatorHandle: candidate.handle,
      channel: isDM ? 'TIKTOK_DM' : 'EMAIL',
      subjectLine: isDM ? undefined : `Collaboration with ${brandName} x ${candidate.handle} (Free Sample + 18% Commission)`,
      pitchBody,
      proposedCommissionRate: candidate.matchScore > 90 ? 18 : 15,
      freeSampleProductTitle: product.title
    };
  }
}

export const creatorDiscoveryEngine = new CreatorDiscoveryEngine();
