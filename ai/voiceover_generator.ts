/**
 * TokPulse AI Voiceover & Audio Synthesis Studio
 * Formats multi-segment voiceovers with emotion markers and WPM timing for ElevenLabs & OpenAI TTS
 */

import { CapCutScript } from './capcut_script_generator';

export interface VoiceoverSegment {
  segmentIndex: number;
  timeWindow: string;
  emotionTag: 'EXCITED' | 'CONFIDENT_REVIEWER' | 'ASMR_WHISPER' | 'URGENT_FOMO';
  text: string;
  wordCount: number;
  estimatedDurationSeconds: number;
}

export interface VoiceoverProductionPackage {
  scriptHook: string;
  voiceStyle: 'TIKTOK_TRENDING_MALE' | 'TIKTOK_AESTHETIC_FEMALE' | 'ASMR_CLOSEUP';
  voiceId: string;
  targetWpm: number;
  totalDurationSeconds: number;
  segments: VoiceoverSegment[];
  ttsPayloadPreview: {
    model: string;
    voice: string;
    input: string;
    speed: number;
  };
}

export class VoiceoverGenerator {
  private readonly VOICE_PRESETS = {
    TIKTOK_TRENDING_MALE: 'adam_multilingual_v2',
    TIKTOK_AESTHETIC_FEMALE: 'bella_studio_v2',
    ASMR_CLOSEUP: 'sam_whisper_ultra'
  };

  /**
   * Produce a complete voiceover audio production package from a CapCut script
   */
  public generateVoiceoverPackage(
    script: CapCutScript,
    voiceStyle: 'TIKTOK_TRENDING_MALE' | 'TIKTOK_AESTHETIC_FEMALE' | 'ASMR_CLOSEUP' = 'TIKTOK_AESTHETIC_FEMALE'
  ): VoiceoverProductionPackage {
    const segments: VoiceoverSegment[] = [];

    // 1. Hook Segment
    const hookWords = script.hook.split(/\s+/).length;
    segments.push({
      segmentIndex: 1,
      timeWindow: '0.0s - 3.0s',
      emotionTag: voiceStyle === 'ASMR_CLOSEUP' ? 'ASMR_WHISPER' : 'EXCITED',
      text: `[${voiceStyle === 'ASMR_CLOSEUP' ? 'softly' : 'punchy'}] ${script.hook}`,
      wordCount: hookWords,
      estimatedDurationSeconds: Number(((hookWords / 160) * 60).toFixed(1))
    });

    // 2. Body Segments
    script.body.forEach((line, idx) => {
      const words = line.split(/\s+/).length;
      segments.push({
        segmentIndex: idx + 2,
        timeWindow: `${(idx + 1) * 4}s - ${(idx + 2) * 4}s`,
        emotionTag: 'CONFIDENT_REVIEWER',
        text: `[natural] ${line}`,
        wordCount: words,
        estimatedDurationSeconds: Number(((words / 150) * 60).toFixed(1))
      });
    });

    // 3. CTA Segment
    const ctaWords = script.callToAction.split(/\s+/).length;
    segments.push({
      segmentIndex: segments.length + 1,
      timeWindow: '24.0s - 30.0s',
      emotionTag: 'URGENT_FOMO',
      text: `[enthusiastic] ${script.callToAction}`,
      wordCount: ctaWords,
      estimatedDurationSeconds: Number(((ctaWords / 170) * 60).toFixed(1))
    });

    const totalWords = segments.reduce((sum, s) => sum + s.wordCount, 0);
    const totalDuration = segments.reduce((sum, s) => sum + s.estimatedDurationSeconds, 0);

    const formattedSSML = segments.map(s => `<p>${s.text}</p>`).join('\n');

    return {
      scriptHook: script.hook,
      voiceStyle,
      voiceId: this.VOICE_PRESETS[voiceStyle],
      targetWpm: 160,
      totalDurationSeconds: Number(totalDuration.toFixed(1)),
      segments,
      ttsPayloadPreview: {
        model: 'tts-1-hd',
        voice: voiceStyle === 'TIKTOK_TRENDING_MALE' ? 'onyx' : 'nova',
        input: formattedSSML,
        speed: 1.05
      }
    };
  }
}

export const voiceoverGenerator = new VoiceoverGenerator();
