import React from 'react';
import { Shield, Globe, Zap } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-ongo-navy text-white overflow-hidden" style={{ minHeight: '60vh' }}>
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 py-16 flex flex-col justify-center items-center h-full">
        {/* Badges */}
        <div className="flex flex-wrap justify-center items-center gap-3 mb-8 ">
          <div className="flex items-center gap-2 bg-ongo-navy-light border border-ongo-yellow/30 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-ongo-yellow rounded-full animate-pulse" />
            <span className="text-ongo-yellow text-sm font-semibold tracking-wide">ENROLLMENT OPEN</span>
          </div>
          <div className="flex items-center gap-2 bg-ongo-navy-light border border-ongo-blue-accent/30 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-ongo-blue-accent rounded-full animate-pulse" />
            <span className="text-ongo-blue-accent text-sm font-semibold tracking-wide">SITE IN PROGRESS</span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-center">
          insureOnGo Launches<br />
          <span className="text-ongo-yellow">November 1, 2026</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl leading-relaxed text-center">
          Faster, smarter, more seamless insurance - built for Nigeria, designed for the world. 
          Enrollment is open now, so you're covered from day one.
        </p>

        {/* What We Are Section */}
        <div className="bg-ongo-navy-light/50 border border-white/10 rounded-lg px-6 py-8 max-w-3xl backdrop-blur-sm">
          <h3 className="text-ongo-yellow text-sm font-bold tracking-widest mb-3 text-center">WHAT WE ARE</h3>
          <p className="text-gray-200 leading-relaxed text-center text-sm">
            A digital insurance distribution and transaction infrastructure connecting consumers, 
            businesses, insurers and embedded-distribution partners through API, web, mobile and 
            conversational channels.
          </p>
        </div>

        {/* Feature Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl">
          <div className="flex items-start gap-3">
            <Shield className="w-8 h-8 text-ongo-yellow flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Trusted Coverage</h4>
              <p className="text-sm text-gray-400">Partnering with licensed insurers</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Globe className="w-8 h-8 text-ongo-yellow flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Global Standards</h4>
              <p className="text-sm text-gray-400">Built for Nigeria, designed for the world</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Zap className="w-8 h-8 text-ongo-yellow flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Instant Activation</h4>
              <p className="text-sm text-gray-400">Get covered from day one</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};