import React from 'react';

interface GradientAvatarProps {
  uid: string;
  size?: number;
}

// djb2 hash function for better distribution
function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) + str.charCodeAt(i);
  }
  return hash;
}

const GradientAvatar: React.FC<GradientAvatarProps> = ({ uid, size = 40 }) => {
  // Use djb2 to compute a hash
  const hashValue = djb2(uid);
  // Ensure a positive base hue
  const baseHue = ((hashValue % 360) + 360) % 360;
  // Derive additional hues for a smooth gradient
  const hue2 = (baseHue + 30) % 360;
  const hue3 = (baseHue + 60) % 360;

  // Create a linear gradient from the three hues
  const gradient = `linear-gradient(135deg, hsl(${baseHue}, 70%, 50%), hsl(${hue2}, 70%, 50%), hsl(${hue3}, 70%, 50%))`;

  return (
    <div
      className="flex-shrink-0 rounded-full"
      style={{ width: size, height: size, background: gradient }}
    />
  );
};

export default GradientAvatar;
