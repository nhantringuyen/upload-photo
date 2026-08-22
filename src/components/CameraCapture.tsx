import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, RefreshCw, Sparkles, User, Image as ImageIcon, AlertCircle, HardDrive } from 'lucide-react';
import { sound } from '../utils/audio';
import { SAMPLE_PORTRAITS, SamplePortrait } from '../utils/samplePortraits';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  passengerName: string;
  setPassengerName: (name: string) => void;
  onOpenDrive?: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  passengerName,
  setPassengerName,
  onOpenDrive,
}) => {
  const [streamActive, setStreamActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isLoadingSample, setIsLoadingSample] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize camera stream
  const startCamera = async (mode: 'user' | 'environment' = facingMode) => {
    try {
      setCameraError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setStreamActive(true);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(
        'Camera access was denied or is unavailable. You can still upload a photo or pick a sample portrait below!'
      );
      setStreamActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setStreamActive(false);
  };

  useEffect(() => {
    startCamera('user');
    return () => {
      stopCamera();
    };
  }, []);

  // Flip camera
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Trigger countdown & snapshot
  const triggerCapture = () => {
    if (!videoRef.current || countdown !== null) return;

    let count = 3;
    setCountdown(count);
    sound.playBeep(660, 0.08);

    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        sound.playBeep(660 + (3 - count) * 110, 0.08);
      } else {
        clearInterval(timer);
        setCountdown(null);
        takeSnapshot();
      }
    }, 900);
  };

  // Capture image to Canvas
  const takeSnapshot = () => {
    if (!videoRef.current) return;
    sound.playShutter();
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 800;
    canvas.height = video.videoHeight || 800;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // If front camera, mirror horizontally for natural photo booth look
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      onCapture(dataUrl);
    }
  };

  // Handle uploaded files
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        sound.playShutter();
        onCapture(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle sample portrait selection
  const selectSample = async (sample: SamplePortrait) => {
    try {
      setIsLoadingSample(true);
      // Fetch the image and convert to data URI to ensure clean server processing
      const res = await fetch(sample.url, { mode: 'cors' });
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setIsLoadingSample(false);
        if (reader.result) {
          if (!passengerName) setPassengerName(sample.name);
          sound.playShutter();
          onCapture(reader.result as string);
        }
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      setIsLoadingSample(false);
      // Fallback directly to URL
      if (!passengerName) setPassengerName(sample.name);
      onCapture(sample.url);
    }
  };

  return (
    <div id="camera-capture-view" className="w-full max-w-5xl mx-auto space-y-8">
      
      {/* Photo Booth Frame Header */}
      <div className="text-center space-y-2.5">
        <span className="text-[10px] tracking-[0.35em] uppercase text-[#c5a059] block font-mono">
          PHASE I • SPATIAL ANCHOR CALIBRATION
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light italic font-serif text-[#e2d1c3] tracking-tight">
          Enter the Chrono<span className="font-bold not-italic text-[#c5a059]">Lens</span>
        </h2>
        <p className="text-[#e2d1c3]/60 text-xs sm:text-sm max-w-lg mx-auto font-sans">
          Calibrate your portrait matrix. High-contrast frontal lighting ensures precise temporal facial synthesis.
        </p>
      </div>

      {/* Passenger Name & Calibration Tag */}
      <div className="max-w-md mx-auto bg-[#141211] border border-[#e2d1c3]/15 rounded-sm p-3 flex items-center gap-3 shadow-xl">
        <div className="w-8 h-8 rounded-full border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059]">
          <User className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <label htmlFor="passenger-name-input" className="block text-[9px] font-mono text-[#e2d1c3]/50 uppercase tracking-widest">
            SUBJECT IDENTIFICATION (FOR TRANSIT VISA)
          </label>
          <input
            id="passenger-name-input"
            type="text"
            placeholder="e.g. Eleanor Vance"
            value={passengerName}
            onChange={(e) => setPassengerName(e.target.value)}
            className="w-full bg-transparent text-[#e2d1c3] placeholder-[#e2d1c3]/30 text-sm font-serif italic focus:outline-none"
          />
        </div>
      </div>

      {/* Main Viewfinder Section with Artistic Flair Aperture */}
      <div className="relative bg-[#141211] border border-[#e2d1c3]/20 rounded-2xl overflow-hidden p-6 sm:p-10 shadow-2xl flex flex-col items-center justify-center">
        
        {/* Background Dot Matrix */}
        <div className="absolute inset-0 opacity-15 pointer-events-none artistic-grid-bg" />

        {/* Flash Overlay */}
        {isFlashing && (
          <div className="absolute inset-0 bg-[#e2d1c3] z-30 pointer-events-none transition-opacity duration-200" />
        )}

        {/* Outer Circular Aperture Frame with Corner Brackets */}
        <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center my-2">
          
          {/* Fine Outer Brackets */}
          <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-[#c5a059]" />
          <div className="absolute -top-3 -right-3 w-8 h-8 border-t-2 border-r-2 border-[#c5a059]" />
          <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-2 border-l-2 border-[#c5a059]" />
          <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-[#c5a059]" />

          {/* Outer Dashed Orbit Ring */}
          <div className="absolute inset-0 rounded-full border border-[#e2d1c3]/25 p-3 flex items-center justify-center shadow-[0_0_80px_rgba(0,0,0,0.8)]">
            
            {/* Inner Video / Dropzone Circular Container */}
            <div className="w-full h-full rounded-full bg-[#0d0d0d] overflow-hidden relative border border-[#e2d1c3]/20 flex items-center justify-center group">
              
              {streamActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover sepia-[0.1] contrast-[1.05] ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                  />

                  {/* Reticle Focus Ring */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-44 h-44 sm:w-52 sm:h-52 border border-dashed border-[#e2d1c3]/40 rounded-full animate-pulse flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#c5a059]" />
                    </div>
                  </div>

                  {/* Countdown Overlay */}
                  {countdown !== null && (
                    <div className="absolute inset-0 bg-[#0d0d0d]/75 backdrop-blur-sm z-20 flex items-center justify-center animate-in fade-in">
                      <div className="w-24 h-24 rounded-full border border-[#c5a059] bg-[#141211] text-[#c5a059] flex items-center justify-center text-5xl font-serif italic shadow-2xl scale-110 animate-pulse">
                        {countdown}
                      </div>
                    </div>
                  )}

                  {/* Top Camera Flip Button */}
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      id="flip-camera-btn"
                      onClick={toggleFacingMode}
                      className="p-2.5 rounded-full bg-[#0d0d0d]/80 backdrop-blur-md border border-[#e2d1c3]/30 text-[#e2d1c3] hover:text-[#c5a059] hover:border-[#c5a059] transition-all shadow-md cursor-pointer"
                      title="Flip camera"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                /* Upload Dropzone when camera is off */
                <div
                  id="upload-dropzone"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
                    isDragging ? 'bg-[#c5a059]/10' : 'hover:bg-[#141211]'
                  }`}
                >
                  <div className="w-14 h-14 rounded-full border border-[#c5a059]/40 bg-[#141211] flex items-center justify-center text-[#c5a059] mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.3em] text-[#e2d1c3] font-mono">
                    Awaiting Subject
                  </span>
                  <p className="text-[10px] text-[#e2d1c3]/50 mt-1 max-w-[200px]">
                    Drop portrait photo or click to browse
                  </p>

                  {cameraError && (
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-[#c5a059] max-w-[220px]">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span className="line-clamp-2">{cameraError}</span>
                    </div>
                  )}
                </div>
              )}

              <input
                ref={fileInputRef}
                id="file-upload-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFile(e.target.files[0]);
                }}
              />
            </div>
          </div>
        </div>

        {/* Shutter Button & Secondary Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {streamActive ? (
            <>
              <div className="flex items-center gap-2">
                <button
                  id="choose-file-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-sm border border-[#e2d1c3]/20 hover:border-[#c5a059] text-[#e2d1c3]/70 hover:text-[#e2d1c3] text-[11px] font-mono tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Upload local portrait file"
                >
                  <Upload className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Upload</span>
                </button>

                {onOpenDrive && (
                  <button
                    id="choose-from-drive-btn"
                    onClick={onOpenDrive}
                    className="px-3.5 py-2 rounded-sm border border-[#c5a059]/40 hover:border-[#c5a059] bg-[#0d0d0d] text-[#c5a059] text-[11px] font-mono tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Import photo from Google Drive"
                  >
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>From Drive</span>
                  </button>
                )}
              </div>

              {/* Iconic Artistic Flair Circular Shutter Trigger */}
              <button
                id="shutter-capture-btn"
                onClick={triggerCapture}
                disabled={countdown !== null}
                className="w-20 h-20 rounded-full border border-[#e2d1c3] flex items-center justify-center hover:bg-[#e2d1c3] hover:text-[#0d0d0d] transition-all group shadow-[0_0_30px_rgba(226,209,195,0.15)] cursor-pointer"
                title="Initiate capture sequence"
              >
                <div className="w-16 h-16 rounded-full border border-[#e2d1c3] group-hover:border-[#0d0d0d] flex items-center justify-center transition-colors">
                  <div className="w-4 h-4 bg-[#c5a059] group-hover:bg-[#0d0d0d] rounded-xs rotate-45 transition-colors" />
                </div>
              </button>

              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#e2d1c3]/40 min-w-[70px]">
                3s Flash
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                id="retry-camera-btn"
                onClick={() => startCamera('user')}
                className="px-6 py-3 rounded-sm border border-[#c5a059] bg-[#c5a059] text-[#0d0d0d] font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-[#e2d1c3] transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Enable Sensor</span>
              </button>

              {onOpenDrive && (
                <button
                  id="choose-from-drive-fallback-btn"
                  onClick={onOpenDrive}
                  className="px-5 py-3 rounded-sm border border-[#c5a059]/50 bg-[#141211] text-[#c5a059] font-bold text-xs uppercase font-mono tracking-widest flex items-center gap-2 hover:border-[#c5a059] transition-all cursor-pointer"
                >
                  <HardDrive className="w-4 h-4" />
                  <span>Google Drive</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sample Archival Subjects */}
      <div className="bg-[#141211] border border-[#e2d1c3]/15 rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4 border-b border-[#e2d1c3]/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
            <h4 className="text-xs font-mono uppercase tracking-[0.25em] text-[#e2d1c3]/80">
              Archival Test Subjects
            </h4>
          </div>
          <span className="text-[10px] font-mono tracking-widest text-[#e2d1c3]/40">Instant Simulation</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {SAMPLE_PORTRAITS.map((sample) => (
            <button
              key={sample.id}
              id={`sample-portrait-${sample.id}`}
              onClick={() => selectSample(sample)}
              disabled={isLoadingSample}
              className="group aspect-[4/5] bg-[#0d0d0d] border border-[#e2d1c3]/15 hover:border-[#c5a059] relative overflow-hidden transition-all text-left cursor-pointer p-0.5 rounded-sm"
            >
              <img
                src={sample.url}
                alt={sample.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 sepia-[0.15]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-[11px] font-serif italic text-[#e2d1c3] truncate">{sample.name}</p>
                <div className="h-[1px] w-full bg-[#e2d1c3]/20 my-0.5" />
                <p className="text-[8px] font-mono uppercase tracking-wider text-[#c5a059]">{sample.gender}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
