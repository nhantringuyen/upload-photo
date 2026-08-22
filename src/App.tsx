import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CameraCapture } from './components/CameraCapture';
import { FaceAnalysisModal } from './components/FaceAnalysisModal';
import { EraSelector } from './components/EraSelector';
import { GeneratingState } from './components/GeneratingState';
import { TimeTravelResult } from './components/TimeTravelResult';
import { PhotoStripModal } from './components/PhotoStripModal';
import { TimePassportModal } from './components/TimePassportModal';
import { CustomEraModal } from './components/CustomEraModal';
import { GalleryView } from './components/GalleryView';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { HISTORICAL_ERAS } from './data/historicalEras';
import { HistoricalEra, SceneOption, FaceAnalysisResult, TimeTravelPhoto } from './types';
import { sound } from './utils/audio';
import { initAuth } from './utils/firebaseAuth';

export default function App() {
  // Navigation & Step State
  const [currentView, setCurrentView] = useState<'booth' | 'gallery' | 'passport'>('booth');
  const [boothStep, setBoothStep] = useState<'capture' | 'analyze' | 'select_era' | 'generating' | 'result'>('capture');

  // Passenger & Source Data
  const [passengerName, setPassengerName] = useState<string>('Eleanor Vance');
  const [sourceImage, setSourceImage] = useState<string | null>(null);

  // Google Drive & Auth State
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [driveToken, setDriveToken] = useState<string | null>(null);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState<boolean>(false);

  // Gemini Analysis State
  const [analysisResult, setAnalysisResult] = useState<FaceAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Eras Configuration
  const [eras, setEras] = useState<HistoricalEra[]>(HISTORICAL_ERAS);
  const [selectedEra, setSelectedEra] = useState<HistoricalEra>(HISTORICAL_ERAS[0]);
  const [selectedScene, setSelectedScene] = useState<SceneOption>(HISTORICAL_ERAS[0].scenes[0]);
  const [customPrompt, setCustomPrompt] = useState<string>('');

  // Generation & Result State
  const [currentPhoto, setCurrentPhoto] = useState<TimeTravelPhoto | null>(null);
  const [teleportError, setTeleportError] = useState<string | null>(null);

  // Modals
  const [isPhotoStripOpen, setIsPhotoStripOpen] = useState<boolean>(false);
  const [isPassportOpen, setIsPassportOpen] = useState<boolean>(false);
  const [isCustomEraModalOpen, setIsCustomEraModalOpen] = useState<boolean>(false);

  // Auth Initialization Listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        if (token) setDriveToken(token);
      },
      () => {
        setGoogleUser(null);
        setDriveToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Gallery Storage
  const [gallery, setGallery] = useState<TimeTravelPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('chrono_booth_gallery');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save gallery to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('chrono_booth_gallery', JSON.stringify(gallery));
    } catch (e) {}
  }, [gallery]);

  // Handle importing a photo from Google Drive into the time travel aperture
  const handleImportAnchorFromDrive = (dataUrl: string, name?: string) => {
    if (name) {
      const cleanName = name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
      setPassengerName(cleanName);
    }
    handlePhotoCaptured(dataUrl);
  };

  // Step 1 -> Step 2: Handle Capture & Analyze Portrait with Gemini 3.1 Pro
  const handlePhotoCaptured = async (imageData: string) => {
    setSourceImage(imageData);
    setBoothStep('analyze');
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/analyze-portrait', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.analysis) {
        setAnalysisResult(data.analysis);

        // If high match era exists in recommendation, preset it
        if (data.analysis.recommendedEras?.[0]?.eraId) {
          const topEra = eras.find((e) => e.id === data.analysis.recommendedEras[0].eraId);
          if (topEra) {
            setSelectedEra(topEra);
            if (topEra.scenes?.[0]) setSelectedScene(topEra.scenes[0]);
          }
        }
      }
    } catch (err) {
      console.warn('Facial analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Select Era from Analysis recommendations directly
  const handleSelectEraFromAnalysis = (eraId: string) => {
    const matched = eras.find((e) => e.id === eraId);
    if (matched) {
      setSelectedEra(matched);
      if (matched.scenes?.[0]) setSelectedScene(matched.scenes[0]);
    }
    setBoothStep('select_era');
  };

  // Step 3 -> Step 4: Execute Time Travel using gemini-3.1-flash-image-preview
  const handleTeleport = async () => {
    if (!sourceImage) return;

    setBoothStep('generating');
    setTeleportError(null);

    try {
      const res = await fetch('/api/time-travel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: sourceImage,
          eraTitle: selectedEra.title,
          eraYear: selectedEra.year,
          sceneName: selectedScene.name,
          scenePromptModifier: selectedScene.promptModifier,
          clothingDescription: selectedEra.clothingDescription,
          backgroundSetting: selectedEra.backgroundSetting,
          artStyle: selectedEra.artStyle,
          customPrompt: customPrompt.trim(),
          passengerName: passengerName || 'Time Traveler',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.generatedImage) {
        throw new Error(data.error || 'Temporal teleportation sequence failed.');
      }

      const newPhotoRecord: TimeTravelPhoto = {
        id: `chrono-${Date.now()}`,
        timestamp: Date.now(),
        originalImage: sourceImage,
        generatedImage: data.generatedImage,
        eraId: selectedEra.id,
        eraTitle: selectedEra.title,
        eraYear: selectedEra.year,
        sceneName: selectedScene.name,
        customPrompt: customPrompt.trim(),
        historicalLore: data.historicalLore,
        passengerName: passengerName || 'Time Traveler',
      };

      setCurrentPhoto(newPhotoRecord);
      setGallery((prev) => [newPhotoRecord, ...prev]);
      setBoothStep('result');
    } catch (err: any) {
      console.error(err);
      setTeleportError(err.message || 'Failed to generate time-travel photo.');
      setBoothStep('select_era');
    }
  };

  // Update photo on AI Edit
  const handleEditedPhoto = (newImageUrl: string) => {
    if (!currentPhoto) return;
    const updated: TimeTravelPhoto = {
      ...currentPhoto,
      generatedImage: newImageUrl,
    };
    setCurrentPhoto(updated);
    setGallery((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  // Add custom era created by user
  const handleCustomEraCreated = (newEra: HistoricalEra) => {
    setEras((prev) => [newEra, ...prev]);
    setSelectedEra(newEra);
    if (newEra.scenes?.[0]) setSelectedScene(newEra.scenes[0]);
  };

  // Reset to initial camera capture
  const handleReset = () => {
    setBoothStep('capture');
    setSourceImage(null);
    setAnalysisResult(null);
    setCurrentPhoto(null);
    setTeleportError(null);
    setCurrentView('booth');
  };

  // Delete photo from gallery
  const handleDeletePhoto = (id: string) => {
    setGallery((prev) => prev.filter((p) => p.id !== id));
    if (currentPhoto?.id === id) {
      setCurrentPhoto(null);
    }
  };

  // Open existing photo in studio
  const handleSelectFromGallery = (photo: TimeTravelPhoto) => {
    setCurrentPhoto(photo);
    const matchedEra = eras.find((e) => e.id === photo.eraId) || {
      id: photo.eraId,
      title: photo.eraTitle,
      year: photo.eraYear,
      eraCategory: '20th_century' as const,
      shortDescription: photo.sceneName,
      detailedContext: photo.historicalLore || '',
      icon: 'Clock',
      accentColor: '#D97706',
      clothingDescription: '',
      backgroundSetting: '',
      artStyle: '',
      scenes: [{ id: 's1', name: photo.sceneName, description: '', promptModifier: '' }],
      samplePrompts: [],
    };
    setSelectedEra(matchedEra);
    setSelectedScene(matchedEra.scenes[0] || { id: 's1', name: photo.sceneName, description: '', promptModifier: '' });
    setSourceImage(photo.originalImage);
    setCurrentView('booth');
    setBoothStep('result');
  };

  return (
    <div id="chrono-booth-app" className="min-h-screen bg-[#0d0d0d] artistic-grid-bg text-[#e2d1c3] font-sans flex flex-col selection:bg-[#c5a059] selection:text-[#0d0d0d]">
      
      {/* Navigation Header */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        galleryCount={gallery.length}
        passengerName={passengerName}
        setPassengerName={setPassengerName}
        onReset={handleReset}
        hasActiveTravel={!!currentPhoto || boothStep !== 'capture'}
        onOpenDrive={() => setIsDriveModalOpen(true)}
        isDriveConnected={!!googleUser}
        userPhoto={googleUser?.photoURL}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {teleportError && (
          <div className="mb-6 p-4 rounded-sm bg-[#141211] border border-[#c5a059]/40 text-[#c5a059] text-xs font-mono flex items-center justify-between shadow-2xl">
            <span>{teleportError}</span>
            <button
              onClick={() => setTeleportError(null)}
              className="text-[#e2d1c3]/70 hover:text-[#e2d1c3] uppercase tracking-wider underline ml-4 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {currentView === 'gallery' ? (
          <GalleryView
            photos={gallery}
            onSelectPhoto={handleSelectFromGallery}
            onDeletePhoto={handleDeletePhoto}
            onNewTravel={handleReset}
            onOpenDrive={() => setIsDriveModalOpen(true)}
          />
        ) : (
          <>
            {boothStep === 'capture' && (
              <CameraCapture
                onCapture={handlePhotoCaptured}
                passengerName={passengerName}
                setPassengerName={setPassengerName}
                onOpenDrive={() => setIsDriveModalOpen(true)}
              />
            )}

            {boothStep === 'analyze' && sourceImage && (
              <FaceAnalysisModal
                analysis={analysisResult}
                isLoading={isAnalyzing}
                sourceImage={sourceImage}
                onSelectEra={handleSelectEraFromAnalysis}
                onProceed={() => setBoothStep('select_era')}
                onRetake={() => setBoothStep('capture')}
              />
            )}

            {boothStep === 'select_era' && sourceImage && (
              <EraSelector
                eras={eras}
                selectedEra={selectedEra}
                setSelectedEra={setSelectedEra}
                selectedScene={selectedScene}
                setSelectedScene={setSelectedScene}
                customPrompt={customPrompt}
                setCustomPrompt={setCustomPrompt}
                onTeleport={handleTeleport}
                onOpenCustomEra={() => setIsCustomEraModalOpen(true)}
                sourceImage={sourceImage}
              />
            )}

            {boothStep === 'generating' && (
              <GeneratingState
                era={selectedEra}
                scene={selectedScene}
                passengerName={passengerName}
              />
            )}

            {boothStep === 'result' && currentPhoto && (
              <TimeTravelResult
                photo={currentPhoto}
                era={selectedEra}
                scene={selectedScene}
                onEditPhoto={handleEditedPhoto}
                onNewEra={() => setBoothStep('select_era')}
                onRetake={handleReset}
                onOpenPhotoStrip={() => setIsPhotoStripOpen(true)}
                onOpenPassport={() => setIsPassportOpen(true)}
                onOpenDrive={() => setIsDriveModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {currentPhoto && (
        <>
          <PhotoStripModal
            isOpen={isPhotoStripOpen}
            onClose={() => setIsPhotoStripOpen(false)}
            currentPhoto={currentPhoto}
            era={selectedEra}
            galleryPhotos={gallery}
          />

          <TimePassportModal
            isOpen={isPassportOpen}
            onClose={() => setIsPassportOpen(false)}
            photo={currentPhoto}
            era={selectedEra}
          />
        </>
      )}

      <CustomEraModal
        isOpen={isCustomEraModalOpen}
        onClose={() => setIsCustomEraModalOpen(false)}
        onEraCreated={handleCustomEraCreated}
      />

      {/* Google Drive Cloud Vault Modal */}
      <GoogleDriveModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        localPhotos={gallery}
        onImportAnchorFromDrive={handleImportAnchorFromDrive}
      />

      {/* Footer */}
      <footer className="border-t border-[#e2d1c3]/10 bg-[#0d0d0d] py-6 text-center text-[10px] text-[#e2d1c3]/40 font-mono tracking-widest uppercase">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CHRONO-LENS • TEMPORAL DISPLACEMENT STUDIO</span>
          <span>POWERED BY GEMINI 3.1 PRO & GEMINI 3.1 FLASH IMAGE • INTEGRATED WITH GOOGLE DRIVE</span>
        </div>
      </footer>

    </div>
  );
}
