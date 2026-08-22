import React from 'react';
import { Sparkles, Clock, Image as ImageIcon, Volume2, VolumeX, RefreshCw, Compass, HardDrive, Cloud } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  currentView: 'booth' | 'gallery' | 'passport';
  setCurrentView: (view: 'booth' | 'gallery' | 'passport') => void;
  galleryCount: number;
  passengerName: string;
  setPassengerName: (name: string) => void;
  onReset: () => void;
  hasActiveTravel: boolean;
  onOpenDrive: () => void;
  isDriveConnected?: boolean;
  userPhoto?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  galleryCount,
  passengerName,
  setPassengerName,
  onReset,
  hasActiveTravel,
  onOpenDrive,
  isDriveConnected,
  userPhoto,
}) => {
  const [soundOn, setSoundOn] = React.useState(true);
  const [isEditingName, setIsEditingName] = React.useState(false);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    sound.setEnabled(next);
    if (next) sound.playBeep(600, 0.05);
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#0d0d0d]/95 backdrop-blur-md border-b border-[#e2d1c3]/15 text-[#e2d1c3] shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand & Temporal Archive Tag */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentView('booth')}>
          <div className="w-11 h-11 rounded-full border border-[#e2d1c3]/30 p-1 flex items-center justify-center relative shadow-[0_0_15px_rgba(226,209,195,0.1)] group-hover:border-[#c5a059] transition-all">
            <div className="w-full h-full bg-[#141211] rounded-full flex items-center justify-center">
              <Compass className="w-5 h-5 text-[#c5a059] animate-[spin_16s_linear_infinite]" />
            </div>
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#c5a059] animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] tracking-[0.35em] uppercase opacity-50 block font-mono">
              Temporal Archive • v.4.0
            </span>
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl sm:text-3xl font-light tracking-tighter italic font-serif">
                CHRONO<span className="font-bold not-italic text-[#c5a059]">LENS</span>
              </h1>
              <span className="hidden sm:inline-block text-[9px] uppercase tracking-[0.25em] text-[#e2d1c3]/40 border border-[#e2d1c3]/20 px-2 py-0.5 rounded-sm">
                Aperture Portal
              </span>
            </div>
          </div>
        </div>

        {/* Passenger ID & Navigation Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          
          {/* Passenger Identity Stamp */}
          <div className="hidden lg:flex items-center gap-2 bg-[#141211] border border-[#e2d1c3]/15 rounded-sm px-3.5 py-1.5 text-xs">
            <span className="text-[#e2d1c3]/40 font-mono text-[10px] tracking-widest uppercase">SUBJECT:</span>
            {isEditingName ? (
              <input
                id="passenger-name-input-header"
                type="text"
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                autoFocus
                className="bg-[#0d0d0d] text-[#c5a059] px-2 py-0.5 border border-[#c5a059] outline-none w-32 font-serif italic text-sm"
              />
            ) : (
              <button
                id="passenger-name-btn"
                onClick={() => setIsEditingName(true)}
                className="text-[#c5a059] font-serif italic text-sm hover:text-[#e2d1c3] transition-colors flex items-center gap-1 max-w-[130px] truncate cursor-pointer"
                title="Click to rename subject"
              >
                {passengerName || 'Eleanor Vance'}
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs uppercase tracking-[0.25em]">
            <button
              id="nav-booth-btn"
              onClick={() => setCurrentView('booth')}
              className={`pb-1 transition-all cursor-pointer flex items-center gap-1.5 ${
                currentView === 'booth'
                  ? 'border-b-2 border-[#c5a059] text-[#e2d1c3] font-medium'
                  : 'text-[#e2d1c3]/40 hover:text-[#e2d1c3]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Capture</span>
            </button>

            <button
              id="nav-gallery-btn"
              onClick={() => setCurrentView('gallery')}
              className={`pb-1 transition-all cursor-pointer flex items-center gap-1.5 ${
                currentView === 'gallery'
                  ? 'border-b-2 border-[#c5a059] text-[#e2d1c3] font-medium'
                  : 'text-[#e2d1c3]/40 hover:text-[#e2d1c3]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Archives</span>
              {galleryCount > 0 && (
                <span className="text-[10px] font-mono font-bold text-[#c5a059]">
                  ({galleryCount})
                </span>
              )}
            </button>
          </div>

          {/* Google Drive Vault Explorer Trigger */}
          <button
            id="google-drive-header-btn"
            onClick={onOpenDrive}
            className={`px-3 py-1.5 rounded-sm border transition-all cursor-pointer flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider ${
              isDriveConnected
                ? 'bg-[#141211] border-[#c5a059]/60 text-[#c5a059] hover:border-[#c5a059]'
                : 'bg-[#0d0d0d] border-[#e2d1c3]/20 text-[#e2d1c3]/70 hover:text-[#e2d1c3] hover:border-[#c5a059]/40'
            }`}
            title="Open Google Drive Cloud Vault"
          >
            {userPhoto ? (
              <img
                src={userPhoto}
                alt="Drive Account"
                referrerPolicy="no-referrer"
                className="w-4 h-4 rounded-full border border-[#c5a059]"
              />
            ) : (
              <HardDrive className="w-3.5 h-3.5 text-[#c5a059]" />
            )}
            <span className="hidden sm:inline">Drive Vault</span>
            {isDriveConnected && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Connected to Google Drive" />
            )}
          </button>

          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={toggleSound}
            aria-label={soundOn ? 'Mute sound' : 'Unmute sound'}
            title={soundOn ? 'Acoustic feedback enabled' : 'Acoustic muted'}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-[#e2d1c3]/20 text-[#e2d1c3]/60 hover:text-[#e2d1c3] hover:border-[#c5a059] transition-colors cursor-pointer"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-[#c5a059]" /> : <VolumeX className="w-4 h-4 text-[#e2d1c3]/30" />}
          </button>

          {/* Reset / New Session */}
          {hasActiveTravel && (
            <button
              id="new-travel-btn"
              onClick={onReset}
              title="Calibrate fresh temporal session"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[#e2d1c3]/30 hover:border-[#c5a059] hover:bg-[#e2d1c3] hover:text-[#0d0d0d] text-[#e2d1c3] text-[11px] font-mono tracking-wider uppercase transition-all cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
