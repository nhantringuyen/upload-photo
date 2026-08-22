import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Download, Wand2, Share2, Layers, RefreshCw, SlidersHorizontal, ArrowLeftRight, FileText, Camera, Check, Loader2, Compass, HardDrive, Cloud, CheckCircle2, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { HistoricalEra, SceneOption, VintageFilter, TimeTravelPhoto } from '../types';
import { VINTAGE_FILTERS } from '../data/filters';
import { sound } from '../utils/audio';
import { getAccessToken, googleSignIn } from '../utils/firebaseAuth';
import { uploadImageToDrive, DriveFile } from '../utils/googleDriveService';

interface TimeTravelResultProps {
  photo: TimeTravelPhoto;
  era: HistoricalEra;
  scene: SceneOption;
  onEditPhoto: (newImageUrl: string) => void;
  onNewEra: () => void;
  onRetake: () => void;
  onOpenPhotoStrip: () => void;
  onOpenPassport: () => void;
  onOpenDrive?: () => void;
}

export const TimeTravelResult: React.FC<TimeTravelResultProps> = ({
  photo,
  era,
  scene,
  onEditPhoto,
  onNewEra,
  onRetake,
  onOpenPhotoStrip,
  onOpenPassport,
  onOpenDrive,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<VintageFilter>(VINTAGE_FILTERS[0]);
  const [compareSliderPos, setCompareSliderPos] = useState<number>(50);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [editPrompt, setEditPrompt] = useState<string>('');
  const [isEditingScene, setIsEditingScene] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Google Drive Direct Upload State
  const [isSavingToDrive, setIsSavingToDrive] = useState(false);
  const [driveUploadSuccess, setDriveUploadSuccess] = useState<DriveFile | null>(null);
  const [driveError, setDriveError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Trigger celebration confetti on mount
  useEffect(() => {
    sound.playTeleportSuccess();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#d97706', '#fbbf24', '#fef3c7'],
      });
    } catch (e) {}
  }, []);

  // Handle Text-Prompt AI Editing with Gemini
  const handleAIEnhance = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editPrompt.trim() || isEditingScene) return;

    try {
      setIsEditingScene(true);
      setEditError(null);

      const res = await fetch('/api/edit-scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: photo.generatedImage,
          editPrompt: editPrompt.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.generatedImage) {
        throw new Error(data.error || 'Failed to apply AI edit to historical photo.');
      }

      onEditPhoto(data.generatedImage);
      setEditPrompt('');
      sound.playTeleportSuccess();
    } catch (err: any) {
      console.error(err);
      setEditError(err.message || 'Error updating scene.');
    } finally {
      setIsEditingScene(false);
    }
  };

  // Save current filtered photo directly to Google Drive
  const handleSaveToDrive = async () => {
    try {
      setIsSavingToDrive(true);
      setDriveError(null);
      setDriveUploadSuccess(null);
      sound.playBeep(650, 0.05);

      let token = getAccessToken();
      if (!token) {
        // Trigger Google Auth popup if not logged in
        const authRes = await googleSignIn();
        if (!authRes?.accessToken) {
          throw new Error('Google Drive authorization was not completed.');
        }
        token = authRes.accessToken;
      }

      // Render image with current vintage filter on canvas
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = photo.generatedImage;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 1024;
      canvas.height = img.naturalHeight || 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not initialize canvas context for upload.');

      if (selectedFilter.filterClass) {
        ctx.filter = selectedFilter.filterClass;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.filter = 'none';

      // Stamp watermark on drive file
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
      ctx.font = 'bold 20px serif';
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`CHRONO-BOOTH: ${era.title.toUpperCase()} • ${era.year}`, 24, canvas.height - 24);
      ctx.font = '16px monospace';
      ctx.fillStyle = '#d4d4d8';
      ctx.fillText(`TRAVELER: ${photo.passengerName || 'TIME TRAVELER'}`, canvas.width - 320, canvas.height - 24);

      const finalDataUrl = canvas.toDataURL('image/png');

      const uploadedFile = await uploadImageToDrive(token, {
        fileName: `ChronoLens_${era.title.replace(/\s+/g, '_')}_${era.year}_${Date.now()}.png`,
        dataUrl: finalDataUrl,
        description: `Chrono-Lens Historical Portrait • ${era.title} (${era.year}) • Scene: ${scene.name} • Subject: ${photo.passengerName || 'Traveler'}`,
        properties: {
          eraId: era.id,
          eraYear: era.year,
          sceneName: scene.name,
          passengerName: photo.passengerName || 'Traveler',
        },
      });

      setDriveUploadSuccess(uploadedFile);
      sound.playSuccess();
    } catch (err: any) {
      console.error('Save to Drive Error:', err);
      setDriveError(err.message || 'Could not save portrait to Google Drive.');
    } finally {
      setIsSavingToDrive(false);
    }
  };

  // Download high-resolution image with applied filter baked in
  const downloadImage = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 1024;
      canvas.height = img.naturalHeight || 1024;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Apply filter on canvas if present
        if (selectedFilter.filterClass) {
          ctx.filter = selectedFilter.filterClass;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Reset filter for decorative bottom watermark border
        ctx.filter = 'none';

        // Add subtle period archival stamp
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.fillRect(0, canvas.height - 60, canvas.width, 60);

        ctx.font = 'bold 20px serif';
        ctx.fillStyle = '#f59e0b';
        ctx.fillText(`CHRONO-BOOTH: ${era.title.toUpperCase()} • ${era.year}`, 24, canvas.height - 24);

        ctx.font = '16px monospace';
        ctx.fillStyle = '#d4d4d8';
        ctx.fillText(`TRAVELER: ${photo.passengerName || 'TIME TRAVELER'}`, canvas.width - 320, canvas.height - 24);

        const link = document.createElement('a');
        link.download = `time-travel-${era.id}-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    };
    img.src = photo.generatedImage;
  };

  // Handle slider mouse / touch drag
  const handleSliderMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setCompareSliderPos(percent);
  };

  const sampleEditIdeas = [
    'Add an ornate golden crown',
    'Make the lighting dramatic sunset golden hour',
    'Add an antique pocket watch in hand',
    'Add a faithful hunting hound sitting beside me',
    'Add floating cherry blossom petals around',
    'Turn into an authentic oil painting style',
  ];

  return (
    <div id="time-travel-result-view" className="w-full max-w-5xl mx-auto space-y-8">
      
      {/* Top Banner with Destination details */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2d1c3]/15 pb-5">
        <div>
          <span className="text-[10px] tracking-[0.35em] uppercase text-[#c5a059] block font-mono mb-1">
            PHASE III • TEMPORAL SYNTHESIS COMPLETE
          </span>
          <h2 className="text-3xl sm:text-4xl font-light italic font-serif text-[#e2d1c3]">
            {photo.passengerName || 'Subject'} in {era.title}
          </h2>
          <p className="text-xs text-[#e2d1c3]/60 font-mono mt-1">
            DESTINATION: <span className="text-[#c5a059]">{scene.name} ({era.year})</span>
          </p>
        </div>

        {/* Quick View Switchers */}
        <div className="flex items-center gap-3">
          <button
            id="open-passport-btn"
            onClick={onOpenPassport}
            className="px-4 py-2 rounded-sm border border-[#c5a059]/40 hover:border-[#c5a059] hover:bg-[#c5a059] hover:text-[#0d0d0d] text-[#c5a059] text-[11px] font-mono tracking-wider uppercase flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Transit Visa</span>
          </button>

          <button
            id="open-photo-strip-btn"
            onClick={onOpenPhotoStrip}
            className="px-4 py-2 rounded-sm border border-[#e2d1c3]/20 hover:border-[#e2d1c3] text-[#e2d1c3] text-[11px] font-mono tracking-wider uppercase flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Photo Strip</span>
          </button>
        </div>
      </div>

      {/* Main Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Columns: Photo Viewport (with comparison slider) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-[#141211] border border-[#e2d1c3]/20 rounded-xl p-4 shadow-2xl space-y-4">
            
            {/* Viewport Box */}
            <div
              ref={containerRef}
              id="photo-viewport-box"
              onMouseMove={(e) => isComparing && handleSliderMove(e.clientX)}
              onTouchMove={(e) => isComparing && handleSliderMove(e.touches[0].clientX)}
              className="relative aspect-square max-h-[500px] w-full rounded-sm overflow-hidden bg-[#0d0d0d] select-none border border-[#e2d1c3]/15 shadow-2xl"
            >
              {/* Historical Generated Photo */}
              <img
                src={photo.generatedImage}
                alt="Time Traveled Portrait"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                style={{ filter: selectedFilter.filterClass || undefined }}
              />

              {/* Original Before Image (Split view overlay) */}
              {isComparing && (
                <div
                  className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-[#c5a059] shadow-2xl z-10"
                  style={{ width: `${compareSliderPos}%` }}
                >
                  <img
                    src={photo.originalImage}
                    alt="Original Portrait"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{
                      width: containerRef.current?.offsetWidth || '100%',
                      height: '100%',
                    }}
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xs bg-[#0d0d0d]/80 backdrop-blur-md text-[9px] font-mono tracking-widest text-[#e2d1c3] border border-[#e2d1c3]/20">
                    SOURCE ANCHOR
                  </div>
                </div>
              )}

              {/* Compare Tag on Right */}
              {isComparing && (
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xs bg-[#0d0d0d]/80 backdrop-blur-md text-[9px] font-mono tracking-widest text-[#c5a059] border border-[#c5a059]/40 z-20">
                  {era.year}
                </div>
              )}

              {/* Slider Drag Handle */}
              {isComparing && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full border border-[#e2d1c3] bg-[#0d0d0d] text-[#c5a059] flex items-center justify-center shadow-2xl cursor-ew-resize z-20"
                  style={{ left: `${compareSliderPos}%` }}
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {/* View Controls below Photo */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <button
                id="toggle-compare-slider-btn"
                onClick={() => setIsComparing(!isComparing)}
                className={`px-3.5 py-1.5 rounded-sm text-xs font-mono tracking-wider uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                  isComparing
                    ? 'bg-[#c5a059] text-[#0d0d0d] font-bold'
                    : 'bg-[#0d0d0d] text-[#e2d1c3]/70 hover:text-[#e2d1c3] border border-[#e2d1c3]/20'
                }`}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>{isComparing ? 'Close Split View' : 'Compare Original'}</span>
              </button>

              <div className="flex items-center gap-2">
                {/* Save Direct to Google Drive Button */}
                <button
                  id="save-to-google-drive-btn"
                  onClick={handleSaveToDrive}
                  disabled={isSavingToDrive}
                  className="px-3.5 py-2 rounded-sm border border-[#c5a059]/50 hover:border-[#c5a059] bg-[#0d0d0d] hover:bg-[#1a1715] text-[#c5a059] font-bold text-xs uppercase font-mono tracking-wider flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
                  title="Upload this plate into your Google Drive Chrono-Lens folder"
                >
                  {isSavingToDrive ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Archiving...</span>
                    </>
                  ) : (
                    <>
                      <HardDrive className="w-3.5 h-3.5" />
                      <span>Save to Drive</span>
                    </>
                  )}
                </button>

                <button
                  id="download-photo-btn"
                  onClick={downloadImage}
                  className="px-4 py-2 rounded-sm bg-[#c5a059] hover:bg-[#e2d1c3] text-[#0d0d0d] font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Print</span>
                </button>
              </div>
            </div>

            {/* Google Drive Status Notification */}
            {driveUploadSuccess && (
              <div className="p-3 rounded-sm bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Plate securely archived to Google Drive folder!</span>
                </div>
                {driveUploadSuccess.webViewLink && (
                  <a
                    href={driveUploadSuccess.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-emerald-300 hover:text-emerald-100 flex items-center gap-1 text-[11px]"
                  >
                    <span>View in Drive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}

            {driveError && (
              <div className="p-3 rounded-sm bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center justify-between">
                <span>{driveError}</span>
                <button
                  onClick={() => setDriveError(null)}
                  className="text-[10px] uppercase underline ml-2"
                >
                  Dismiss
                </button>
              </div>
            )}

          </div>

          {/* Historical Narrative Card */}
          {photo.historicalLore && (
            <div className="bg-[#141211] border border-[#e2d1c3]/15 rounded-sm p-4 text-xs text-[#e2d1c3] shadow-xl">
              <span className="text-[9px] font-mono text-[#c5a059] uppercase tracking-[0.25em] block mb-1">
                HISTORICAL CHRONICLE:
              </span>
              <p className="font-serif italic text-[#e2d1c3]/80 leading-relaxed text-sm">
                "{photo.historicalLore}"
              </p>
            </div>
          )}
        </div>

        {/* Right 5 Columns: AI Edit Studio & Vintage Filters */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Feature 1: AI Prompt Scene Editor */}
          <div className="bg-[#141211] border border-[#e2d1c3]/20 rounded-lg p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full border border-[#c5a059]/40 bg-[#0d0d0d] flex items-center justify-center text-[#c5a059]">
                <Wand2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-base font-serif italic text-[#e2d1c3]">
                  Temporal Scene Refinement
                </h4>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#e2d1c3]/50">
                  Gemini 3.1 Flash Image Prompt Synthesis
                </p>
              </div>
            </div>

            <form onSubmit={handleAIEnhance} className="space-y-2.5">
              <div className="relative">
                <input
                  id="ai-edit-prompt-input"
                  type="text"
                  placeholder="e.g. Add a jeweled coronet, warm candlelight..."
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  disabled={isEditingScene}
                  className="w-full bg-[#0d0d0d] border border-[#e2d1c3]/20 rounded-sm pl-3 pr-24 py-2.5 text-xs text-[#e2d1c3] placeholder-[#e2d1c3]/30 focus:border-[#c5a059] focus:outline-none font-sans"
                />
                <button
                  id="apply-ai-edit-btn"
                  type="submit"
                  disabled={isEditingScene || !editPrompt.trim()}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-xs bg-[#c5a059] hover:bg-[#e2d1c3] text-[#0d0d0d] font-bold text-[10px] font-mono uppercase tracking-wider flex items-center gap-1 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  {isEditingScene ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3" />
                      <span>Refine</span>
                    </>
                  )}
                </button>
              </div>

              {editError && (
                <p className="text-[11px] text-[#c5a059] bg-[#0d0d0d] border border-[#c5a059]/40 p-2 rounded-xs font-mono">
                  {editError}
                </p>
              )}

              {/* Quick AI Modification Chips */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[9px] font-mono text-[#e2d1c3]/40 uppercase tracking-widest block">
                  Suggested Variations:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sampleEditIdeas.map((idea, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditPrompt(idea)}
                      className="text-[10px] px-2 py-0.5 rounded-xs bg-[#0d0d0d] hover:bg-[#1a1715] border border-[#e2d1c3]/15 text-[#e2d1c3]/60 hover:text-[#c5a059] hover:border-[#c5a059]/40 transition-colors cursor-pointer"
                    >
                      + {idea}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* Feature 2: Vintage Photo Filters */}
          <div className="bg-[#141211] border border-[#e2d1c3]/15 rounded-lg p-5 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#e2d1c3]/10 pb-2">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#c5a059]" />
                <h4 className="text-sm font-serif italic text-[#e2d1c3]">
                  Period Film Emulsions
                </h4>
              </div>
              <span className="text-[10px] font-mono text-[#c5a059] uppercase tracking-wider">
                {selectedFilter.name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {VINTAGE_FILTERS.map((f) => {
                const isActive = selectedFilter.id === f.id;
                return (
                  <button
                    key={f.id}
                    id={`vintage-filter-btn-${f.id}`}
                    onClick={() => setSelectedFilter(f)}
                    className={`p-2 rounded-sm border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#1a1715] border-[#c5a059] ring-1 ring-[#c5a059]/50'
                        : 'bg-[#0d0d0d] hover:bg-[#141211] border-[#e2d1c3]/15'
                    }`}
                  >
                    <div
                      className="w-full h-8 rounded-xs mb-1.5 border border-[#e2d1c3]/20"
                      style={{ background: f.colorGrade }}
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-serif italic text-[#e2d1c3] truncate">{f.name}</p>
                    </div>
                    <p className="text-[8px] font-mono uppercase tracking-wider text-[#e2d1c3]/40">{f.yearLabel}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation / Next Actions */}
          <div className="bg-[#141211] border border-[#e2d1c3]/15 rounded-lg p-4 space-y-2">
            <button
              id="travel-another-era-btn"
              onClick={onNewEra}
              className="w-full py-2.5 rounded-sm border border-[#c5a059] bg-[#0d0d0d] hover:bg-[#c5a059] text-[#c5a059] hover:text-[#0d0d0d] text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Select Another Epoch</span>
            </button>

            <button
              id="retake-new-photo-btn"
              onClick={onRetake}
              className="w-full py-2 rounded-sm text-[#e2d1c3]/50 hover:text-[#e2d1c3] text-[11px] font-mono uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Camera className="w-3 h-3" />
              <span>Recalibrate Fresh Anchor</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
