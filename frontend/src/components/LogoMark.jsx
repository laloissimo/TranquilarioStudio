import React from 'react';

/**
 * Tranquilário logo mark — a breathing leaf resting inside two concentric rings.
 * Scalable SVG; two modes:
 *   filled=true  → dark disc with cream rings/leaf (for light backgrounds)
 *   filled=false → transparent background with stroked rings & leaf (for dark backgrounds)
 */
export const LogoMark = ({
  size = 44,
  stroke = '#4A5D4E',
  accent = '#5E8B82',
  cream = '#F4F1ED',
  filled = true,
  className = '',
  ...rest
}) => {
  const ringColor = filled ? cream : stroke;
  const leafFill = filled ? cream : 'none';
  const leafStroke = filled ? 'none' : accent;
  const veinColor = accent;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Tranquilário"
      {...rest}
    >
      {filled && <circle cx="32" cy="32" r="31" fill={stroke} />}

      {/* Outer ripple ring */}
      <circle
        cx="32"
        cy="32"
        r={filled ? 28 : 30}
        stroke={ringColor}
        strokeOpacity={filled ? 0.4 : 0.9}
        strokeWidth="1"
      />
      {/* Inner ripple ring */}
      <circle
        cx="32"
        cy="32"
        r={filled ? 22 : 24}
        stroke={ringColor}
        strokeOpacity={filled ? 0.28 : 0.5}
        strokeWidth="0.8"
      />

      {/* Breathing leaf — asymmetric almond, tilted gently to the right */}
      <g transform="rotate(-18 32 32)">
        <path
          d="M32 12
             C 46 18, 48 40, 32 52
             C 16 40, 18 18, 32 12 Z"
          fill={leafFill}
          stroke={leafStroke}
          strokeWidth={filled ? 0 : 1.4}
          strokeLinejoin="round"
        />
        {/* Central midrib — a soft breath line */}
        <path
          d="M32 12 C 33 24, 33 40, 32 52"
          stroke={veinColor}
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          opacity={filled ? 0.85 : 0.9}
        />
        {/* Two side veins */}
        <path
          d="M32 22 C 36 24, 38 27, 40 30"
          stroke={veinColor}
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
          opacity={filled ? 0.55 : 0.6}
        />
        <path
          d="M32 32 C 28 34, 26 37, 24 40"
          stroke={veinColor}
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
          opacity={filled ? 0.55 : 0.6}
        />
      </g>
    </svg>
  );
};

export default LogoMark;
