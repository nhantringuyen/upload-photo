import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, Clock, Loader2 } from 'lucide-react';
import { HistoricalEra, SceneOption } from '../types';

interface GeneratingStateProps {
  era: HistoricalEra;
  scene: SceneOption;
  passengerName: string;
}

export const GeneratingState: React.FC<GeneratingStateProps> = ({
  era,
  scene,
  passengerName,
}) => {
  const [logIndex, setLogIndex] = useState(0);

  const logs = [
    `Initializing Chrono-Flux displacement drive to ${era.year}...`,
    `Analyzing source facial landmarks, eye level, and jawline...`,
    `Synthesizing period-accurate ${era.title} attire and textiles...`,
    `Rendering scene: "${scene.name}"...`,
    `Harmonizing lighting vectors with authentic ${era.artStyle}...`,
    `Applying temporal cohesion matrix and finishing historical print...`,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % logs.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [logs.length]);

  return (
    <div id="generating-temporal-state" className="w-full max-w-2xl mx-auto text-center py-12 px-4 space-y-8 animate-in fade-in">
      
      {/* Animated Chrono Vortex */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto flex items-center justify-center">
        
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border border-dashed border-[#c5a059]/40 animate-[spin_20s_linear_infinite]" />
        
        {/* Middle Ring */}
        <div className="absolute inset-4 rounded-full border border-[#e2d1c3]/30 border-t-[#c5a059] animate-[spin_8s_linear_infinite_reverse]" />
        
        {/* Inner Glowing Core */}
        <div className="absolute inset-10 rounded-full bg-[#141211] border border-[#c5a059]/50 backdrop-blur-sm flex items-center justify-center shadow-[0_0_50px_rgba(197,160,89,0.2)]">
          <Compass className="w-12 h-12 text-[#c5a059] animate-[spin_6s_ease-in-out_infinite]" />
        </div>

        {/* Floating Sparks */}
        <Sparkles className="absolute top-2 right-4 w-4 h-4 text-[#c5a059] animate-bounce" />
        <Sparkles className="absolute bottom-4 left-2 w-3.5 h-3.5 text-[#e2d1c3]/60 animate-pulse" />
      </div>

      {/* Status Messages */}
      <div className="space-y-3">
        <span className="text-[10px] tracking-[0.35em] uppercase text-[#c5a059] block font-mono">
          TEMPORAL DISPLACEMENT ACTIVE • {era.year}
        </span>

        <h3 className="text-3xl sm:text-4xl font-serif italic text-[#e2d1c3]">
          Synthesizing {passengerName || 'Subject'} in {era.title}
        </h3>

        <div className="h-8 flex items-center justify-center">
          <p className="text-xs font-mono tracking-wider text-[#c5a059] transition-all duration-300">
            {logs[logIndex]}
          </p>
        </div>
      </div>

      {/* Historical Facts / Briefing Box */}
      <div className="bg-[#141211] border border-[#e2d1c3]/15 rounded-sm p-4 max-w-lg mx-auto text-left shadow-xl">
        <div className="flex items-center gap-2 text-[#e2d1c3]/50 text-[10px] font-mono tracking-widest uppercase mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-ping" />
          <span>HISTORICAL CONTEXT:</span>
        </div>
        <p className="text-xs text-[#e2d1c3]/80 italic font-serif leading-relaxed">
          "{era.detailedContext}"
        </p>
      </div>

    </div>
  );
};
