import React from 'react';

interface BrandLogoProps {
  className?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ className = '' }) => {
  return (
    <span
      className={`inline-block bg-[#d97757] ${className}`}
      style={{
        WebkitMaskImage: 'url(/logo.svg)',
        maskImage: 'url(/logo.svg)',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
      }}
      aria-hidden="true"
    />
  );
};

export default BrandLogo;
