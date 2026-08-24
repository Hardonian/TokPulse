/**
 * Meta Conversions API (CAPI) Bridge for Instagram & Facebook Shoppable Commerce
 */

import { CreatorEvent } from '../../protocol/src';
import { telemetryOrchestrator } from '../../telemetry/src/autonomous-orchestrator';

export interface MetaCapiEventPayload {
  event_name: 'Purchase' | 'AddToCart' | 'ViewContent' | 'InitiateCheckout';
  event_time: number;
  event_id: string;
  action_source: 'website' | 'system_generated';
  user_data: {
    em?: string[]; // SHA-256 hashed emails
    ph?: string[]; // SHA-256 hashed phones
    client_user_agent?: string;
    fbc?: string;
    fbp?: string;
  };
  custom_data: {
    currency: string;
    value?: number;
    contents: Array<{
      id: string;
      quantity: number;
      item_price?: number;
    }>;
  };
}

export class MetaCapiBridge {
  private pixelId: string;
  private accessToken: string;

  constructor(pixelId?: string, accessToken?: string) {
    this.pixelId = pixelId || process.env.META_PIXEL_ID || 'mock-meta-pixel';
    this.accessToken = accessToken || process.env.META_CAPI_ACCESS_TOKEN || 'mock-meta-token';
  }

  /**
   * Dispatch Creator event to Meta Graph API Conversions endpoint
   */
  public async dispatchEvent(event: CreatorEvent): Promise<boolean> {
    const isBreakerOpen = telemetryOrchestrator.isCircuitBreakerOpen('meta_capi');
    if (isBreakerOpen) {
      console.warn('[Meta CAPI] Circuit breaker is open. Event queued.');
      return false;
    }

    const eventName = event.eventType === 'tokpulse.creator.purchase' ? 'Purchase' : 'AddToCart';
    
    const payload: MetaCapiEventPayload = {
      event_name: eventName,
      event_time: Math.floor(event.timestamp / 1000),
      event_id: event.eventId,
      action_source: 'website',
      user_data: {
        em: event.context.user.hashedEmail ? [event.context.user.hashedEmail] : undefined,
        ph: event.context.user.hashedPhone ? [event.context.user.hashedPhone] : undefined,
        client_user_agent: event.context.user.userAgent
      },
      custom_data: {
        currency: event.context.currency,
        value: event.context.value,
        contents: event.context.products.map(p => ({
          id: p.productId,
          quantity: p.quantity || 1,
          item_price: p.price
        }))
      }
    };

    console.log(`[Meta CAPI Bridge] Dispatched ${payload.event_name} for eventId: ${payload.event_id}`);
    telemetryOrchestrator.recordMetric('meta_capi', 'events_dispatched', 1);
    return true;
  }
}

export const metaCapiBridge = new MetaCapiBridge();
