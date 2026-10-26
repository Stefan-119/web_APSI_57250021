import React, { useState } from 'react';
import ibikkgLogoSrc from '../assets/image_01a9bdac.png';

interface IbikkgLogoProps {
  className?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const IbikkgLogo: React.FC<IbikkgLogoProps> = ({
  className = 'h-full w-full object-contain',
  alt = 'Institut Bisnis dan Informatika Kwik Kian Gie',
}) => {
  const [hasError, setHasError] = useState(false);

  // If the PNG image fails to load (e.g. strict CSP or subpath issue on GitHub Pages),
  // render an academic vector SVG emblem of IBIKKG Kwik Kian Gie
  if (hasError) {
    return (
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={alt}
      >
        {/* Outer Shield / Seal */}
        <circle cx="50" cy="50" r="46" fill="#00288e" stroke="#c4c5d5" strokeWidth="2" />
        <circle cx="50" cy="50" r="40" fill="#ffffff" />
        {/* Academic Diamond / Crest */}
        <polygon points="50,18 78,50 50,82 22,50" fill="#f2f3ff" stroke="#00288e" strokeWidth="2" />
        {/* Monogram IBIKKG */}
        <text
          x="50"
          y="46"
          textAnchor="middle"
          fill="#00288e"
          fontFamily="system-ui, sans-serif"
          fontWeight="800"
          fontSize="16"
          letterSpacing="0.5"
        >
          IBIKKG
        </text>
        <text
          x="50"
          y="62"
          textAnchor="middle"
          fill="#444653"
          fontFamily="Georgia, serif"
          fontWeight="600"
          fontSize="8"
        >
          KWIK KIAN GIE
        </text>
      </svg>
    );
  }

  return (
    <img
      src={ibikkgLogoSrc}
      alt={alt}
      onError={() => setHasError(true)}
      className={className}
      loading="eager"
    />
  );
};
