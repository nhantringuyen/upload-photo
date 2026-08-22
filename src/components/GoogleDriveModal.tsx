import React, { useState, useEffect } from 'react';
import {
  X,
  HardDrive,
  Cloud,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2,
  RefreshCw,
  Search,
  LogIn,
  LogOut,
  FolderSync,
  UserCheck,
  Download,
  Sparkles,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import {
  googleSignIn,
  logout,
  getAccessToken,
  initAuth
} from '../utils/firebaseAuth';
import {
  listChronoDriveFiles,
  deleteDriveFile,
  getDriveStorageInfo,
  uploadImageToDrive,
  downloadDriveFileAsDataUrl,
  DriveFile,
  DriveStorageQuota,
} from '../utils/googleDriveService';
import { TimeTravelPhoto } from '../types';
import { sound } from '../utils/audio';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  localPhotos: TimeTravelPhoto[];
  onImportAnchorFromDrive?: (imageDataUrl: string, name?: string) => void;
  onDriveSyncSuccess?: (driveFile: DriveFile) => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  localPhotos,
  onImportAnchorFromDrive,
  onDriveSyncSuccess,
}) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [storageInfo, setStorageInfo] = useState<DriveStorageQuota | null>(null);

  // Syncing state
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncProgress, setSyncProgress] = useState<{ current: number; total: number } | null>(null);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  // Explicit confirmation modal for deletion (Mandatory for destructive actions)
  const [itemToDelete, setItemToDelete] = useState<DriveFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (authenticatedUser, cachedToken) => {
        setUser(authenticatedUser);
        if (cachedToken) {
          setToken(cachedToken);
        }
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch drive files when token changes or modal opens
  useEffect(() => {
    if (isOpen && token) {
      loadDriveData();
    }
  }, [isOpen, token]);

  const loadDriveData = async () => {
    const currentToken = token || getAccessToken();
    if (!currentToken) return;

    setIsLoadingFiles(true);
    setAuthError(null);
    try {
      const [files, info] = await Promise.all([
        listChronoDriveFiles(currentToken, searchTerm),
        getDriveStorageInfo(currentToken),
      ]);
      setDriveFiles(files);
      setStorageInfo(info);
    } catch (err: any) {
      console.error('Failed to fetch Drive files:', err);
      setAuthError(err.message || 'Unable to access Google Drive records.');
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setAuthError(null);
    sound.playBeep(600, 0.05);
    try {
      const authResult = await googleSignIn();
      if (authResult) {
        setUser(authResult.user);
        setToken(authResult.accessToken);
        sound.playSuccess();
      }
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      setAuthError(err.message || 'Google authentication was cancelled or failed.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setDriveFiles([]);
      setStorageInfo(null);
      sound.playBeep(400, 0.05);
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  const handleSyncAllToDrive = async () => {
    const currentToken = token || getAccessToken();
    if (!currentToken || localPhotos.length === 0) return;

    setIsSyncingAll(true);
    setSyncSuccessMsg(null);
    sound.playBeep(700, 0.05);

    let syncedCount = 0;
    try {
      for (let i = 0; i < localPhotos.length; i++) {
        setSyncProgress({ current: i + 1, total: localPhotos.length });
        const photo = localPhotos[i];
        
        // Upload image
        const result = await uploadImageToDrive(currentToken, {
          fileName: `ChronoLens_${photo.eraYear.replace(/\s+/g, '_')}_${photo.eraTitle.replace(/\s+/g, '_')}_${photo.id.substring(0, 6)}.png`,
          dataUrl: photo.generatedImage,
          description: `Chrono-Lens Historical Portrait • Era: ${photo.eraTitle} (${photo.eraYear}) • Scene: ${photo.sceneName} • Subject: ${photo.passengerName || 'Traveler'}`,
          properties: {
            eraId: photo.eraId,
            eraYear: photo.eraYear,
            passengerName: photo.passengerName || 'Traveler',
          },
        });
        syncedCount++;
        if (onDriveSyncSuccess) {
          onDriveSyncSuccess(result);
        }
      }
      sound.playSuccess();
      setSyncSuccessMsg(`Successfully uploaded ${syncedCount} temporal portraits to your Google Drive.`);
      await loadDriveData();
    } catch (err: any) {
      console.error('Sync all error:', err);
      setAuthError(err.message || 'Encountered an issue during Google Drive cloud sync.');
    } finally {
      setIsSyncingAll(false);
      setSyncProgress(null);
    }
  };

  // Perform confirmed deletion
  const executeDeleteFile = async () => {
    if (!itemToDelete) return;
    const currentToken = token || getAccessToken();
    if (!currentToken) return;

    setIsDeleting(true);
    try {
      await deleteDriveFile(currentToken, itemToDelete.id);
      setDriveFiles((prev) => prev.filter((f) => f.id !== itemToDelete.id));
      setItemToDelete(null);
      sound.playBeep(450, 0.08);
    } catch (err: any) {
      console.error('Deletion error:', err);
      setAuthError(err.message || 'Failed to remove file from Google Drive.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Import drive file as anchor into booth
  const handleImportAsAnchor = async (file: DriveFile) => {
    const currentToken = token || getAccessToken();
    if (!currentToken || !onImportAnchorFromDrive) return;

    try {
      sound.playBeep(800, 0.05);
      const dataUrl = await downloadDriveFileAsDataUrl(currentToken, file.id, file.mimeType);
      onImportAnchorFromDrive(dataUrl, file.name);
      onClose();
      sound.playSuccess();
    } catch (err: any) {
      console.error('Failed to import Drive photo:', err);
      setAuthError(err.message || 'Could not import picture from Google Drive.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="google-drive-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0d0d]/85 backdrop-blur-md animate-in fade-in"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#141211] border border-[#e2d1c3]/20 rounded-xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#e2d1c3]/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-[#c5a059]/40 bg-[#0d0d0d] flex items-center justify-center text-[#c5a059]">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-serif italic text-[#e2d1c3]">
                  Google Drive Cloud Vault
                </h3>
                <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-xs bg-[#0d0d0d] text-[#c5a059] border border-[#c5a059]/30">
                  Google Workspace
                </span>
              </div>
              <p className="text-xs text-[#e2d1c3]/60 font-sans">
                Store, browse, and synchronize historical plates directly with your Google Drive.
              </p>
            </div>
          </div>

          <button
            id="close-drive-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full border border-[#e2d1c3]/15 text-[#e2d1c3]/60 hover:text-[#e2d1c3] hover:border-[#c5a059] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-1 custom-scrollbar">
          
          {authError && (
            <div className="p-3.5 rounded-sm bg-[#141211] border border-[#c5a059]/40 text-[#c5a059] text-xs font-mono flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{authError}</span>
              </div>
              <button
                onClick={() => setAuthError(null)}
                className="text-[#e2d1c3]/60 hover:text-[#e2d1c3] text-[10px] uppercase font-mono"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Not signed in state */}
          {!user || !token ? (
            <div className="bg-[#0d0d0d] border border-[#e2d1c3]/15 rounded-lg p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full border border-[#c5a059]/40 bg-[#141211] flex items-center justify-center text-[#c5a059] mx-auto shadow-inner">
                <Cloud className="w-8 h-8" />
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <h4 className="text-xl font-serif italic text-[#e2d1c3]">
                  Connect Your Google Drive
                </h4>
                <p className="text-xs text-[#e2d1c3]/70 font-sans leading-relaxed">
                  Sign in with your Google account to automatically archive high-resolution temporal portraits, photo strips, and passport visas in your dedicated Google Drive vault.
                </p>
              </div>

              {/* Standard Google Sign In Button */}
              <div className="flex justify-center pt-2">
                <button
                  id="google-signin-drive-btn"
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="px-6 py-3 rounded-sm bg-[#ffffff] hover:bg-[#f1f1f1] text-[#1f1f1f] font-semibold text-xs flex items-center gap-3 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>{isSigningIn ? 'Connecting to Google...' : 'Sign in with Google'}</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#e2d1c3]/40">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Protected by Google Workspace OAuth • Encrypted in transit</span>
              </div>
            </div>
          ) : (
            /* Signed In User View */
            <div className="space-y-6">
              
              {/* Account Status Card */}
              <div className="bg-[#0d0d0d] border border-[#e2d1c3]/15 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Google User'}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full border border-[#c5a059]/40 object-cover"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full border border-[#c5a059]/40 bg-[#141211] flex items-center justify-center text-[#c5a059]">
                      <UserCheck className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-[#e2d1c3]">
                        {user.displayName || 'Google Drive User'}
                      </h4>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs bg-[#141211] text-[#c5a059] border border-[#c5a059]/30 text-[9px] font-mono">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                        Connected
                      </span>
                    </div>
                    <p className="text-xs text-[#e2d1c3]/60 font-mono">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    id="refresh-drive-btn"
                    onClick={loadDriveData}
                    disabled={isLoadingFiles}
                    className="px-3 py-1.5 rounded-sm border border-[#e2d1c3]/20 hover:border-[#c5a059] text-[#e2d1c3]/70 hover:text-[#e2d1c3] text-[11px] font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Reload Google Drive archives"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>

                  <button
                    id="signout-drive-btn"
                    onClick={handleSignOut}
                    className="px-3 py-1.5 rounded-sm border border-rose-900/40 hover:border-rose-600 text-rose-300 hover:text-rose-200 text-[11px] font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>

              {/* Sync Actions Bar */}
              <div className="bg-[#0d0d0d] border border-[#e2d1c3]/15 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono text-[#c5a059] uppercase tracking-widest block">
                    LOCAL ARCHIVES SYNC
                  </span>
                  <p className="text-xs text-[#e2d1c3]/70 font-sans">
                    You have <strong className="text-[#e2d1c3]">{localPhotos.length}</strong> temporal portraits in your session memory.
                  </p>
                </div>

                <button
                  id="sync-all-local-to-drive-btn"
                  onClick={handleSyncAllToDrive}
                  disabled={isSyncingAll || localPhotos.length === 0}
                  className="px-4 py-2 rounded-sm bg-[#c5a059] hover:bg-[#e2d1c3] text-[#0d0d0d] font-bold text-xs uppercase font-mono tracking-widest flex items-center gap-2 shadow-md transition-all disabled:opacity-40 cursor-pointer self-start sm:self-auto"
                >
                  {isSyncingAll ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>
                        Syncing ({syncProgress?.current}/{syncProgress?.total})...
                      </span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Sync All to Drive Vault</span>
                    </>
                  )}
                </button>
              </div>

              {syncSuccessMsg && (
                <div className="p-3 rounded-sm bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{syncSuccessMsg}</span>
                </div>
              )}

              {/* Search & Header for Files */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FolderSync className="w-4 h-4 text-[#c5a059]" />
                    <h4 className="text-base font-serif italic text-[#e2d1c3]">
                      Vault Contents ({driveFiles.length} archived files)
                    </h4>
                  </div>

                  <div className="relative max-w-xs w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#e2d1c3]/40" />
                    <input
                      id="drive-search-input"
                      type="text"
                      placeholder="Search vault plates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && loadDriveData()}
                      className="w-full bg-[#0d0d0d] border border-[#e2d1c3]/20 rounded-sm pl-9 pr-3 py-1.5 text-xs text-[#e2d1c3] placeholder-[#e2d1c3]/30 focus:border-[#c5a059] focus:outline-none font-sans"
                    />
                  </div>
                </div>

                {/* Drive Files Grid */}
                {isLoadingFiles ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-10 h-10 rounded-full border border-[#c5a059] border-t-transparent animate-spin mx-auto" />
                    <p className="text-xs font-mono text-[#c5a059] uppercase tracking-widest">
                      Reading Google Drive Vault...
                    </p>
                  </div>
                ) : driveFiles.length === 0 ? (
                  <div className="bg-[#0d0d0d] border border-[#e2d1c3]/15 rounded-lg p-10 text-center space-y-3">
                    <Cloud className="w-8 h-8 text-[#e2d1c3]/30 mx-auto" />
                    <h5 className="font-serif italic text-base text-[#e2d1c3]">
                      No Plates in Drive Vault Yet
                    </h5>
                    <p className="text-xs text-[#e2d1c3]/60 max-w-sm mx-auto font-sans">
                      Portraits you save to Google Drive will appear here. Use "Sync All to Drive Vault" or save individually from the Aperture Studio.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {driveFiles.map((file) => (
                      <div
                        key={file.id}
                        id={`drive-file-item-${file.id}`}
                        className="group bg-[#0d0d0d] border border-[#e2d1c3]/15 hover:border-[#c5a059]/60 rounded-md p-3 space-y-2.5 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          {/* Thumbnail / Placeholder */}
                          <div className="relative aspect-[4/3] bg-[#141211] rounded-xs overflow-hidden border border-[#e2d1c3]/10 flex items-center justify-center">
                            {file.thumbnailLink ? (
                              <img
                                src={file.thumbnailLink}
                                alt={file.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="flex flex-col items-center gap-1 text-[#e2d1c3]/40">
                                <Cloud className="w-6 h-6 text-[#c5a059]/70" />
                                <span className="text-[9px] font-mono uppercase tracking-widest">
                                  Drive Plate
                                </span>
                              </div>
                            )}

                            {file.createdTime && (
                              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-xs bg-[#0d0d0d]/85 text-[8px] font-mono tracking-widest text-[#c5a059] border border-[#c5a059]/30">
                                {new Date(file.createdTime).toLocaleDateString()}
                              </div>
                            )}
                          </div>

                          <div>
                            <h5 className="font-serif italic text-xs text-[#e2d1c3] line-clamp-1 group-hover:text-[#c5a059] transition-colors" title={file.name}>
                              {file.name}
                            </h5>
                            {file.description && (
                              <p className="text-[10px] text-[#e2d1c3]/50 line-clamp-2 font-sans mt-0.5">
                                {file.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* File Action Triggers */}
                        <div className="pt-2 border-t border-[#e2d1c3]/10 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            {onImportAnchorFromDrive && file.mimeType.startsWith('image/') && (
                              <button
                                onClick={() => handleImportAsAnchor(file)}
                                className="px-2 py-1 rounded-xs bg-[#141211] hover:bg-[#c5a059] hover:text-[#0d0d0d] text-[#c5a059] border border-[#c5a059]/30 text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
                                title="Use this drive photo as subject portrait in booth"
                              >
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>Load Plate</span>
                              </button>
                            )}

                            {file.webViewLink && (
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded-xs text-[#e2d1c3]/50 hover:text-[#e2d1c3] hover:bg-[#141211] transition-colors"
                                title="Open in Google Drive"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>

                          {/* Delete Action (Triggers Confirmation Modal) */}
                          <button
                            onClick={() => setItemToDelete(file)}
                            className="p-1 rounded-xs text-[#e2d1c3]/30 hover:text-rose-400 hover:bg-[#141211] transition-colors cursor-pointer"
                            title="Delete plate from Google Drive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-[#e2d1c3]/15 flex items-center justify-between text-xs">
          <div className="text-[10px] font-mono text-[#e2d1c3]/40 tracking-wider">
            FOLDER: "Chrono-Lens Temporal Archives"
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-sm bg-[#0d0d0d] hover:bg-[#1a1715] border border-[#e2d1c3]/20 text-[#e2d1c3] font-mono text-xs uppercase tracking-wider cursor-pointer"
          >
            Close Vault
          </button>
        </div>
      </div>

      {/* MANDATORY USER CONFIRMATION DIALOG FOR DESTRUCTIVE ACTION (Drive File Delete) */}
      {itemToDelete && (
        <div
          id="drive-delete-confirmation-dialog"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#000000]/90 backdrop-blur-md animate-in fade-in"
        >
          <div className="w-full max-w-md bg-[#141211] border border-rose-600/60 rounded-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-9 h-9 rounded-full bg-rose-950/60 border border-rose-600/60 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <h4 className="text-lg font-serif italic text-[#e2d1c3]">
                Confirm Permanent Removal
              </h4>
            </div>

            <p className="text-xs text-[#e2d1c3]/80 font-sans leading-relaxed">
              Are you sure you want to permanently delete the plate <strong className="text-[#e2d1c3]">"{itemToDelete.name}"</strong> from your Google Drive? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e2d1c3]/15">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-sm border border-[#e2d1c3]/20 text-[#e2d1c3]/70 hover:text-[#e2d1c3] font-mono text-xs uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>

              <button
                id="confirm-delete-drive-file-btn"
                type="button"
                disabled={isDeleting}
                onClick={executeDeleteFile}
                className="px-4 py-2 rounded-sm bg-rose-700 hover:bg-rose-600 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Removing...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3 h-3" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
