import React from 'react';
import { Sparkles, ArrowRight, Compass, CheckCircle2, Quote, UserCheck, ShieldAlert, RefreshCw } from 'lucide-react';
import { FaceAnalysisResult, HistoricalEra } from '../types';

interface FaceAnalysisModalProps {
  analysis: FaceAnalysisResult | null;
  isLoading: boolean;
  sourceImage: string;
  onSelectEra: (eraId: string) => void;
  onProceed: () => void;
  onRetake: () => void;
}

export const FaceAnalysisModal: React.FC<FaceAnalysisModalProps> = ({
  analysis,
  isLoading,
  sourceImage,
  onSelectEra,
  onProceed,
  onRetake,
}) => {
  return (
    <div id="face-analysis-view" className="w-full max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-[10px] tracking-[0.35em] uppercase text-[#c5a059] block font-mono">
          GEMINI 3.1 PRO • MORPHOLOGICAL SCAN
        </span>
        <h2 className="text-3xl sm:text-4xl font-light italic font-serif text-[#e2d1c3]">
          Facial Matrix & Epoch Affinity
        </h2>
        <p className="text-xs text-[#e2d1c3]/60 max-w-lg mx-auto font-sans">
          Biometric analysis of cranial proportions, light reflectivity, and aesthetic resonance to discover your period archetypes.
        </p>
      </div>

      {isLoading ? (
        /* Loading skeleton */
        <div className="bg-[#141211] border border-[#e2d1c3]/15 rounded-xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border border-[#c5a059] border-t-transparent animate-spin mx-auto" />
          <h3 className="text-lg font-serif italic text-[#e2d1c3]">
            Decoding Morphological Harmonics with Gemini 3.1 Pro...
          </h3>
          <p className="text-[#e2d1c3]/50 text-xs font-mono max-w-md mx-auto">
            Mapping bone landmarks, gaze vectors, and matching archival temporal records...
          </p>
        </div>
      ) : analysis ? (
        /* Analysis Results Cards */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Photo & Physical Traits */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#141211] border border-[#e2d1c3]/15 rounded-lg p-5 shadow-xl text-center space-y-4">
              <div className="relative aspect-square max-w-[240px] mx-auto rounded-sm overflow-hidden border border-[#c5a059]/60 shadow-2xl bg-[#0d0d0d]">
                <img
                  src={sourceImage}
                  alt="Captured Portrait"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-xs bg-[#0d0d0d]/80 backdrop-blur-md text-[9px] font-mono tracking-widest uppercase text-[#c5a059] border border-[#c5a059]/40">
                  ANCHOR SCANNED
                </div>
              </div>

              <div className="text-left space-y-2.5 pt-3 border-t border-[#e2d1c3]/10 text-xs font-sans">
                <div>
                  <span className="text-[#e2d1c3]/40 font-mono block text-[9px] uppercase tracking-widest">OBSERVED DEMEANOR</span>
                  <p className="text-[#e2d1c3] font-serif italic text-sm">{analysis.detectedExpression}</p>
                </div>
                <div>
                  <span className="text-[#e2d1c3]/40 font-mono block text-[9px] uppercase tracking-widest">FACIAL GEOMETRY & LIGHT VECTORS</span>
                  <p className="text-[#e2d1c3]/70 text-xs leading-relaxed">{analysis.facialStructure}</p>
                </div>
              </div>

              <button
                id="retake-photo-analysis-btn"
                onClick={onRetake}
                className="w-full py-2 rounded-sm bg-[#0d0d0d] hover:bg-[#1a1715] border border-[#e2d1c3]/20 text-[#e2d1c3]/70 hover:text-[#e2d1c3] text-[11px] font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Re-align Anchor Photo</span>
              </button>
            </div>

            {/* Historical Traveler Quote */}
            {analysis.historicalQuote && (
              <div className="bg-[#141211] border border-[#c5a059]/30 rounded-lg p-4 relative">
                <Quote className="w-3.5 h-3.5 text-[#c5a059] mb-1" />
                <p className="text-xs italic text-[#e2d1c3]/90 font-serif leading-relaxed">
                  "{analysis.historicalQuote}"
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Historical Matches & Roles */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Suggested Roles */}
            <div className="bg-[#141211] border border-[#e2d1c3]/15 rounded-lg p-5 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#c5a059] uppercase tracking-widest">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Resonant Epoch Archetypes</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.suggestedHistoricalRoles?.map((role, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xs bg-[#0d0d0d] border border-[#c5a059]/30 text-[#e2d1c3] text-xs font-serif italic shadow-sm"
                  >
                    ✦ {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Top Recommended Eras */}
            <div className="bg-[#141211] border border-[#e2d1c3]/15 rounded-lg p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-[#c5a059] uppercase tracking-widest">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Era Affinity Indices</span>
                </div>
                <span className="text-[9px] text-[#e2d1c3]/40 font-mono tracking-widest">CLICK TO TELEPORT</span>
              </div>

              <div className="space-y-2.5">
                {analysis.recommendedEras?.map((rec, idx) => (
                  <div
                    key={idx}
                    id={`recommended-era-item-${rec.eraId}`}
                    onClick={() => onSelectEra(rec.eraId)}
                    className="group p-3 rounded-sm bg-[#0d0d0d] hover:bg-[#1a1715] border border-[#e2d1c3]/15 hover:border-[#c5a059]/60 transition-all cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-serif italic text-[#e2d1c3] group-hover:text-[#c5a059] transition-colors">
                          {rec.eraTitle}
                        </h4>
                        <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-xs bg-[#141211] text-[#c5a059] border border-[#c5a059]/30">
                          {rec.compatibilityScore}% Affinity
                        </span>
                      </div>
                      <p className="text-xs text-[#e2d1c3]/50 mt-0.5 line-clamp-1 font-sans">
                        {rec.reason}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#e2d1c3]/30 group-hover:text-[#c5a059] group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Period Styling Tip */}
            {analysis.customStylingAdvice && (
              <div className="bg-[#141211] border border-[#e2d1c3]/15 rounded-lg p-4 text-xs text-[#e2d1c3] flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#c5a059] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono uppercase text-[9px] tracking-widest text-[#c5a059] block font-semibold">
                    TEMPORAL INTEGRATION ADVICE
                  </span>
                  <p className="mt-0.5 text-[#e2d1c3]/70 font-sans text-xs leading-relaxed">{analysis.customStylingAdvice}</p>
                </div>
              </div>
            )}

            {/* Proceed Button */}
            <div className="pt-2">
              <button
                id="proceed-to-era-selection-btn"
                onClick={onProceed}
                className="w-full h-12 rounded-sm bg-[#c5a059] hover:bg-[#e2d1c3] text-[#0d0d0d] font-bold text-xs uppercase font-mono tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Select Destination Era & Dispatch</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      ) : null}

    </div>
  );
};
