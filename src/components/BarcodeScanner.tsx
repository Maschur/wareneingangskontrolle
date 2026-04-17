"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const html5QrCodeRef = useRef<unknown>(null);
  const stoppedRef = useRef(false);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  const stopScanner = useCallback(async () => {
    if (stoppedRef.current) return;
    stoppedRef.current = true;
    const scanner = html5QrCodeRef.current as { stop: () => Promise<void>; isScanning?: boolean } | null;
    if (scanner) {
      try { await scanner.stop(); } catch { /* already stopped */ }
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function startScanner() {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (!mounted || !scannerRef.current) return;

        const scanner = new Html5Qrcode("barcode-reader");
        html5QrCodeRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 150 },
          },
          (decodedText) => {
            stopScanner().then(() => {
              onScanRef.current(decodedText);
            });
          },
          () => {}
        );
      } catch {
        if (mounted) {
          setError("Kamera konnte nicht gestartet werden. Bitte manuell eingeben.");
        }
      }
    }

    startScanner();

    return () => {
      mounted = false;
      stopScanner();
    };
  }, [stopScanner]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Barcode scannen</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600"
          >
            ✕
          </button>
        </div>

        {error ? (
          <div className="p-6 text-center">
            <p className="text-sm text-danger mb-3">{error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-magenta text-white rounded-lg text-sm font-medium"
            >
              Schließen
            </button>
          </div>
        ) : (
          <div className="p-4">
            <div
              id="barcode-reader"
              ref={scannerRef}
              className="w-full rounded-lg overflow-hidden"
            />
            <p className="text-xs text-gray-400 text-center mt-3">
              Barcode in den Rahmen halten
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
