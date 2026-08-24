import React, { useState } from 'react';
import './index.css';

interface Product {
  id: string;
  title: string;
  price: number;
  commissionRate: number;
  category: string;
  imageUrl: string;
  trendingScore: number;
}

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'prod_cyber_earbuds',
    title: 'AeroPulse Wireless ANC Earbuds (Noise Cancelling)',
    price: 69.99,
    commissionRate: 15,
    category: 'Tech / Audio',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&q=80',
    trendingScore: 96
  },
  {
    id: 'prod_studio_light',
    title: 'LuminaPro RGB Magnetic Creator Ring Light',
    price: 49.50,
    commissionRate: 18,
    category: 'Creator Gear',
    imageUrl: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=300&q=80',
    trendingScore: 91
  },
  {
    id: 'prod_hydration_flask',
    title: 'HydroAesthetic Matte Vacuum Smart Tumbler (32oz)',
    price: 34.00,
    commissionRate: 20,
    category: 'Lifestyle / Wellness',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&q=80',
    trendingScore: 88
  }
];

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product>(SAMPLE_PRODUCTS[0]);
  const [hookStrategy, setHookStrategy] = useState<'curiosity_gap' | 'contrarian' | 'problem_solution' | 'unboxing'>('curiosity_gap');
  const [voiceStyle, setVoiceStyle] = useState<'TIKTOK_AESTHETIC_FEMALE' | 'TIKTOK_TRENDING_MALE' | 'ASMR_CLOSEUP'>('TIKTOK_AESTHETIC_FEMALE');
  const [platform, setPlatform] = useState<'tiktok' | 'instagram' | 'youtube'>('tiktok');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedVoiceover, setCopiedVoiceover] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Surge Multiplier calculation (1.5x active on Tech & Creator Gear)
  const surgeMultiplier = (selectedProduct.category === 'Tech / Audio' || selectedProduct.category === 'Creator Gear') ? 1.5 : 1.0;
  const effectiveCommission = selectedProduct.commissionRate * surgeMultiplier;

  const handleGenerateLink = (product: Product) => {
    const timestamp = Date.now();
    const mockToken = btoa(JSON.stringify({ c_id: 'cr_tiktok_alex', p_id: product.id, p_form: platform, ts: timestamp })).substring(0, 16);
    const url = `https://store.tokpulse.com/products/${product.id}?tat=${mockToken}&ref=alexcreates&platform=${platform}&utm_source=${platform}`;
    setGeneratedLink(url);
    setCopiedLink(false);
  };

  const copyToClipboard = (text: string, type: 'link' | 'script' | 'voiceover') => {
    navigator.clipboard.writeText(text);
    if (type === 'script') {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2500);
    } else if (type === 'voiceover') {
      setCopiedVoiceover(true);
      setTimeout(() => setCopiedVoiceover(false), 2500);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const getHookContent = () => {
    switch (hookStrategy) {
      case 'curiosity_gap':
        return {
          hook: "Nobody on social is talking about this $40 gadget, and it's already sold out twice...",
          vpi: 94,
          pacing: "0-3s Hook → 3-12s Reveal & Features → 12-22s ASMR Demo → 22-30s Shop Link CTA",
          scriptBody: [
            `I finally got my hands on the ${selectedProduct.title}.`,
            "The build quality is insane and it outperforms brands 3x the price.",
            `Tap the ${platform === 'tiktok' ? 'orange TikTok Shop cart' : 'link in bio'} before restock runs dry!`
          ],
          veoPrompt: `Cinematic 9:16 vertical 4K macro shot of ${selectedProduct.title}, neon ambient lighting, ASMR unboxing, crisp sound effects, ultra-realistic.`
        };
      case 'contrarian':
        return {
          hook: "Why spending $200 on big-brand gear is the biggest mistake creators are making in 2026.",
          vpi: 91,
          pacing: "0-3s Disruption Hook → 3-15s Direct Comparison → 15-24s Proof → 24-30s Flash Promo CTA",
          scriptBody: [
            `Here's why the ${selectedProduct.title} makes premium alternatives look obsolete.`,
            "Same titanium alloy finish, double the battery life, and half the price.",
            "Claim the flash creator discount with the link below!"
          ],
          veoPrompt: `Split-screen comparison shot 9:16 vertical, sleek modern studio lighting, dynamic camera push-in on ${selectedProduct.title}.`
        };
      case 'problem_solution':
        return {
          hook: "If you struggle with poor audio or lighting in your videos, stop scrolling right now.",
          vpi: 89,
          pacing: "0-2s Pain Point → 2-10s Solution Introduction → 10-20s Before/After → 20-30s Discount CTA",
          scriptBody: [
            `This single tool — the ${selectedProduct.title} — completely transformed my workflow.`,
            "Instant plug-and-play setup with zero latency.",
            "Click below to get your discount with my creator code!"
          ],
          veoPrompt: `Dramatic before-and-after lighting transformation vertical video, high-contrast, lifestyle influencer background.`
        };
      case 'unboxing':
        return {
          hook: "Satisfying ASMR unboxing of the most viral item on social this week ✨",
          vpi: 87,
          pacing: "0-4s Satisfying Peels & Packaging → 4-16s Closeups & Tactile Feedback → 16-30s Live In-Use CTA",
          scriptBody: [
            `Unbox the ${selectedProduct.title} with me.`,
            "That tactile feedback is so satisfying.",
            "Grab yours directly from the link below!"
          ],
          veoPrompt: `Ultra-macro 8K shallow depth of field unboxing, peeling protective film from ${selectedProduct.title}, cozy studio backdrop.`
        };
    }
  };

  const hookData = getHookContent();

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      
      {/* 48-Hour Surge Boost Banner */}
      <div style={{ background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.2) 0%, rgba(139, 92, 246, 0.25) 100%)', border: '1px solid rgba(244, 63, 94, 0.4)', borderRadius: '16px', padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.5rem' }}>⚡</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong style={{ color: '#FDA4AF', fontSize: '1rem' }}>48-Hour Surge Boost Active: 1.5x Multiplier!</strong>
              <span className="badge-glow" style={{ color: '#F43F5E', borderColor: 'rgba(244, 63, 94, 0.3)', background: 'rgba(244, 63, 94, 0.1)' }}>42h Remaining</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2px' }}>
              Earn up to <strong>27% commission</strong> on Tech & Creator Gear sales. Next milestone payout: <strong>+$500 USD bonus</strong> at 100 sales.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="mono-tag" style={{ color: '#10B981' }}>320 / 500 Orders (64% to Diamond Tier)</span>
        </div>
      </div>

      {/* Top Navigation & Profile Header */}
      <header className="glass-panel" style={{ padding: '1.25rem 2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', color: '#fff' }}>
            AC
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Alex Chen</h1>
              <span className="mono-tag" style={{ color: '#C4B5FD' }}>@alexcreates</span>
              <span className="badge-glow badge-success">✓ Verified Partner</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>
              TokPulse Tier: <strong style={{ color: '#fff' }}>Macro Creator</strong> | Base Rate: <strong>15%</strong> | Surge Rate: <strong style={{ color: '#10B981' }}>22.5%</strong>
            </p>
          </div>
        </div>

        {/* Platform Selector Pill */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '4px', border: '1px solid var(--border-subtle)' }}>
          <button 
            className={platform === 'tiktok' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.75rem', padding: '6px 12px', border: 'none' }}
            onClick={() => setPlatform('tiktok')}
          >
            🎵 TikTok
          </button>
          <button 
            className={platform === 'instagram' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.75rem', padding: '6px 12px', border: 'none' }}
            onClick={() => setPlatform('instagram')}
          >
            📸 Instagram
          </button>
          <button 
            className={platform === 'youtube' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.75rem', padding: '6px 12px', border: 'none' }}
            onClick={() => setPlatform('youtube')}
          >
            ▶ YouTube
          </button>
        </div>
      </header>

      {/* Live Metric Cards Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>Attributed Gross Sales (30d)</p>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '0.5rem', color: '#fff' }}>$14,850.00</h2>
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#10B981', fontWeight: '600', fontSize: '0.85rem' }}>↑ +24.5%</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>vs previous period</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>Net Commissions Earned</p>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '0.5rem', color: '#8B5CF6' }}>$2,227.50</h2>
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="badge-glow badge-success" style={{ fontSize: '0.75rem' }}>$1,840.00 Paid</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>$387.50 Pending</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>Attributed Orders & Conversion</p>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '0.5rem', color: '#fff' }}>320 Orders</h2>
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#06B6D4', fontWeight: '600', fontSize: '0.85rem' }}>4.8% CVR</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>(6,650 Clicks)</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>Viral Propensity Score (VPI)</p>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '0.5rem', color: '#10B981' }}>92 / 100</h2>
          <div style={{ marginTop: '0.75rem' }}>
            <span style={{ color: '#A7F3D0', fontSize: '0.8rem' }}>🔥 High Algorithmic Lift Expected</span>
          </div>
        </div>
      </section>

      {/* Main Workspace: AI Script Studio & Affiliate Link Hub */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        
        {/* AI CapCut, Audio & Veo Hook Studio */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ✨ AI Hook, Script & Voiceover Studio
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Automated speech timing, VPI score & video prompts</p>
            </div>
            <span className="badge-glow" style={{ fontSize: '0.8rem' }}>VPI: {hookData.vpi}/100</span>
          </div>

          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Select Hook Angle:</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1rem' }}>
            <button 
              className={hookStrategy === 'curiosity_gap' ? 'btn-primary' : 'btn-secondary'} 
              style={{ fontSize: '0.8rem', padding: '8px' }}
              onClick={() => setHookStrategy('curiosity_gap')}
            >
              Curiosity Gap
            </button>
            <button 
              className={hookStrategy === 'contrarian' ? 'btn-primary' : 'btn-secondary'} 
              style={{ fontSize: '0.8rem', padding: '8px' }}
              onClick={() => setHookStrategy('contrarian')}
            >
              Contrarian Truth
            </button>
            <button 
              className={hookStrategy === 'problem_solution' ? 'btn-primary' : 'btn-secondary'} 
              style={{ fontSize: '0.8rem', padding: '8px' }}
              onClick={() => setHookStrategy('problem_solution')}
            >
              Fast Problem/Fix
            </button>
            <button 
              className={hookStrategy === 'unboxing' ? 'btn-primary' : 'btn-secondary'} 
              style={{ fontSize: '0.8rem', padding: '8px' }}
              onClick={() => setHookStrategy('unboxing')}
            >
              ASMR Aesthetic
            </button>
          </div>

          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>AI Voiceover Style:</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '1.25rem' }}>
            <button 
              className={voiceStyle === 'TIKTOK_AESTHETIC_FEMALE' ? 'btn-primary' : 'btn-secondary'} 
              style={{ fontSize: '0.75rem', padding: '6px' }}
              onClick={() => setVoiceStyle('TIKTOK_AESTHETIC_FEMALE')}
            >
              Bella (Upbeat)
            </button>
            <button 
              className={voiceStyle === 'TIKTOK_TRENDING_MALE' ? 'btn-primary' : 'btn-secondary'} 
              style={{ fontSize: '0.75rem', padding: '6px' }}
              onClick={() => setVoiceStyle('TIKTOK_TRENDING_MALE')}
            >
              Adam (Tech)
            </button>
            <button 
              className={voiceStyle === 'ASMR_CLOSEUP' ? 'btn-primary' : 'btn-secondary'} 
              style={{ fontSize: '0.75rem', padding: '6px' }}
              onClick={() => setVoiceStyle('ASMR_CLOSEUP')}
            >
              Sam (ASMR)
            </button>
          </div>

          {/* Generated Hook & Script Box */}
          <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: '12px', padding: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.06)', marginBottom: '1rem' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#A78BFA', fontWeight: '700', textTransform: 'uppercase' }}>Opening Hook (0–3 Seconds)</span>
              <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#fff', marginTop: '4px' }}>"{hookData.hook}"</p>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Recommended Pacing</span>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '2px' }}>{hookData.pacing}</p>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Script Body & CTA</span>
              <ul style={{ paddingLeft: '1.2rem', marginTop: '4px', fontSize: '0.85rem', color: '#CBD5E1', lineHeight: '1.5' }}>
                {hookData.scriptBody.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#06B6D4', fontWeight: '700', textTransform: 'uppercase' }}>🎥 AI B-Roll Prompt (Veo / Sora / Imagen)</span>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px', fontStyle: 'italic' }}>{hookData.veoPrompt}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn-primary" 
              style={{ flex: 1 }}
              onClick={() => copyToClipboard(`HOOK: ${hookData.hook}\n\nSCRIPT:\n${hookData.scriptBody.join('\n')}\n\nAI B-ROLL PROMPT:\n${hookData.veoPrompt}`, 'script')}
            >
              {copiedScript ? '✓ Copied Script!' : '📋 Copy Script'}
            </button>
            <button 
              className="btn-secondary" 
              style={{ flex: 1 }}
              onClick={() => copyToClipboard(`[SSML Voiceover: ${voiceStyle}]\n<p>[emotion: ${voiceStyle}] ${hookData.hook}</p>\n<p>${hookData.scriptBody.join('</p>\n<p>')}</p>`, 'voiceover')}
            >
              {copiedVoiceover ? '✓ Copied Audio SSML!' : '🎙️ Copy Voiceover TTS'}
            </button>
          </div>
        </div>

        {/* Attribution Link & QR Hub */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>🔗 Tracked Attribution Link Generator</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Generates a tamper-proof <strong>TokPulse Attribution Token (TAT)</strong> link for direct {platform.toUpperCase()} tags.
          </p>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Select Target Product:</label>
            <select 
              value={selectedProduct.id} 
              onChange={(e) => {
                const prod = SAMPLE_PRODUCTS.find(p => p.id === e.target.value) || SAMPLE_PRODUCTS[0];
                setSelectedProduct(prod);
                handleGenerateLink(prod);
              }}
              style={{ width: '100%', background: 'rgba(0, 0, 0, 0.5)', color: '#fff', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '10px', fontSize: '0.9rem' }}
            >
              {SAMPLE_PRODUCTS.map(p => (
                <option key={p.id} value={p.id}>{p.title} (${p.price} | Base: {p.commissionRate}%)</option>
              ))}
            </select>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Effective Commission (With Surge Boost):</span>
              <strong style={{ color: '#10B981', fontSize: '1.1rem' }}>
                ${((selectedProduct.price * effectiveCommission) / 100).toFixed(2)} USD ({effectiveCommission}%)
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Target Platform & Bridge:</span>
              <span className="mono-tag" style={{ color: '#C4B5FD' }}>{platform.toUpperCase()} CAPI Standard</span>
            </div>
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', marginBottom: '1rem' }}
            onClick={() => handleGenerateLink(selectedProduct)}
          >
            ⚡ Generate Verified TAT Link ({platform.toUpperCase()})
          </button>

          {generatedLink && (
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
              <span style={{ fontSize: '0.75rem', color: '#A78BFA', fontWeight: '600' }}>YOUR TRACKING LINK:</span>
              <p className="mono-tag" style={{ wordBreak: 'break-all', marginTop: '6px', fontSize: '0.75rem', color: '#E2E8F0', padding: '8px' }}>
                {generatedLink}
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button 
                  className="btn-primary" 
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem' }}
                  onClick={() => copyToClipboard(generatedLink, 'link')}
                >
                  {copiedLink ? '✓ Copied!' : 'Copy Link'}
                </button>
                <button 
                  className="btn-secondary" 
                  style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                  onClick={() => setShowQr(!showQr)}
                >
                  {showQr ? 'Hide QR' : 'Show QR Code'}
                </button>
              </div>

              {showQr && (
                <div style={{ marginTop: '12px', textAlign: 'center', padding: '1rem', background: '#fff', borderRadius: '8px' }}>
                  <div style={{ width: '140px', height: '140px', margin: '0 auto', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '0.8rem', borderRadius: '4px' }}>
                    [QR: {selectedProduct.id}]
                  </div>
                  <p style={{ color: '#333', fontSize: '0.75rem', marginTop: '6px' }}>Scan for instant mobile checkout</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* High-Commission Product Showcase Catalog */}
      <section className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem' }}>🔥 Trending Catalog & Surge Rates</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {SAMPLE_PRODUCTS.map(product => {
            const surge = (product.category === 'Tech / Audio' || product.category === 'Creator Gear') ? 1.5 : 1.0;
            const rate = product.commissionRate * surge;
            return (
              <div 
                key={product.id} 
                style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span className="badge-glow" style={{ fontSize: '0.7rem' }}>{product.category}</span>
                    <span style={{ color: '#10B981', fontWeight: '700', fontSize: '0.85rem' }}>
                      {rate}% Commission {surge > 1 ? '⚡ Surge' : ''}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#fff', marginBottom: '6px' }}>{product.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Retail Price: <strong style={{ color: '#fff' }}>${product.price.toFixed(2)}</strong> (Earn ${(product.price * rate / 100).toFixed(2)}/sale)
                  </p>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn-primary" 
                    style={{ flex: 1, padding: '8px', fontSize: '0.8rem' }}
                    onClick={() => {
                      setSelectedProduct(product);
                      handleGenerateLink(product);
                    }}
                  >
                    ⚡ Get Link & Script
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Payout History Ledger */}
      <section className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>💳 Payout & Commission History</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '10px' }}>Reference</th>
                <th style={{ padding: '10px' }}>Date</th>
                <th style={{ padding: '10px' }}>Attributed Orders</th>
                <th style={{ padding: '10px' }}>Amount (USD)</th>
                <th style={{ padding: '10px' }}>Method</th>
                <th style={{ padding: '10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <td className="mono-tag" style={{ margin: '6px 0', display: 'inline-block' }}>tx_stp_8921a4f</td>
                <td style={{ padding: '10px' }}>Aug 15, 2026</td>
                <td style={{ padding: '10px' }}>142 orders</td>
                <td style={{ padding: '10px', fontWeight: '700', color: '#10B981' }}>$1,120.00</td>
                <td style={{ padding: '10px' }}>Stripe Direct</td>
                <td style={{ padding: '10px' }}><span className="badge-glow badge-success">✓ PAID</span></td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <td className="mono-tag" style={{ margin: '6px 0', display: 'inline-block' }}>tx_stp_7741c2e</td>
                <td style={{ padding: '10px' }}>Aug 01, 2026</td>
                <td style={{ padding: '10px' }}>98 orders</td>
                <td style={{ padding: '10px', fontWeight: '700', color: '#10B981' }}>$720.00</td>
                <td style={{ padding: '10px' }}>Stripe Direct</td>
                <td style={{ padding: '10px' }}><span className="badge-glow badge-success">✓ PAID</span></td>
              </tr>
              <tr>
                <td className="mono-tag" style={{ margin: '6px 0', display: 'inline-block' }}>tx_pending_batch</td>
                <td style={{ padding: '10px' }}>Current Period</td>
                <td style={{ padding: '10px' }}>80 orders</td>
                <td style={{ padding: '10px', fontWeight: '700', color: '#8B5CF6' }}>$387.50</td>
                <td style={{ padding: '10px' }}>Stripe Direct</td>
                <td style={{ padding: '10px' }}><span className="badge-glow" style={{ color: '#FBBF24', borderColor: 'rgba(251, 191, 36, 0.3)' }}>⏳ PENDING</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
