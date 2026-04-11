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
          fps: 20, 
          qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
            const width = Math.min(viewfinderWidth * 0.8, 300);
            const height = Math.min(viewfinderHeight * 0.4, 150);
            return { width, height };
          },
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
      <div className="bg-office-surface w-full max-w-lg rounded-office shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="office-toolbar justify-between">
          <div className="flex items-center gap-2">
            <Camera size={16} className="text-office-primary" />
            <h2 className="office-sm font-bold text-office-text-secondary uppercase tracking-widest">QR Code Scanner</h2>
          </div>
          <button onClick={handleStop} className="office-btn-ghost">
            <X size={18} />
          </button>
        </div>

        {/* Scanner Body */}
        <div className="relative aspect-square bg-black flex items-center justify-center">
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
          
          {/* Overlay Guide */}
          {!isInitializing && !error && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] border-2 border-office-primary/50 rounded-office shadow-[0_0_0_100vmax_rgba(0,0,0,0.5)]">
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-office-primary" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-office-primary" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-office-primary" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-office-primary" />
                {/* Scanning line animation */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-office-primary/80 animate-scan shadow-[0_0_8px_var(--office-primary)]" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-office-header border-t border-office-border flex justify-between items-center">
          <p className="office-xs text-office-text-secondary">Position the QR code within the frame to scan.</p>
          <button onClick={handleStop} className="office-btn-secondary py-1">Cancel</button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        #scanner-container video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
    </div>
  );
};

export default Scanner;
