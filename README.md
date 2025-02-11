# Avatar Chat POC

A proof of concept for an interactive chat avatar system with real-time animation and voice synthesis.

## Security Notice

This project uses API keys for ElevenLabs voice synthesis. To protect your keys:

1. Never commit `.env` files to version control
2. Never share API keys in public forums or chats
3. Regularly rotate your API keys
4. Use different keys for development and production

## Setup

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Add your API key to `.env.local`:
```bash
VITE_ELEVENLABS_API_KEY=your_api_key_here
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

## Features

- Simple animated avatar with basic expressions (happy, neutral, thinking)
- Real-time chat interface
- Expression changes based on conversation context
- Smooth animations using React Spring
- Voice synthesis using ElevenLabs
- Secure API key handling

## Project Structure

- `src/components/Avatar.jsx`: SVG-based animated avatar component
- `src/components/ChatInterface.jsx`: Chat UI component
- `src/utils/elevenlabs.js`: Secure ElevenLabs integration
- `src/utils/config.js`: Secure configuration management
- `src/App.jsx`: Main application component

## Technologies Used

- React
- React Spring for animations
- TailwindCSS for styling
- ElevenLabs for voice synthesis
- Web Crypto API for secure key management

## Security Features

- Encrypted key storage in development
- Environment variable based key management in production
- Key access logging and monitoring
- Automatic cleanup of sensitive data
- Protected API endpoints

## Deployment

For production deployment:

1. Set up environment variables in your hosting platform
2. Never expose API keys in client-side code
3. Use production-grade key management services
4. Enable all security features in your hosting environment

## Next Steps

- Integrate with a language model for real responses
- Add more sophisticated avatar animations
- Implement emotion detection from messages
- Add voice input capabilities
- Enhance security features