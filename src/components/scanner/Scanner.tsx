"use client";

import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { X, Camera, RefreshCw, AlertCircle } from "lucide-react";

interface ScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
  onScanError?: (error: string) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScanSuccess, onClose, onScanError }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerId = "scanner-container-root";

  const stopTracks = () => {
    try {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
      
      const stream = containerRef.current?.querySelector("video") as HTMLVideoElement;
      if (stream && stream.srcObject instanceof MediaStream) {
        stream.srcObject.getTracks().forEach(track => track.stop());
      }
    } catch (e) {
      console.warn("Error during manual track cleanup", e);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const startScanner = async () => {
      // Small delay to ensure the DOM element is fully rendered and ready
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!isMounted || !containerRef.current) return;

      try {
        const html5QrCode = new Html5Qrcode(containerId);
        scannerRef.current = html5QrCode;

        const config = { 
          fps: 24, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0 
        };

        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          async (decodedText) => {
            if (!isMounted) return;
            
            // Success! Stop scanner first
            if (html5QrCode.isScanning) {
              await html5QrCode.stop().catch(err => console.error("Error stopping scanner on success", err));
              stopTracks();
            }
            
            if (typeof navigator !== "undefined" && navigator.vibrate) {
              navigator.vibrate(100);
            }
            
            onScanSuccess(decodedText);
          },
          (errorMessage) => {
            // Optional: call onScanError if needed, but usually we just ignore it as it's continuous
          } 
        );

        if (isMounted) setIsInitializing(false);
      } catch (err) {
        console.error("Scanner failed to start", err);
        const errorMsg = "Unable to access camera. Please check permissions.";
        if (isMounted) {
          setError(errorMsg);
          setIsInitializing(false);
          if (onScanError) onScanError(errorMsg);
        }
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      const cleanup = async () => {
        if (scannerRef.current && scannerRef.current.isScanning) {
          try {
            await scannerRef.current.stop().catch(() => {});
          } catch (e) {
            console.error("Error stopping scanner during cleanup", e);
          }
        }
        stopTracks();
      };
      cleanup();
    };
  }, [onScanSuccess, onScanError]);

  const handleStop = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.stop().catch(() => {});
    }
    stopTracks();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#323130]/90 backdrop-blur-xl p-4 overflow-hidden animate-in fade-in duration-500">
      <div className="bg-black w-full max-w-lg aspect-square rounded-2xl shadow-2xl overflow-hidden relative border border-[#edebe9]/20 ring-1 ring-white/10">
        
        {/* Modern Business Gradient Accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0078d4]/10 via-transparent to-transparent opacity-40 pointer-events-none" />

        <button 
          onClick={handleStop} 
          className="absolute top-6 right-6 z-[120] w-12 h-12 flex items-center justify-center bg-[#323130]/40 backdrop-blur-2xl rounded-xl text-white hover:bg-[#0078d4] transition-all border border-white/10 shadow-2xl active:scale-95 group"
          title="Đóng trình quét"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="relative w-full h-full bg-black flex items-center justify-center">
          {/* THE ACTUAL SCANNER TARGET */}
          <div 
            id={containerId} 
            ref={containerRef}
            className="w-full h-full"
          />

          {/* OVERLAY ELEMENTS - Professional HUD Style */}
          {!error && !isInitializing && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              {/* Subtle Dimming around edges */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]" />
              
              <div className="w-[280px] h-[280px] border border-white/10 rounded-xl relative">
                {/* Precision Focus Corners (Office Style) */}
                <div className="absolute -top-[2px] -left-[2px] w-10 h-10 border-t-4 border-l-4 border-[#0078d4] rounded-tl-sm shadow-[0_0_15px_rgba(0,120,212,0.4)]" />
                <div className="absolute -top-[2px] -right-[2px] w-10 h-10 border-t-4 border-r-4 border-[#0078d4] rounded-tr-sm shadow-[0_0_15px_rgba(0,120,212,0.4)]" />
                <div className="absolute -bottom-[2px] -left-[2px] w-10 h-10 border-b-4 border-l-4 border-[#0078d4] rounded-bl-sm shadow-[0_0_15px_rgba(0,120,212,0.4)]" />
                <div className="absolute -bottom-[2px] -right-[2px] w-10 h-10 border-b-4 border-r-4 border-[#0078d4] rounded-br-sm shadow-[0_0_15px_rgba(0,120,212,0.4)]" />
                
                {/* Advanced Scan Line with Business Glow */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#0078d4] to-transparent animate-scan-modern z-20 shadow-[0_0_20px_#0078d4]" />
                
                {/* Scanning HUD Text */}
                <div className="absolute -bottom-16 left-0 right-0 flex flex-col items-center gap-2">
                  <div className="px-5 py-2 bg-[#0078d4]/10 backdrop-blur-md rounded-full border border-[#0078d4]/30 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-[#0078d4] rounded-full animate-pulse shadow-[0_0_8px_#0078d4]" />
                    <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">Ready to Capture</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROFESSIONAL LOADING STATE (Fixed based on user feedback) */}
          {isInitializing && !error && (
            <div className="absolute inset-0 z-[110] bg-[#1b1a19] flex flex-col items-center justify-center p-8 text-center overflow-hidden">
               {/* Corporate-style geometric pattern in background */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
               
               <div className="relative mb-10">
                  {/* Outer spinning ring */}
                  <div className="w-32 h-32 border-2 border-white/5 border-t-[#0078d4] rounded-full animate-spin duration-1000" />
                  {/* Inner breathing circle */}
                  <div className="absolute inset-4 border-2 border-[#0078d4]/20 rounded-full animate-pulse" />
                  {/* Center Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-[#0078d4]/10 p-5 rounded-2xl border border-[#0078d4]/20">
                      <Camera className="text-[#0078d4] animate-bounce" size={32} />
                    </div>
                  </div>
               </div>

               <div className="space-y-3 relative z-10">
                  <h2 className="text-[#0078d4] font-black uppercase tracking-[0.4em] text-sm animate-in fade-in slide-in-from-bottom-2 duration-700">
                    System Protocol
                  </h2>
                  <div className="flex flex-col items-center gap-1 opacity-60">
                    <p className="text-white/80 text-[10px] font-medium uppercase tracking-[0.1em]">Handshaking with Camera Hardware...</p>
                    <div className="flex gap-1 mt-2">
                      <div className="w-1 h-3 bg-[#0078d4]/30 rounded-full animate-pulse" />
                      <div className="w-1 h-3 bg-[#0078d4]/50 rounded-full animate-pulse delay-75" />
                      <div className="w-1 h-3 bg-[#0078d4] rounded-full animate-pulse delay-150" />
                    </div>
                  </div>
               </div>
               
               {/* Diagnostic Bottom Bar */}
               <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center text-[8px] font-mono text-white/20 uppercase tracking-widest border-t border-white/5 pt-4">
                  <span>SECURE_LINK: ESTABLISHED</span>
                  <span>OP_CODE: 0x442</span>
               </div>
            </div>
          )}
          
          {/* PROFESSIONAL ERROR STATE */}
          {error && (
            <div className="absolute inset-0 z-[115] bg-[#1b1a19]/95 backdrop-blur-2xl flex items-center justify-center p-8">
              <div className="text-center space-y-8 max-w-xs animate-in zoom-in-95 duration-300">
                <div className="w-24 h-24 bg-red-500/5 rounded-[2rem] flex items-center justify-center mx-auto border border-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                  <div className="p-5 bg-red-500/10 rounded-2xl">
                    <AlertCircle className="text-red-500" size={40} />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-white font-black uppercase tracking-[-0.02em] text-2xl leading-none">Permission Error</p>
                  <p className="text-white/40 text-[11px] font-medium leading-relaxed uppercase tracking-widest px-4">{error}</p>
                </div>

                <div className="grid gap-3">
                  <button 
                    onClick={() => window.location.reload()} 
                    className="w-full bg-[#0078d4] text-white py-4 rounded-xl font-bold uppercase tracking-[0.1em] text-xs hover:bg-[#106ebe] transition-all shadow-xl active:scale-95"
                  >
                    REFRESH SYSTEM
                  </button>
                  <button 
                    onClick={handleStop}
                    className="w-full bg-white/5 text-white/60 py-4 rounded-xl font-bold uppercase tracking-[0.1em] text-[10px] hover:bg-white/10 transition-all"
                  >
                    CANCEL SCAN
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan-modern-move {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(280px); opacity: 0; }
        }
        .animate-scan-modern {
          animation: scan-modern-move 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        #scanner-container-root video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
        }
        #scanner-container-root img { display: none !important; }
        #scanner-container-root { border: none !important; }
        #scanner-container-root div[id*="qr-shaded-region"] { display: none !important; }
      `}</style>
    </div>
  );
};



export default Scanner;
