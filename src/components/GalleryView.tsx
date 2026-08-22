import React, { useState } from 'react';
import { Compass, Trash2, Download, ExternalLink, Calendar, Search, Image as ImageIcon, Sparkles, HardDrive, Cloud } from 'lucide-react';
import { TimeTravelPhoto } from '../types';

interface GalleryViewProps {
  photos: TimeTravelPhoto[];
  onSelectPhoto: (photo: TimeTravelPhoto) => void;
  onDeletePhoto: (id: string) => void;
  onNewTravel: () => void;
  onOpenDrive?: () => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  photos,
  onSelectPhoto,
  onDeletePhoto,
  onNewTravel,
  onOpenDrive,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPhotos = photos.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.eraTitle.toLowerCase().includes(term) ||
      p.eraYear.toLowerCase().includes(term) ||
      (p.passengerName && p.passengerName.toLowerCase().includes(term)) ||
      p.sceneName.toLowerCase().includes(term)
    );
  });

  return (
    <div id="gallery-view" className="w-full max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2d1c3]/15 pb-5">
        <div>
          <span className="text-[10px] tracking-[0.35em] uppercase text-[#c5a059] block font-mono mb-1">
            ARCHIVAL COLLECTION • {photos.length} EPOCH PLATES
          </span>
          <h2 className="text-3xl sm:text-4xl font-light italic font-serif text-[#e2d1c3]">
            Temporal Portrait Gallery
          </h2>
          <p className="text-xs text-[#e2d1c3]/60 max-w-lg mt-1 font-sans">
            Chronological catalog of synthesized historical portraits across ancient and modern epochs.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {onOpenDrive && (
            <button
              id="gallery-open-drive-vault-btn"
              onClick={onOpenDrive}
              className="px-4 py-2.5 rounded-sm border border-[#c5a059]/40 hover:border-[#c5a059] bg-[#141211] text-[#c5a059] font-bold text-xs font-mono uppercase tracking-widest flex items-center gap-2 shadow-md transition-all cursor-pointer"
              title="Browse and synchronize with your Google Drive archive"
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Drive Cloud Vault</span>
            </button>
          )}

          <button
            id="new-expedition-btn"
            onClick={onNewTravel}
            className="px-5 py-2.5 rounded-sm bg-[#c5a059] hover:bg-[#e2d1c3] text-[#0d0d0d] font-bold text-xs font-mono uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Expedition</span>
          </button>
        </div>
      </div>

      {/* Search Filter */}
      {photos.length > 0 && (
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#e2d1c3]/40" />
          <input
            id="gallery-search-input"
            type="text"
            placeholder="Search by epoch, year, subject name, or scene..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#141211] border border-[#e2d1c3]/20 rounded-sm pl-10 pr-4 py-2 text-xs text-[#e2d1c3] placeholder-[#e2d1c3]/30 focus:border-[#c5a059] focus:outline-none font-sans"
          />
        </div>
      )}

      {/* Photos Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="bg-[#141211] border border-[#e2d1c3]/15 rounded-xl p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-full border border-[#c5a059]/40 bg-[#0d0d0d] flex items-center justify-center text-[#c5a059] mx-auto">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif italic text-[#e2d1c3]">
            {photos.length === 0 ? 'No Historical Portraits Recorded' : 'No Matching Expeditions Found'}
          </h3>
          <p className="text-xs text-[#e2d1c3]/60 max-w-sm mx-auto font-sans">
            {photos.length === 0
              ? 'Calibrate a source photo and step into the Chrono-Lens aperture to begin recording temporal travels.'
              : 'Modify your search keywords to locate previous historical archives.'}
          </p>
          {photos.length === 0 && (
            <button
              onClick={onNewTravel}
              className="px-5 py-2 rounded-sm bg-[#c5a059] hover:bg-[#e2d1c3] text-[#0d0d0d] font-bold text-xs uppercase font-mono tracking-widest inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step to Aperture</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((item) => (
            <div
              key={item.id}
              id={`gallery-item-${item.id}`}
              className="group bg-[#141211] border border-[#e2d1c3]/15 hover:border-[#c5a059]/60 rounded-lg overflow-hidden shadow-xl transition-all flex flex-col justify-between"
            >
              {/* Image Box */}
              <div
                onClick={() => onSelectPhoto(item)}
                className="relative aspect-[4/3] bg-[#0d0d0d] overflow-hidden cursor-pointer"
              >
                <img
                  src={item.generatedImage}
                  alt={item.eraTitle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-xs bg-[#0d0d0d]/80 backdrop-blur-md text-[9px] font-mono tracking-widest text-[#c5a059] border border-[#c5a059]/40">
                  {item.eraYear}
                </div>
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-xs bg-[#0d0d0d]/80 backdrop-blur-md text-[9px] font-mono tracking-wider text-[#e2d1c3]">
                  {item.passengerName || 'Subject'}
                </div>
              </div>

              {/* Card Meta & Actions */}
              <div className="p-4 space-y-3">
                <div>
                  <h4 className="font-serif italic text-base text-[#e2d1c3] group-hover:text-[#c5a059] transition-colors">
                    {item.eraTitle}
                  </h4>
                  <p className="text-xs text-[#e2d1c3]/50 line-clamp-1 font-sans">
                    {item.sceneName}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#e2d1c3]/10 text-xs">
                  <button
                    onClick={() => onSelectPhoto(item)}
                    className="text-[#c5a059] hover:text-[#e2d1c3] font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open Plate</span>
                  </button>

                  <button
                    id={`delete-photo-${item.id}`}
                    onClick={() => onDeletePhoto(item.id)}
                    className="p-1 rounded-full text-[#e2d1c3]/30 hover:text-rose-400 hover:bg-[#0d0d0d] transition-colors cursor-pointer"
                    title="Remove from archives"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
