import React, { useRef, useState } from 'react';
import { X, Download, Sparkles, Layers, Image as ImageIcon } from 'lucide-react';
import { TimeTravelPhoto, HistoricalEra } from '../types';

interface PhotoStripModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhoto: TimeTravelPhoto;
  era: HistoricalEra;
  galleryPhotos: TimeTravelPhoto[];
}

export const PhotoStripModal: React.FC<PhotoStripModalProps> = ({
  isOpen,
  onClose,
  currentPhoto,
  era,
  galleryPhotos,
}) => {
  const [stripTheme, setStripTheme] = useState<'classic-cream' | 'noir-dark' | 'vintage-gold'>('classic-cream');
  const [isDownloading, setIsDownloading] = useState(false);
  const stripRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  // Gather up to 4 photos for the strip: current photo + past travels + original photo
  const photosForStrip: string[] = [
    currentPhoto.generatedImage,
    ...(galleryPhotos.filter(p => p.id !== currentPhoto.id).map(p => p.generatedImage)),
    currentPhoto.originalImage,
  ].slice(0, 4);

  // Pad to 4 if needed by repeating or using current
  while (photosForStrip.length < 4) {
    photosForStrip.push(currentPhoto.generatedImage);
  }

  const handleDownloadStrip = () => {
    setIsDownloading(true);
    const canvas = document.createElement('canvas');
    const width = 600;
    const height = 1800;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsDownloading(false);
      return;
    }

    // Theme Background
    if (stripTheme === 'classic-cream') {
      ctx.fillStyle = '#fef3c7';
    } else if (stripTheme === 'noir-dark') {
      ctx.fillStyle = '#18181b';
    } else {
      ctx.fillStyle = '#451a03';
    }
    ctx.fillRect(0, 0, width, height);

    // Top Header Text
    ctx.textAlign = 'center';
    ctx.fillStyle = stripTheme === 'classic-cream' ? '#78350f' : '#fef3c7';
    ctx.font = 'bold 28px serif';
    ctx.fillText('CHRONO-BOOTH SOUVENIR', width / 2, 60);

    ctx.font = '16px monospace';
    ctx.fillStyle = stripTheme === 'classic-cream' ? '#92400e' : '#fde68a';
    ctx.fillText(`TEMPORAL TRANSIT • ${era.year}`, width / 2, 90);

    // Load and draw each of the 4 photos
    let loadedCount = 0;
    const imgPadding = 30;
    const imgWidth = width - imgPadding * 2;
    const imgHeight = 350;
    const startY = 120;
    const spacing = 20;

    photosForStrip.forEach((src, idx) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const y = startY + idx * (imgHeight + spacing);

        // Photo border
        ctx.fillStyle = stripTheme === 'noir-dark' ? '#27272a' : '#ffffff';
        ctx.fillRect(imgPadding - 6, y - 6, imgWidth + 12, imgHeight + 12);

        // Draw image
        ctx.drawImage(img, imgPadding, y, imgWidth, imgHeight);

        loadedCount++;
        if (loadedCount === 4) {
          // Bottom Footer Text
          const footerY = startY + 4 * (imgHeight + spacing) + 30;
          ctx.font = 'bold 18px serif';
          ctx.fillStyle = stripTheme === 'classic-cream' ? '#78350f' : '#fef3c7';
          ctx.fillText(`TRAVELER: ${currentPhoto.passengerName || 'TIME TRAVELER'}`, width / 2, footerY);

          ctx.font = '13px monospace';
          ctx.fillStyle = stripTheme === 'classic-cream' ? '#a16207' : '#d4d4d8';
          ctx.fillText(`AUTHENTICATED BY GEMINI AI • CHRONO LABS`, width / 2, footerY + 28);

          // Trigger download
          const link = document.createElement('a');
          link.download = `photo-strip-${era.id}-${Date.now()}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
          setIsDownloading(false);
        }
      };
      img.src = src;
    });
  };

  return (
    <div id="photo-strip-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0d0d]/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#141211] border border-[#e2d1c3]/20 rounded-xl p-6 shadow-2xl space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e2d1c3]/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#c5a059]/40 bg-[#0d0d0d] flex items-center justify-center text-[#c5a059]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xl font-serif italic text-[#e2d1c3]">
                Archival Photo Strip
              </h3>
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#e2d1c3]/50">
                Four-Panel Sequential Temporal Plate
              </p>
            </div>
          </div>
          <button
            id="close-photo-strip-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full border border-[#e2d1c3]/15 text-[#e2d1c3]/60 hover:text-[#e2d1c3] hover:border-[#c5a059] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Theme Picker */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#e2d1c3]/50">PLATE FINISH:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStripTheme('classic-cream')}
              className={`px-3 py-1 text-[11px] font-mono tracking-wider uppercase rounded-xs border transition-all cursor-pointer ${
                stripTheme === 'classic-cream'
                  ? 'bg-[#e2d1c3] text-[#0d0d0d] border-[#e2d1c3] font-bold'
                  : 'bg-[#0d0d0d] text-[#e2d1c3]/60 border-[#e2d1c3]/15'
              }`}
            >
              Parchment Cream
            </button>
            <button
              onClick={() => setStripTheme('noir-dark')}
              className={`px-3 py-1 text-[11px] font-mono tracking-wider uppercase rounded-xs border transition-all cursor-pointer ${
                stripTheme === 'noir-dark'
                  ? 'bg-[#2a2521] text-[#e2d1c3] border-[#c5a059] font-bold'
                  : 'bg-[#0d0d0d] text-[#e2d1c3]/60 border-[#e2d1c3]/15'
              }`}
            >
              Noir Obsidian
            </button>
            <button
              onClick={() => setStripTheme('vintage-gold')}
              className={`px-3 py-1 text-[11px] font-mono tracking-wider uppercase rounded-xs border transition-all cursor-pointer ${
                stripTheme === 'vintage-gold'
                  ? 'bg-[#c5a059] text-[#0d0d0d] border-[#c5a059] font-bold'
                  : 'bg-[#0d0d0d] text-[#e2d1c3]/60 border-[#e2d1c3]/15'
              }`}
            >
              Imperial Gilt
            </button>
          </div>
        </div>

        {/* Live Preview Strip */}
        <div className="max-h-[460px] overflow-y-auto flex justify-center py-2">
          <div
            ref={stripRef}
            className={`w-64 p-4 rounded-sm shadow-2xl space-y-3.5 text-center transition-colors border ${
              stripTheme === 'classic-cream'
                ? 'bg-[#f4ebe1] text-[#2b2016] border-[#d6c4b2]'
                : stripTheme === 'noir-dark'
                ? 'bg-[#0d0d0d] text-[#e2d1c3] border-[#2a2521]'
                : 'bg-[#1a140d] text-[#c5a059] border-[#c5a059]/40'
            }`}
          >
            {/* Header */}
            <div>
              <p className="font-serif italic font-bold text-base tracking-tight">CHRONO-LENS</p>
              <p className="text-[9px] font-mono uppercase tracking-widest opacity-70">{era.title} • {era.year}</p>
            </div>

            {/* 4 Photos */}
            <div className="space-y-2.5">
              {photosForStrip.map((src, idx) => (
                <div key={idx} className="relative aspect-[4/3] rounded-xs overflow-hidden border border-[#e2d1c3]/30 shadow-md bg-[#0d0d0d]">
                  <img
                    src={src}
                    alt={`Strip shot ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 px-1 rounded-xs bg-[#0d0d0d]/80 text-[8px] font-mono text-[#e2d1c3]">
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-1 text-[10px] space-y-0.5 opacity-85">
              <p className="font-serif italic font-bold">{currentPhoto.passengerName || 'SUBJECT'}</p>
              <p className="font-mono text-[8px] uppercase tracking-widest">TEMPORAL APERTURE ARCHIVE</p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e2d1c3]/15">
          <button
            id="close-strip-btn"
            onClick={onClose}
            className="px-4 py-2 rounded-sm text-[#e2d1c3]/60 hover:text-[#e2d1c3] text-xs font-mono uppercase tracking-wider cursor-pointer"
          >
            Dismiss
          </button>
          <button
            id="download-strip-btn"
            onClick={handleDownloadStrip}
            disabled={isDownloading}
            className="px-5 py-2.5 rounded-sm bg-[#c5a059] hover:bg-[#e2d1c3] text-[#0d0d0d] font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Rendering Plate...' : 'Export Strip (PNG)'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
