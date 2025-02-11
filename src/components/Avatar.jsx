import React from 'react';
import { useSpring, animated } from '@react-spring/web';

const Avatar = ({ emotion }) => {
  // Face animation for thinking state
  const faceAnimation = useSpring({
    to: {
      transform: emotion === 'thinking' ? 'rotate(5deg)' : 'rotate(0deg)',
    },
  });

  // Eyebrow animations
  const leftEyebrowAnimation = useSpring({
    to: {
      d: emotion === 'thinking'
        ? 'M 45 55 Q 55 50 65 55'
        : emotion === 'happy'
        ? 'M 45 55 Q 55 53 65 55'
        : 'M 45 55 Q 55 55 65 55'
    },
  });

  const rightEyebrowAnimation = useSpring({
    to: {
      d: emotion === 'thinking'
        ? 'M 85 55 Q 95 50 105 55'
        : emotion === 'happy'
        ? 'M 85 55 Q 95 53 105 55'
        : 'M 85 55 Q 95 55 105 55'
    },
  });

  // Mouth animation
  const mouthAnimation = useSpring({
    to: {
      d: emotion === 'happy'
        ? 'M 50 80 Q 75 100 100 80'
        : emotion === 'thinking'
        ? 'M 50 85 Q 75 85 100 85'
        : 'M 50 85 Q 75 80 100 85'
    },
  });

  return (
    <div className="w-full h-full flex items-center justify-center">
      <animated.svg
        viewBox="0 0 150 150"
        style={faceAnimation}
        className="w-64 h-64"
      >
        {/* Face circle */}
        <circle cx="75" cy="75" r="50" fill="#FFD700" />

        {/* Eyebrows */}
        <animated.path
          d={leftEyebrowAnimation.d}
          stroke="#000"
          strokeWidth="2"
          fill="none"
        />
        <animated.path
          d={rightEyebrowAnimation.d}
          stroke="#000"
          strokeWidth="2"
          fill="none"
        />

        {/* Eyes */}
        <circle cx="55" cy="65" r="5" fill="#000" />
        <circle cx="95" cy="65" r="5" fill="#000" />

        {/* Animated mouth */}
        <animated.path
          d={mouthAnimation.d}
          fill="none"
          stroke="#000"
          strokeWidth="3"
        />
      </animated.svg>
    </div>
  );
};

export default Avatar;