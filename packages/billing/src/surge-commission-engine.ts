/**
 * TokPulse Surge Commission Multipliers & Creator Gamification Engine
 */

export interface SurgeEvent {
  id: string;
  name: string;
  multiplier: number; // e.g. 1.5 for 50% commission boost
  startDate: number;
  endDate: number;
  isActive: boolean;
  eligibleCategories: string[];
}

export interface CreatorMilestone {
  salesThreshold: number;
  bonusPayoutUsd: number;
  badgeName: string;
  achieved: boolean;
}

export class SurgeCommissionEngine {
  private activeSurges: SurgeEvent[] = [
    {
      id: 'surge_tiktok_flash_2026',
      name: '48-Hour TikTok Restock Boost',
      multiplier: 1.5,
      startDate: Date.now() - 3600000,
      endDate: Date.now() + 172800000, // 48 hours remaining
      isActive: true,
      eligibleCategories: ['Tech / Audio', 'Creator Gear']
    }
  ];

  /**
   * Calculate adjusted commission rate factoring in active surge events
   */
  public calculateEffectiveRate(baseRate: number, category: string): {
    effectiveRate: number;
    hasSurgeApplied: boolean;
    surgeMultiplier: number;
    surgeName?: string;
    expiresInHours?: number;
  } {
    const now = Date.now();
    const activeSurge = this.activeSurges.find(s => 
      s.isActive && now >= s.startDate && now <= s.endDate &&
      (s.eligibleCategories.includes(category) || s.eligibleCategories.includes('ALL'))
    );

    if (activeSurge) {
      const effectiveRate = Number((baseRate * activeSurge.multiplier).toFixed(2));
      const hoursRemaining = Math.max(0, Math.round((activeSurge.endDate - now) / 3600000));
      return {
        effectiveRate,
        hasSurgeApplied: true,
        surgeMultiplier: activeSurge.multiplier,
        surgeName: activeSurge.name,
        expiresInHours: hoursRemaining
      };
    }

    return {
      effectiveRate: baseRate,
      hasSurgeApplied: false,
      surgeMultiplier: 1.0
    };
  }

  /**
   * Check and calculate milestone achievement bonuses
   */
  public evaluateMilestones(totalOrders: number): {
    milestones: CreatorMilestone[];
    nextMilestoneRemaining: number;
    totalEarnedBonusUsd: number;
  } {
    const allMilestones: Array<{ threshold: number; bonus: number; badge: string }> = [
      { threshold: 25, bonus: 100, badge: '🚀 Bronze Launcher' },
      { threshold: 100, bonus: 500, badge: '🔥 Silver Momentum' },
      { threshold: 500, bonus: 2000, badge: '💎 Diamond Rainmaker' }
    ];

    let totalBonus = 0;
    let nextThreshold = 25;

    const evaluated = allMilestones.map(m => {
      const achieved = totalOrders >= m.threshold;
      if (achieved) {
        totalBonus += m.bonus;
      } else if (nextThreshold === 25 || m.threshold < nextThreshold) {
        nextThreshold = m.threshold;
      }
      return {
        salesThreshold: m.threshold,
        bonusPayoutUsd: m.bonus,
        badgeName: m.badge,
        achieved
      };
    });

    const unachieved = allMilestones.find(m => totalOrders < m.threshold);
    const nextMilestoneRemaining = unachieved ? unachieved.threshold - totalOrders : 0;

    return {
      milestones: evaluated,
      nextMilestoneRemaining,
      totalEarnedBonusUsd: totalBonus
    };
  }
}

export const surgeCommissionEngine = new SurgeCommissionEngine();
