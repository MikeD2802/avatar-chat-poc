import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import Avatar from './components/Avatar';

function App() {
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [messages, setMessages] = useState([]);

  const handleSendMessage = async (message) => {
    // Add user message
    setMessages(prev => [...prev, { text: message, sender: 'user' }]);
    
    // Simulate AI response and emotion
    setTimeout(() => {
      // Simple emotion detection based on keywords
      let emotion = 'neutral';
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('happy') || lowerMessage.includes('great') || lowerMessage.includes('awesome')) {
        emotion = 'happy';
      } else if (lowerMessage.includes('think') || lowerMessage.includes('how') || lowerMessage.includes('why')) {
        emotion = 'thinking';
      }

      setCurrentEmotion(emotion);

      // Generate simple response
      const response = `I understand you said: "${message}". How can I help you further?`;
      setMessages(prev => [...prev, { text: response, sender: 'ai' }]);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="m-auto w-full max-w-4xl p-4 flex gap-4">
        <div className="w-1/2 bg-white rounded-lg shadow-lg p-4">
          <Avatar emotion={currentEmotion} />
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