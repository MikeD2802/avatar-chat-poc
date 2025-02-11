import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import Avatar from './components/Avatar';
import { elevenLabsInstance } from './utils/elevenlabs';
import { secureConfig } from './utils/config';

function App() {
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [messages, setMessages] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize secure configuration and ElevenLabs
  useEffect(() => {
    const initializeServices = async () => {
      try {
        // In production, this would use environment variables
        // For development, we'll simulate secure key storage
        if (process.env.NODE_ENV === 'development') {
          const { encryptedData, iv, encryptionKey } = await secureConfig.encryptKey(
            import.meta.env.VITE_ELEVENLABS_API_KEY
          );
          await secureConfig.init({ encryptedData, iv, encryptionKey });
        } else {
          await secureConfig.init();
        }

        await elevenLabsInstance.init();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize services:', error);
      }
    };

    initializeServices();

    // Cleanup on unmount
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      elevenLabsInstance.destroy();
      secureConfig.clearConfig();
    };
  }, []);

  const detectEmotion = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('happy') || lowerText.includes('great') || lowerText.includes('awesome')) {
      return 'happy';
    } else if (lowerText.includes('think') || lowerText.includes('how') || lowerText.includes('why')) {
      return 'thinking';
    }
    return 'neutral';
  };

  const playResponse = async (text) => {
    if (!isInitialized) {
      console.error('Services not initialized');
      return;
    }

    try {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      const audio = await elevenLabsInstance.textToSpeech(text);
      setCurrentAudio(audio);
      
      audio.addEventListener('play', () => setIsPlaying(true));
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentEmotion('neutral');
      });
      audio.addEventListener('pause', () => setIsPlaying(false));
      
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  const handleSendMessage = async (message) => {
    if (!isInitialized) {
      console.error('Services not initialized');
      return;
    }

    // Add user message
    setMessages(prev => [...prev, { text: message, sender: 'user' }]);
    
    // Generate and show AI response
    setTimeout(async () => {
      const response = `I understand you said: "${message}". How can I help you further?`;
      setMessages(prev => [...prev, { text: response, sender: 'ai' }]);
      
      // Set emotion based on response
      const emotion = detectEmotion(response);
      setCurrentEmotion(emotion);

      // Play the response using ElevenLabs
      await playResponse(response);
    }, 1000);
  };

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-600">
          Initializing secure services...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="m-auto w-full max-w-4xl p-4 flex gap-4">
        <div className="w-1/2 bg-white rounded-lg shadow-lg p-4">
          <Avatar 
            emotion={currentEmotion} 
            isPlaying={isPlaying}
          />
        </div>
        <div className="w-1/2 bg-white rounded-lg shadow-lg p-4">
          <ChatInterface 
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
}

export default App;