/**
 * YouTube Shopping & Affiliate Feed Sync Bridge
 */

import { CreatorEvent } from '../../protocol/src';
import { telemetryOrchestrator } from '../../telemetry/src/autonomous-orchestrator';

export interface YouTubeShoppingAttributionRecord {
  videoId?: string;
  channelId?: string;
  creatorHandle: string;
  productTagId: string;
  saleValueUsd: number;
  commissionEarnedUsd: number;
  timestamp: string;
}

export class YouTubeShoppingBridge {
  /**
   * Normalize and log YouTube affiliate attribution
   */
  public async processYouTubeAttribution(event: CreatorEvent): Promise<YouTubeShoppingAttributionRecord | null> {
    if (event.creator.platform !== 'youtube' && !event.metadata?.youtubeVideoId) {
      return null;
    }

    const record: YouTubeShoppingAttributionRecord = {
      videoId: (event.metadata?.youtubeVideoId as string) || 'yt_unknown',
      channelId: (event.metadata?.youtubeChannelId as string) || 'yt_channel',
      creatorHandle: event.creator.handle || '@creator',
      productTagId: event.context.products[0]?.productId || 'prod_default',
      saleValueUsd: event.context.value || 0,
      commissionEarnedUsd: Number(((event.context.value || 0) * 0.12).toFixed(2)),
      timestamp: new Date(event.timestamp).toISOString()
    };

    console.log(`[YouTube Shopping Bridge] Attributed $${record.saleValueUsd} to channel: ${record.creatorHandle}`);
    telemetryOrchestrator.recordMetric('youtube_shopping', 'conversions_tracked', 1);
    return record;
  }
}

export const youtubeShoppingBridge = new YouTubeShoppingBridge();
