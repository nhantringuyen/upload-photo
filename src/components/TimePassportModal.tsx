import React, { useRef } from 'react';
import { X, Download, Compass, Sparkles, ShieldCheck, Printer, Calendar, User, MapPin } from 'lucide-react';
import { TimeTravelPhoto, HistoricalEra } from '../types';

interface TimePassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  photo: TimeTravelPhoto;
  era: HistoricalEra;
}

export const TimePassportModal: React.FC<TimePassportModalProps> = ({
  isOpen,
  onClose,
  photo,
  era,
}) => {
  const passportCardRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const handlePrintOrDownload = () => {
    window.print();
  };

  return (
    <div id="time-passport-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0d0d]/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#141211] border border-[#e2d1c3]/20 rounded-xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        
        {/* Close Button */}
        <button
          id="close-passport-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full border border-[#e2d1c3]/15 text-[#e2d1c3]/60 hover:text-[#e2d1c3] hover:border-[#c5a059] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Passport Header */}
        <div className="text-center space-y-2 border-b border-[#e2d1c3]/15 pb-5">
          <div className="w-12 h-12 rounded-full border border-[#c5a059] bg-[#0d0d0d] p-1 mx-auto flex items-center justify-center shadow-lg">
            <Compass className="w-6 h-6 text-[#c5a059]" />
          </div>
          <span className="text-[10px] tracking-[0.35em] uppercase text-[#c5a059] block font-mono">
            AUTHORITY OF TEMPORAL TRANSIT
          </span>
          <h2 className="text-2xl sm:text-3xl font-light italic font-serif text-[#e2d1c3]">
            Official Temporal Transit Visa
          </h2>
          <p className="text-[10px] font-mono tracking-widest uppercase text-[#e2d1c3]/50">
            VISA REGISTRATION NO. {photo.id.slice(0, 8).toUpperCase()} • SECTOR ARCHIVE
          </p>
        </div>

        {/* Passport Content Grid */}
        <div ref={passportCardRef} className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          
          {/* Passenger Photo with Gold Stamp */}
          <div className="sm:col-span-5 relative text-center">
            <div className="aspect-[3/4] rounded-sm overflow-hidden border border-[#c5a059] shadow-2xl bg-[#0d0d0d] relative">
              <img
                src={photo.generatedImage}
                alt="Passport Photo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-[#0d0d0d]/80 backdrop-blur-md rounded-xs px-2 py-1 text-[9px] font-mono tracking-widest uppercase text-[#c5a059] border border-[#c5a059]/40">
                VERIFIED PASSENGER
              </div>
            </div>

            {/* Official Holographic Stamp Seal */}
            <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full border border-dashed border-[#c5a059] bg-[#0d0d0d] text-[#c5a059] flex flex-col items-center justify-center text-[7px] font-mono tracking-wider font-bold shadow-2xl rotate-12">
              <ShieldCheck className="w-4 h-4 text-[#c5a059] mb-0.5" />
              <span>CHRONO</span>
              <span>VERIFIED</span>
            </div>
          </div>

          {/* Passenger Credentials & Lore */}
          <div className="sm:col-span-7 space-y-3 text-xs text-[#e2d1c3]">
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0d0d0d] border border-[#e2d1c3]/15 rounded-xs p-3">
                <span className="text-[8px] font-mono text-[#e2d1c3]/50 block uppercase tracking-widest">SUBJECT IDENTITY</span>
                <span className="font-serif italic font-bold text-[#c5a059] text-sm">
                  {photo.passengerName || 'ELEANOR VANCE'}
                </span>
              </div>

              <div className="bg-[#0d0d0d] border border-[#e2d1c3]/15 rounded-xs p-3">
                <span className="text-[8px] font-mono text-[#e2d1c3]/50 block uppercase tracking-widest">TEMPORAL EPOCH</span>
                <span className="font-serif italic font-bold text-[#e2d1c3] text-sm">
                  {era.year}
                </span>
              </div>
            </div>

            <div className="bg-[#0d0d0d] border border-[#e2d1c3]/15 rounded-xs p-3">
              <span className="text-[8px] font-mono text-[#e2d1c3]/50 block uppercase tracking-widest">HISTORICAL SECTOR</span>
              <span className="font-serif italic text-[#e2d1c3] text-xs">
                {era.title} — {photo.sceneName}
              </span>
            </div>

            {/* Historical Narrative Lore */}
            <div className="bg-[#0d0d0d] border border-[#c5a059]/30 rounded-xs p-3.5 text-[#e2d1c3] space-y-1">
              <span className="text-[8px] font-mono text-[#c5a059] uppercase tracking-widest block">
                ARCHIVAL WITNESS TRANSCRIPTION:
              </span>
              <p className="font-serif italic text-xs leading-relaxed text-[#e2d1c3]/80">
                "{photo.historicalLore || `${photo.passengerName || 'The passenger'} arrived safely in ${era.title} and engaged with local dignitaries.`}"
              </p>
            </div>

            {/* Security Barcode */}
            <div className="pt-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-[#e2d1c3]/40 border-t border-[#e2d1c3]/15">
              <span>EXPIRY: ∞ CONTINUOUS</span>
              <span>CLEARANCE: LEVEL 5</span>
            </div>

          </div>

        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e2d1c3]/15">
          <button
            id="close-passport-btn"
            onClick={onClose}
            className="px-4 py-2 rounded-sm text-[#e2d1c3]/60 hover:text-[#e2d1c3] text-xs font-mono uppercase tracking-wider cursor-pointer"
          >
            Dismiss
          </button>
          <button
            id="print-passport-btn"
            onClick={handlePrintOrDownload}
            className="px-5 py-2.5 rounded-sm bg-[#c5a059] hover:bg-[#e2d1c3] text-[#0d0d0d] font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Transit Visa</span>
          </button>
        </div>

      </div>
    </div>
  );
};
