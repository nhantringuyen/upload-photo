import React, { useState } from 'react';
import { Sparkles, X, Wand2, ArrowRight, Loader2 } from 'lucide-react';
import { HistoricalEra } from '../types';

interface CustomEraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEraCreated: (era: HistoricalEra) => void;
}

export const CustomEraModal: React.FC<CustomEraModalProps> = ({
  isOpen,
  onClose,
  onEraCreated,
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    try {
      setIsGenerating(true);
      setErrorMsg(null);

      const res = await fetch('/api/custom-era', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt: promptInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to construct historical era.');
      }

      onEraCreated(data.customEra);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error generating era.');
    } finally {
      setIsGenerating(false);
    }
  };

  const sampleIdeas = [
    'Viking voyage to Norwegian Fjords c. 900 AD',
    'Woodstock Festival 1969 hippie bohemian rocker',
    'Wild West frontier sheriff in 1880 Tombstone Arizona',
    '1920s Parisian Montparnasse salon with Hemingway and Picasso',
    'Mayan High Priest in Tikal Temple plaza during Solar Eclipse',
  ];

  return (
    <div id="custom-era-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0d0d]/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#141211] border border-[#e2d1c3]/20 rounded-xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e2d1c3]/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#c5a059]/40 bg-[#0d0d0d] flex items-center justify-center text-[#c5a059]">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xl font-serif italic text-[#e2d1c3]">
                Design Custom Epoch
              </h3>
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#e2d1c3]/50">
                Gemini 3.7 Flash Archival Architect
              </p>
            </div>
          </div>
          <button
            id="close-custom-era-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full border border-[#e2d1c3]/15 text-[#e2d1c3]/60 hover:text-[#e2d1c3] hover:border-[#c5a059] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label htmlFor="custom-era-prompt-input" className="block text-[10px] font-mono uppercase tracking-widest text-[#e2d1c3]/60 mb-2">
              DESCRIBE HISTORICAL OR RETRO SCENARIO
            </label>
            <textarea
              id="custom-era-prompt-input"
              rows={3}
              placeholder="e.g. 1960s London Carnaby Street Mod fashion, or 14th century Venetian Masquerade ball on a gondola..."
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              className="w-full bg-[#0d0d0d] border border-[#e2d1c3]/20 rounded-sm p-3.5 text-[#e2d1c3] placeholder-[#e2d1c3]/30 text-xs focus:border-[#c5a059] focus:outline-none font-sans"
            />
          </div>

          {/* Quick Idea Presets */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono text-[#e2d1c3]/40 uppercase tracking-widest">Inspiration Themes:</span>
            <div className="flex flex-wrap gap-1.5">
              {sampleIdeas.map((idea, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPromptInput(idea)}
                  className="text-[10px] px-2.5 py-1 rounded-xs bg-[#0d0d0d] hover:bg-[#1a1715] border border-[#e2d1c3]/15 hover:border-[#c5a059]/40 text-[#e2d1c3]/70 hover:text-[#c5a059] transition-all text-left cursor-pointer"
                >
                  + {idea}
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-[#c5a059] bg-[#0d0d0d] border border-[#c5a059]/40 p-2.5 rounded-xs font-mono">
              {errorMsg}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e2d1c3]/15">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-sm text-[#e2d1c3]/60 hover:text-[#e2d1c3] text-xs font-mono uppercase tracking-wider cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="submit-generate-custom-era-btn"
              type="submit"
              disabled={isGenerating || !promptInput.trim()}
              className="px-5 py-2.5 rounded-sm bg-[#c5a059] hover:bg-[#e2d1c3] text-[#0d0d0d] font-bold text-xs uppercase font-mono tracking-widest flex items-center gap-2 shadow-lg disabled:opacity-40 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Lore...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Construct Epoch</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
