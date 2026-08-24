/**
 * TokPulse Decentralized Attribution Oracle & Verifiable Receipt Generator
 */

import { createHash, createHmac } from 'crypto';
import { z } from 'zod';

export const AttributionReceiptSchema = z.object({
  receiptId: z.string(),
  orderId: z.string(),
  shopDomain: z.string(),
  creatorId: z.string(),
  orderValueUsd: z.number(),
  commissionEarnedUsd: z.number(),
  timestamp: z.number(),
  proofHash: z.string(),
  oracleSignature: z.string()
});

export type AttributionReceipt = z.infer<typeof AttributionReceiptSchema>;

export class AttributionOracle {
  /**
   * Issue a cryptographically verifiable receipt for a completed creator sale
   */
  public static issueReceipt(
    orderId: string,
    shopDomain: string,
    creatorId: string,
    orderValueUsd: number,
    commissionEarnedUsd: number,
    signingSecret: string = process.env.ORACLE_SECRET || 'tokpulse-oracle-key'
  ): AttributionReceipt {
    const timestamp = Date.now();
    const receiptId = `rcpt_${createHash('sha256').update(`${orderId}:${creatorId}:${timestamp}`).digest('hex').substring(0, 16)}`;
    
    // Create deterministic merkle proof hash
    const proofHash = createHash('sha256')
      .update(`${receiptId}|${orderId}|${shopDomain}|${creatorId}|${orderValueUsd}|${commissionEarnedUsd}|${timestamp}`)
      .digest('hex');

    const oracleSignature = createHmac('sha256', signingSecret)
      .update(proofHash)
      .digest('hex');

    return {
      receiptId,
      orderId,
      shopDomain,
      creatorId,
      orderValueUsd,
      commissionEarnedUsd,
      timestamp,
      proofHash,
      oracleSignature
    };
  }

  /**
   * Verify an attribution receipt's validity
   */
  public static verifyReceipt(receipt: AttributionReceipt, signingSecret: string = process.env.ORACLE_SECRET || 'tokpulse-oracle-key'): boolean {
    const calculatedProofHash = createHash('sha256')
      .update(`${receipt.receiptId}|${receipt.orderId}|${receipt.shopDomain}|${receipt.creatorId}|${receipt.orderValueUsd}|${receipt.commissionEarnedUsd}|${receipt.timestamp}`)
      .digest('hex');

    if (calculatedProofHash !== receipt.proofHash) {
      return false;
    }

    const calculatedSig = createHmac('sha256', signingSecret)
      .update(calculatedProofHash)
      .digest('hex');

    return calculatedSig === receipt.oracleSignature;
  }
}
