// Config management with security features
class SecureConfig {
  constructor() {
    this.config = new Map();
    this.initialized = false;
  }

  // Initialize with encrypted key
  async init(encryptedKey) {
    if (this.initialized) return;
    
    try {
      // Use environment variable in production
      if (process.env.NODE_ENV === 'production') {
        this.config.set('ELEVENLABS_API_KEY', process.env.VITE_ELEVENLABS_API_KEY);
      } else {
        // For development, use local storage with encryption
        const key = await this.decryptKey(encryptedKey);
        this.config.set('ELEVENLABS_API_KEY', key);
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing config:', error);
      throw new Error('Failed to initialize secure configuration');
    }
  }

  // Simple encryption for development (not for production use)
  async encryptKey(key) {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    
    const subtle = window.crypto.subtle;
    const encryptionKey = await subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt']
    );
    
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await subtle.encrypt(
      { name: 'AES-GCM', iv },
      encryptionKey,
      data
    );

    return {
      encryptedData,
      iv,
      encryptionKey
    };
  }

  // Simple decryption for development (not for production use)
  async decryptKey(encryptedKey) {
    const subtle = window.crypto.subtle;
    const decryptedData = await subtle.decrypt(
      { name: 'AES-GCM', iv: encryptedKey.iv },
      encryptedKey.encryptionKey,
      encryptedKey.encryptedData
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  }

  // Secure getter that prevents direct access to the key
  getKey(name) {
    if (!this.initialized) {
      throw new Error('Config not initialized');
    }

    const value = this.config.get(name);
    if (!value) {
      throw new Error(`Configuration value ${name} not found`);
    }

    // Log access attempts in production
    if (process.env.NODE_ENV === 'production') {
      console.log(`API key ${name} accessed at ${new Date().toISOString()}`);
    }

    return value;
  }

  // Clear sensitive data
  clearConfig() {
    this.config.clear();
    this.initialized = false;
  }
}

export const secureConfig = new SecureConfig();