import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, RefreshCw, Check, Upload, AlertCircle } from 'lucide-react';
import { playCameraShutterSound, playPopSound } from '../utils/audio';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapturePhoto: (photoDataUrl: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapturePhoto,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Initialize Camera
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 720 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Não foi possível acessar a câmera. Tente enviar uma foto do seu dispositivo!');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const toggleFacingMode = () => {
    playPopSound();
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Crop image in an oval frame and generate base64 png
  const handleSnap = () => {
    if (!videoRef.current) return;
    playCameraShutterSound();

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const size = 400; // Oval crop resolution
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Draw Oval Clip Path
    ctx.beginPath();
    ctx.ellipse(size / 2, size / 2, size * 0.38, size * 0.46, 0, 0, Math.PI * 2);
    ctx.clip();

    // Mirror horizontally if user camera
    if (facingMode === 'user') {
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
    }

    // Calculate crop coordinates from video stream
    const vWidth = video.videoWidth || 640;
    const vHeight = video.videoHeight || 480;
    const minDim = Math.min(vWidth, vHeight);
    const sx = (vWidth - minDim) / 2;
    const sy = (vHeight - minDim) / 2;

    ctx.drawImage(video, sx, sy, minDim, minDim, 0, 0, size, size);

    // Reset transform & stroke pleasant border around oval
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.beginPath();
    ctx.ellipse(size / 2, size / 2, size * 0.38, size * 0.46, 0, 0, Math.PI * 2);
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#FFD54F'; // Golden kid border
    ctx.stroke();

    const dataUrl = canvas.toDataURL('image/png');
    setCapturedImage(dataUrl);
  };

  // Handle local image upload as fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 400;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.beginPath();
        ctx.ellipse(size / 2, size / 2, size * 0.38, size * 0.46, 0, 0, Math.PI * 2);
        ctx.clip();

        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;

        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

        // Border
        ctx.beginPath();
        ctx.ellipse(size / 2, size / 2, size * 0.38, size * 0.46, 0, 0, Math.PI * 2);
        ctx.lineWidth = 12;
        ctx.strokeStyle = '#FFD54F';
        ctx.stroke();

        setCapturedImage(canvas.toDataURL('image/png'));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmPhoto = () => {
    if (!capturedImage) return;
    playPopSound();
    onCapturePhoto(capturedImage);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border-4 border-amber-300 flex flex-col items-center relative"
        >
          {/* Close Button */}
          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-transform active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-4">
            <span className="text-4xl inline-block mb-1">📸</span>
            <h2 className="text-2xl font-extrabold text-slate-800">
              Fotografar Rosto
            </h2>
            <p className="text-slate-500 text-xs font-semibold">
              Recorte oval mágico para colocar seu rostinho no desenho!
            </p>
          </div>

          {/* Captured Preview View vs Live Camera View */}
          {capturedImage ? (
            <div className="flex flex-col items-center w-full my-2">
              <div className="w-64 h-64 rounded-full border-4 border-amber-400 p-2 bg-amber-50 shadow-inner flex items-center justify-center overflow-hidden mb-4">
                <img
                  src={capturedImage}
                  alt="Rosto recortado em formato oval"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    playPopSound();
                    setCapturedImage(null);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Tirar Outra</span>
                </button>

                <button
                  onClick={handleConfirmPhoto}
                  className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/30"
                >
                  <Check className="w-6 h-6" />
                  <span>Usar no Desenho</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full">
              {cameraError ? (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-center my-4 w-full">
                  <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <p className="text-xs text-amber-900 font-medium mb-3">
                    {cameraError}
                  </p>
                  <label className="py-3 px-4 rounded-xl bg-indigo-600 text-white font-bold text-sm cursor-pointer inline-flex items-center gap-2 shadow-md hover:bg-indigo-700">
                    <Upload className="w-4 h-4" />
                    <span>Escolher Foto da Galeria</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              ) : (
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden bg-slate-900 shadow-inner flex items-center justify-center my-2 border-4 border-slate-200">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${
                      facingMode === 'user' ? 'scale-x-[-1]' : ''
                    }`}
                  />

                  {/* Oval Cutout Guide Overlay */}
                  <div className="absolute inset-0 pointer-events-none border-[30px] border-slate-900/60 flex items-center justify-center">
                    <div className="w-48 h-60 rounded-[50%] border-4 border-dashed border-yellow-300 shadow-2xl flex items-center justify-center animate-pulse">
                      <span className="text-white text-xs font-bold bg-slate-900/70 px-2 py-1 rounded-md text-center">
                        Enquadre o Rosto
                      </span>
                    </div>
                  </div>

                  {/* Flip Camera Button */}
                  <button
                    onClick={toggleFacingMode}
                    className="absolute bottom-3 right-3 p-2.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 cursor-pointer border border-white/30"
                    title="Inverter Câmera"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              {!cameraError && (
                <div className="flex flex-col gap-2 w-full mt-3">
                  <button
                    onClick={handleSnap}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 cursor-pointer"
                  >
                    <Camera className="w-6 h-6" />
                    <span>TIRAR FOTO AGORA 📸</span>
                  </button>

                  <label className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer">
                    <Upload className="w-4 h-4 text-slate-500" />
                    <span>Ou carregar foto salva</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
