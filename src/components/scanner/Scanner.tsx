"use client";

import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { X, Camera, RefreshCw } from "lucide-react";

interface ScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScanSuccess, onClose }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const stopTracks = () => {
    try {
      if (scannerRef.current) {
        // html5-qrcode's clear() method helps release the video element
        scannerRef.current.clear();
      }
      
      // Manually stop all tracks to ensure camera light turns off immediately
      const stream = document.querySelector("#scanner-container video") as HTMLVideoElement;
      if (stream && stream.srcObject instanceof MediaStream) {
        stream.srcObject.getTracks().forEach(track => track.stop());
      }
    } catch (e) {
      console.warn("Error during manual track cleanup", e);
    }
  };

  useEffect(() => {
    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode("scanner-container");
        scannerRef.current = html5QrCode;

        const config = { 
          fps: 24, 
          aspectRatio: 1.0 
        };

        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          async (decodedText) => {
            if (html5QrCode.isScanning) {
              await html5QrCode.stop().catch(err => console.error("Error stopping scanner on success", err));
              stopTracks(); // Extra safety
            }
            
            if (typeof navigator !== "undefined" && navigator.vibrate) {
              navigator.vibrate(100);
            }
            
            onScanSuccess(decodedText);
          },
          () => {} 
        );
        setIsInitializing(false);
      } catch (err) {
        console.error("Scanner failed to start", err);
        setError("Unable to access camera. Please check permissions.");
        setIsInitializing(false);
      }
    };

    startScanner();

    return () => {
      const cleanup = async () => {
        if (scannerRef.current && scannerRef.current.isScanning) {
          await scannerRef.current.stop().catch(e => console.error("Error stopping scanner", e));
        }
        stopTracks();
      };
      cleanup();
    };
  }, [onScanSuccess]);

  const handleStop = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.stop().catch(() => {});
    }
    stopTracks();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-black w-full max-w-lg aspect-[3/4] sm:aspect-square rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 relative border border-white/10">
        {/* Minimal Close Button */}
        <button 
          onClick={handleStop} 
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-colors border border-white/20"
        >
          <X size={20} />
        </button>

        {/* Scanner Body */}
        <div className="relative w-full h-full bg-black flex items-center justify-center">
          {isInitializing && (
            <div className="text-center space-y-3">
              <RefreshCw className="animate-spin text-white mx-auto" size={32} />
              <p className="text-white office-sm">Initializing camera focus...</p>
            </div>
          )}
          
          {error && (
            <div className="p-6 text-center space-y-3">
              <p className="text-office-error-text office-sm font-bold">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="office-btn-primary"
              >
                Retry
              </button>
            </div>
          )}

          <div id="scanner-container" className="w-full h-full" />
          
          {/* Overlay Guide - Banking App Style */}
          {!isInitializing && !error && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              {/* Subtle Dimming only slightly to keep visibility high */}
              <div className="absolute inset-0 bg-black/20" />
              
              {/* Central Guide Frame */}
              <div className="relative w-72 h-72 border border-white/20 rounded-2xl">
                {/* Modern Corners */}
                <div className="absolute -top-[2px] -left-[2px] w-8 h-8 border-t-4 border-l-4 border-office-primary rounded-tl-2xl" />
                <div className="absolute -top-[2px] -right-[2px] w-8 h-8 border-t-4 border-r-4 border-office-primary rounded-tr-2xl" />
                <div className="absolute -bottom-[2px] -left-[2px] w-8 h-8 border-b-4 border-l-4 border-office-primary rounded-bl-2xl" />
                <div className="absolute -bottom-[2px] -right-[2px] w-8 h-8 border-b-4 border-r-4 border-office-primary rounded-br-2xl" />
                
                {/* Advanced Scan Line */}
                <div className="absolute top-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-office-primary to-transparent animate-scan-modern shadow-[0_0_15px_var(--office-primary)] opacity-80" />
                
                {/* Hint Text in Frame */}
                <div className="absolute -bottom-12 left-0 right-0 text-center">
                  <p className="text-white/80 text-[11px] font-medium tracking-wider uppercase bg-black/40 py-1 px-3 rounded-full inline-block backdrop-blur-md border border-white/10">
                    Align QR code to scan
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Minimal Tooltip */}
        {!isInitializing && !error && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-white text-xs font-medium">Camera Active • 24 FPS</span>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes scan-modern {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-modern {
          animation: scan-modern 3s ease-in-out infinite;
        }
        #scanner-container video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
        }
        /* Hide html5-qrcode's built-in UI if any persists */
        #scanner-container img { display: none !important; }
        #scanner-container { border: none !important; }
      `}</style>
    </div>
  );
};

export default Scanner;
