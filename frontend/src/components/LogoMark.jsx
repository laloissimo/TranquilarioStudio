import React from 'react';

/**
 * Tranquilário logo mark — scalable SVG.
 *   variant="leaf"   → maple leaf resting inside concentric ripple rings
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
  // Stylized 11-point maple leaf (Canadian-style), centered at (32,32) in 64x64 viewBox.
  const mapleLeafPath =
    'M32 14 L34 22 L42 20 L39 28 L49 29 L43 33 L50 37 L40 37 L43 46 L34 42 L32 50 L30 42 L21 46 L24 37 L14 37 L21 33 L15 29 L25 28 L22 20 L30 22 Z';
  const stemPath = 'M32 50 L32 55';

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

      {/* Ripple rings — present in BOTH variants, but count/size differs */}
      {variant === 'ripple' ? (
        <>
          <circle cx="32" cy="32" r={filled ? 29 : 30} stroke={ringColor} strokeOpacity={filled ? 0.35 : 0.9} strokeWidth="1" />
          <circle cx="32" cy="32" r={filled ? 22 : 23} stroke={ringColor} strokeOpacity={filled ? 0.5 : 0.7} strokeWidth="1" />
          <circle cx="32" cy="32" r={filled ? 14 : 15} stroke={ringColor} strokeOpacity={filled ? 0.7 : 0.55} strokeWidth="1" />
          <circle cx="32" cy="32" r={filled ? 6 : 7} stroke={accent} strokeOpacity="0.9" strokeWidth="1.1" />
          <circle cx="32" cy="32" r="1.8" fill={accent} />
        </>
      ) : (
        <>
          {/* Outer ripple */}
          <circle cx="32" cy="32" r={filled ? 29 : 30} stroke={ringColor} strokeOpacity={filled ? 0.32 : 0.9} strokeWidth="1" />
          {/* Inner ripple */}
          <circle cx="32" cy="32" r={filled ? 22 : 24} stroke={ringColor} strokeOpacity={filled ? 0.22 : 0.5} strokeWidth="0.8" />
          {/* Maple leaf */}
          <path
            d={mapleLeafPath}
            fill={filled ? cream : 'none'}
            stroke={filled ? 'none' : accent}
            strokeWidth={filled ? 0 : 1.2}
            strokeLinejoin="round"
          />
          <path
            d={stemPath}
            stroke={filled ? cream : accent}
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          {/* Subtle vein accent in turquoise */}
          <path
            d="M32 24 L32 45"
            stroke={accent}
            strokeOpacity="0.6"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
};

export default LogoMark;
