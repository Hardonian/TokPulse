/**
 * TokPulse Enterprise Pricing, Metering & Monetization Engine
 */

export interface PricingPlan {
  id: string;
  name: string;
  priceMonthlyUsd: number;
  priceAnnualUsd: number;
  stripePriceIdMonthly?: string;
  stripePriceIdAnnual?: string;
  shopifyPlanHandle: string;
  features: {
    maxStores: number;
    maxCreators: number;
    monthlyCapiEventsIncluded: number;
    overageRatePer1kCapiUsd: number;
    vectorSemanticSearch: boolean;
    autonomousSelfHealing: boolean;
    multiStoreFederation: boolean;
    supportSla: 'COMMUNITY' | 'STANDARD' | 'PRIORITY' | 'DEDICATED_24_7';
  };
}

export const COMMERCIAL_PLANS: Record<string, PricingPlan> = {
  FREE: {
    id: 'plan_free',
    name: 'Free Community',
    priceMonthlyUsd: 0,
    priceAnnualUsd: 0,
    shopifyPlanHandle: 'tokpulse_free',
    features: {
      maxStores: 1,
      maxCreators: 3,
      monthlyCapiEventsIncluded: 5_000,
      overageRatePer1kCapiUsd: 0,
      vectorSemanticSearch: false,
      autonomousSelfHealing: false,
      multiStoreFederation: false,
      supportSla: 'COMMUNITY'
    }
  },
  STARTER: {
    id: 'plan_starter',
    name: 'Creator Starter',
    priceMonthlyUsd: 29,
    priceAnnualUsd: 290,
    stripePriceIdMonthly: 'price_starter_monthly',
    stripePriceIdAnnual: 'price_starter_annual',
    shopifyPlanHandle: 'tokpulse_starter_29',
    features: {
      maxStores: 2,
      maxCreators: 15,
      monthlyCapiEventsIncluded: 25_000,
      overageRatePer1kCapiUsd: 1.50,
      vectorSemanticSearch: true,
      autonomousSelfHealing: false,
      multiStoreFederation: false,
      supportSla: 'STANDARD'
    }
  },
  GROWTH: {
    id: 'plan_growth',
    name: 'Shopify Growth',
    priceMonthlyUsd: 99,
    priceAnnualUsd: 990,
    stripePriceIdMonthly: 'price_growth_monthly',
    stripePriceIdAnnual: 'price_growth_annual',
    shopifyPlanHandle: 'tokpulse_growth_99',
    features: {
      maxStores: 5,
      maxCreators: 100,
      monthlyCapiEventsIncluded: 250_000,
      overageRatePer1kCapiUsd: 1.00,
      vectorSemanticSearch: true,
      autonomousSelfHealing: true,
      multiStoreFederation: false,
      supportSla: 'PRIORITY'
    }
  },
  SCALE: {
    id: 'plan_scale',
    name: 'Enterprise Scale',
    priceMonthlyUsd: 299,
    priceAnnualUsd: 2990,
    stripePriceIdMonthly: 'price_scale_monthly',
    stripePriceIdAnnual: 'price_scale_annual',
    shopifyPlanHandle: 'tokpulse_scale_299',
    features: {
      maxStores: 20,
      maxCreators: 1_000,
      monthlyCapiEventsIncluded: 2_000_000,
      overageRatePer1kCapiUsd: 0.75,
      vectorSemanticSearch: true,
      autonomousSelfHealing: true,
      multiStoreFederation: true,
      supportSla: 'DEDICATED_24_7'
    }
  }
};

export class PricingEngine {
  /**
   * Calculate total monthly invoice including overage usage
   */
  public calculateMonthlyInvoice(planId: string, eventsUsed: number): {
    basePriceUsd: number;
    eventsUsed: number;
    eventsIncluded: number;
    overageEvents: number;
    overageCostUsd: number;
    totalDueUsd: number;
  } {
    const plan = COMMERCIAL_PLANS[planId.toUpperCase()] || COMMERCIAL_PLANS.FREE;
    const basePriceUsd = plan.priceMonthlyUsd;
    const eventsIncluded = plan.features.monthlyCapiEventsIncluded;
    const overageEvents = Math.max(0, eventsUsed - eventsIncluded);
    const overageCostUsd = Number(((overageEvents / 1000) * plan.features.overageRatePer1kCapiUsd).toFixed(2));
    const totalDueUsd = Number((basePriceUsd + overageCostUsd).toFixed(2));

    return {
      basePriceUsd,
      eventsUsed,
      eventsIncluded,
      overageEvents,
      overageCostUsd,
      totalDueUsd
    };
  }

  /**
   * Generate Shopify App Recurring Subscription GraphQL Mutation
   */
  public generateShopifySubscriptionMutation(planKey: string, returnUrl: string) {
    const plan = COMMERCIAL_PLANS[planKey.toUpperCase()] || COMMERCIAL_PLANS.GROWTH;
    return {
      query: `
        mutation AppSubscriptionCreate($name: String!, $returnUrl: URL!, $lineItems: [AppSubscriptionLineItemInput!]!) {
          appSubscriptionCreate(name: $name, returnUrl: $returnUrl, lineItems: $lineItems) {
            userErrors {
              field
              message
            }
            confirmationUrl
            appSubscription {
              id
              status
            }
          }
        }
      `,
      variables: {
        name: `TokPulse ${plan.name}`,
        returnUrl,
        lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                price: {
                  amount: plan.priceMonthlyUsd,
                  currencyCode: 'USD'
                },
                interval: 'EVERY_30_DAYS'
              }
            }
          }
        ]
      }
    };
  }
}

export const pricingEngine = new PricingEngine();
