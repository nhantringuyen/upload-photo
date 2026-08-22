import React, { useState } from 'react';
import { Sparkles, Compass, MapPin, Wand2, Plus, ArrowRight, Check, History, Layers } from 'lucide-react';
import { HistoricalEra, SceneOption } from '../types';

interface EraSelectorProps {
  eras: HistoricalEra[];
  selectedEra: HistoricalEra;
  setSelectedEra: (era: HistoricalEra) => void;
  selectedScene: SceneOption;
  setSelectedScene: (scene: SceneOption) => void;
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  onTeleport: () => void;
  onOpenCustomEra: () => void;
  sourceImage: string;
}

export const EraSelector: React.FC<EraSelectorProps> = ({
  eras,
  selectedEra,
  setSelectedEra,
  selectedScene,
  setSelectedScene,
  customPrompt,
  setCustomPrompt,
  onTeleport,
  onOpenCustomEra,
  sourceImage,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Destinations' },
    { id: 'ancient', label: 'Ancient Antiquity' },
    { id: 'medieval', label: 'Medieval & Feudal' },
    { id: 'renaissance', label: 'Renaissance & Golden Age' },
    { id: 'victorian', label: '19th Century Victorian' },
    { id: '20th_century', label: '20th Century Retro' },
    { id: 'futuristic', label: 'Sci-Fi Future' },
  ];

  const filteredEras = activeCategory === 'all'
    ? eras
    : eras.filter((e) => e.eraCategory === activeCategory);

  const handleSelectEra = (era: HistoricalEra) => {
    setSelectedEra(era);
    if (era.scenes && era.scenes.length > 0) {
      setSelectedScene(era.scenes[0]);
    }
  };

  return (
    <div id="era-selector-view" className="w-full max-w-6xl mx-auto space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e2d1c3]/15 pb-5">
        <div>
          <span className="text-[10px] tracking-[0.35em] uppercase text-[#c5a059] block font-mono mb-1">
            PHASE II • TEMPORAL MATRIX SELECTION
          </span>
          <h2 className="text-3xl sm:text-4xl font-light italic font-serif text-[#e2d1c3] tracking-tight">
            Select Your Historical Epoch
          </h2>
          <p className="text-xs sm:text-sm text-[#e2d1c3]/60 max-w-xl font-sans mt-1">
            Calibrate destination year, authentic cultural attire, and situational coordinates for identity fusion.
          </p>
        </div>

        {/* Custom Era Creator Button */}
        <button
          id="open-custom-era-btn"
          onClick={onOpenCustomEra}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-sm border border-[#e2d1c3]/30 hover:border-[#c5a059] hover:bg-[#e2d1c3] hover:text-[#0d0d0d] text-[#e2d1c3] text-[11px] font-mono tracking-wider uppercase transition-all self-start md:self-auto cursor-pointer"
        >
          <Wand2 className="w-3.5 h-3.5 text-[#c5a059]" />
          <span>+ Custom Era Matrix</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#e2d1c3]/10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`category-filter-${cat.id}`}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 text-xs tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === cat.id
                ? 'border-b-2 border-[#c5a059] text-[#c5a059] font-medium'
                : 'text-[#e2d1c3]/40 hover:text-[#e2d1c3]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Eras Grid & Configuration Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Columns: Era Cards Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[600px] overflow-y-auto pr-1">
          {filteredEras.map((era) => {
            const isSelected = selectedEra.id === era.id;
            return (
              <div
                key={era.id}
                id={`era-card-${era.id}`}
                onClick={() => handleSelectEra(era)}
                className={`group relative p-4.5 rounded-sm border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#1a1715] border-[#c5a059] shadow-[0_0_20px_rgba(197,160,89,0.15)]'
                    : 'bg-[#141211] hover:bg-[#1a1715] border-[#e2d1c3]/15 hover:border-[#e2d1c3]/30'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono tracking-widest text-[#c5a059] px-2 py-0.5 border border-[#c5a059]/30 rounded-xs bg-[#0d0d0d]">
                      {era.year}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full border border-[#c5a059] bg-[#c5a059] text-[#0d0d0d] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-serif italic text-[#e2d1c3] group-hover:text-[#c5a059] transition-colors">
                    {era.title}
                  </h3>

                  <p className="text-xs text-[#e2d1c3]/60 mt-1.5 line-clamp-2 leading-relaxed">
                    {era.shortDescription}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#e2d1c3]/10 flex items-center justify-between text-[10px] text-[#e2d1c3]/40">
                  <span className="flex items-center gap-1 font-mono uppercase tracking-wider">
                    <Layers className="w-3 h-3 text-[#c5a059]" />
                    {era.scenes?.length || 1} Variations
                  </span>
                  <span className="text-[#c5a059] uppercase tracking-wider font-mono font-medium">
                    {isSelected ? 'Active Target' : 'Select →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 5 Columns: Selected Era Detail & Scene Configurator */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-[#141211] border border-[#c5a059]/50 rounded-lg p-5 shadow-2xl space-y-5">
            
            {/* Era Header */}
            <div className="flex items-center justify-between border-b border-[#e2d1c3]/15 pb-4">
              <div>
                <span className="text-[9px] font-mono text-[#c5a059] uppercase tracking-[0.3em] block">
                  ACTIVE TARGET DESTINATION
                </span>
                <h3 className="text-2xl font-serif italic text-[#e2d1c3]">
                  {selectedEra.title}
                </h3>
                <span className="text-xs font-mono text-[#e2d1c3]/50">{selectedEra.year}</span>
              </div>
              <div className="w-11 h-11 rounded-full border border-[#c5a059]/40 bg-[#0d0d0d] flex items-center justify-center text-[#c5a059] font-serif italic text-lg">
                ✦
              </div>
            </div>

            {/* Historical Context Info */}
            <div className="text-xs space-y-2.5 text-[#e2d1c3]/80">
              <p className="italic font-serif text-[#e2d1c3]/70 text-sm leading-relaxed">
                "{selectedEra.detailedContext}"
              </p>
              <div className="bg-[#0d0d0d] border border-[#e2d1c3]/15 rounded-sm p-3">
                <span className="text-[9px] font-mono text-[#c5a059] block uppercase tracking-widest font-semibold mb-1">
                  HISTORICAL ATTIRE & PERSONA:
                </span>
                <span className="text-[#e2d1c3]/80 text-[11px] leading-relaxed block">
                  {selectedEra.clothingDescription}
                </span>
              </div>
            </div>

            {/* Scene Selector */}
            <div className="space-y-2">
              <label className="block text-[10px] font-mono uppercase tracking-widest text-[#e2d1c3]/60 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>SCENIC BACKDROP / COMPOSITION:</span>
              </label>
              
              <div className="space-y-1.5">
                {selectedEra.scenes?.map((scene) => {
                  const isSceneActive = selectedScene.id === scene.id;
                  return (
                    <div
                      key={scene.id}
                      id={`scene-option-${scene.id}`}
                      onClick={() => setSelectedScene(scene)}
                      className={`p-3 rounded-sm border text-xs cursor-pointer transition-all ${
                        isSceneActive
                          ? 'bg-[#1a1715] border-[#c5a059] text-[#e2d1c3]'
                          : 'bg-[#0d0d0d] hover:bg-[#141211] border-[#e2d1c3]/15 text-[#e2d1c3]/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif italic text-sm text-[#e2d1c3]">{scene.name}</span>
                        {isSceneActive && <Check className="w-3.5 h-3.5 text-[#c5a059]" />}
                      </div>
                      <p className="text-[11px] text-[#e2d1c3]/50 mt-1">
                        {scene.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Prompt / Props Modifier */}
            <div className="space-y-2">
              <label htmlFor="custom-prompt-modifier" className="block text-[10px] font-mono uppercase tracking-widest text-[#e2d1c3]/60 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>ARTIFACTS / ACCESSORIES (OPTIONAL):</span>
                </span>
              </label>
              <input
                id="custom-prompt-modifier"
                type="text"
                placeholder="e.g. holding a golden pocket watch, velvet cape, monocular..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[#e2d1c3]/20 rounded-sm px-3.5 py-2.5 text-xs text-[#e2d1c3] placeholder-[#e2d1c3]/30 focus:border-[#c5a059] focus:outline-none"
              />

              {/* Sample Prompt Chips */}
              {selectedEra.samplePrompts && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedEra.samplePrompts.map((sp, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCustomPrompt(sp)}
                      className="text-[10px] px-2 py-0.5 rounded-xs bg-[#0d0d0d] hover:bg-[#1a1715] border border-[#e2d1c3]/15 text-[#e2d1c3]/60 hover:text-[#c5a059] hover:border-[#c5a059]/40 transition-colors cursor-pointer"
                    >
                      + {sp}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Primary Teleport Trigger Button */}
            <div className="pt-3">
              <button
                id="teleport-now-btn"
                onClick={onTeleport}
                className="w-full h-13 rounded-sm bg-[#c5a059] hover:bg-[#e2d1c3] text-[#0d0d0d] font-bold text-xs uppercase tracking-[0.25em] shadow-xl flex items-center justify-center gap-3 transition-all active:scale-98 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#0d0d0d]" />
                <span>TRANSIT TO {selectedEra.title.toUpperCase()}</span>
                <ArrowRight className="w-4 h-4 text-[#0d0d0d]" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
