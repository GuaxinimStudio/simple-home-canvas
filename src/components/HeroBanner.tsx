
import React from 'react';

type HeroBannerProps = {
  title: string;
  subtitle: string;
  backgroundImage?: string;
};

const HeroBanner: React.FC<HeroBannerProps> = ({ title, subtitle, backgroundImage }) => {
  return (
    <div 
      className="w-full rounded-lg overflow-hidden bg-gray-900 relative"
      style={{ 
        height: '240px',
        backgroundImage: backgroundImage 
          ? `url(${backgroundImage})` 
          : 'linear-gradient(90deg, #0f172a, #1e293b)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/40 flex flex-col justify-center p-8">
        <div className="border-l-4 border-resolve-green pl-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-1.5 bg-yellow-500/20 rounded-full">
              <div className="w-5 h-5 rounded-full bg-yellow-500"></div>
            </div>
            <h1 className="text-3xl font-bold text-white">{title}</h1>
          </div>
          <p className="text-white/80">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
