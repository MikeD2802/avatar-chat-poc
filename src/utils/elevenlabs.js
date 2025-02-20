import { secureConfig } from './config';

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

export class ElevenLabsAPI {
  constructor() {
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    
    try {
      this.apiKey = await secureConfig.getKey('ELEVENLABS_API_KEY');
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize ElevenLabs API:', error);
      throw new Error('ElevenLabs API initialization failed');
    }
  }

  async validateAccess() {
    if (!this.initialized) {
      await this.init();
    }
  }

  async textToSpeech(text, voiceId = 'ThT5KcBeYPX3keUQqHPh') {
    await this.validateAccess();

    try {
      const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      return new Audio(URL.createObjectURL(audioBlob));
    } catch (error) {
      console.error('Error in text-to-speech:', error);
      throw error;
    }
  }

  async getVoices() {
    await this.validateAccess();

    try {
      const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching voices:', error);
      throw error;
    }
  }

  // Clean up and clear sensitive data
  destroy() {
    this.apiKey = null;
    this.initialized = false;
  }
}

// Create a singleton instance
export const elevenLabsInstance = new ElevenLabsAPI();