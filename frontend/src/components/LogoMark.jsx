import React from 'react';

/**
 * Tranquilário logo mark — two variants:
 *   variant="leaf"   → breathing leaf inside concentric rings
 *   variant="ripple" → concentric rings only (stillness / pebble-in-water)
 *
 * filled=true  → dark disc with cream rings/leaf (for light backgrounds)
 * filled=false → transparent, stroked for dark backgrounds
 */
export const LogoMark = ({
  size = 44,
  stroke = '#4A5D4E',
  accent = '#5E8B82',
  cream = '#F4F1ED',
  filled = true,
  variant = 'leaf',
  className = '',
  ...rest
}) => {
  const ringColor = filled ? cream : stroke;

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

      {variant === 'ripple' ? (
        <>
          {/* Ripple: three concentric rings radiating from center, with a small dot nucleus */}
          <circle cx="32" cy="32" r={filled ? 29 : 30} stroke={ringColor} strokeOpacity={filled ? 0.35 : 0.9} strokeWidth="1" />
          <circle cx="32" cy="32" r={filled ? 22 : 23} stroke={ringColor} strokeOpacity={filled ? 0.5 : 0.7} strokeWidth="1" />
          <circle cx="32" cy="32" r={filled ? 14 : 15} stroke={ringColor} strokeOpacity={filled ? 0.7 : 0.55} strokeWidth="1" />
          <circle cx="32" cy="32" r={filled ? 6 : 7} stroke={accent} strokeOpacity="0.9" strokeWidth="1.1" />
          <circle cx="32" cy="32" r="1.8" fill={accent} />
        </>
      ) : (
        <>
          {/* Leaf variant */}
          <circle cx="32" cy="32" r={filled ? 28 : 30} stroke={ringColor} strokeOpacity={filled ? 0.4 : 0.9} strokeWidth="1" />
          <circle cx="32" cy="32" r={filled ? 22 : 24} stroke={ringColor} strokeOpacity={filled ? 0.28 : 0.5} strokeWidth="0.8" />
          <g transform="rotate(-18 32 32)">
            <path
              d="M32 12 C 46 18, 48 40, 32 52 C 16 40, 18 18, 32 12 Z"
              fill={filled ? cream : 'none'}
              stroke={filled ? 'none' : accent}
              strokeWidth={filled ? 0 : 1.4}
              strokeLinejoin="round"
            />
            <path d="M32 12 C 33 24, 33 40, 32 52" stroke={accent} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity={filled ? 0.85 : 0.9} />
            <path d="M32 22 C 36 24, 38 27, 40 30" stroke={accent} strokeWidth="0.8" strokeLinecap="round" fill="none" opacity={filled ? 0.55 : 0.6} />
            <path d="M32 32 C 28 34, 26 37, 24 40" stroke={accent} strokeWidth="0.8" strokeLinecap="round" fill="none" opacity={filled ? 0.55 : 0.6} />
          </g>
        </>
      )}
    </svg>
  );
};

export default LogoMark;
