"use client";
import { useEffect, useRef, useState } from "react";

type Detected = { rawValue: string };
type NativeDetector = { detect: (source: HTMLVideoElement) => Promise<Detected[]> };
type DetectorClass = {
  new (options: { formats: string[] }): NativeDetector;
  getSupportedFormats?: () => Promise<string[]>;
};

const voucherCode = (raw: string) => raw.toUpperCase().match(/VS-[A-Z0-9]{6,20}/)?.[0] || "";

const cameraError = (error: unknown) => {
  const name = error instanceof DOMException ? error.name : "";
  if (name === "NotAllowedError" || name === "SecurityError") return "Accesso alla fotocamera negato. Consentilo dalle impostazioni del browser e riprova.";
  if (name === "NotFoundError" || name === "OverconstrainedError") return "Nessuna fotocamera trovata su questo dispositivo.";
  return "Impossibile avviare la fotocamera. Puoi scrivere il codice a mano.";
};

export default function QrScanner({ onCode, onClose }: { onCode: (code: string) => void; onClose: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const handler = useRef(onCode);
  const [supported] = useState(() => typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia));
  const [error, setError] = useState("");
  const [hint, setHint] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    handler.current = onCode;
  });

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);

  useEffect(() => {
    if (!supported) return;
    let stopped = false;
    let frame = 0;
    let stream: MediaStream | null = null;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      } catch (reason) {
        if (!stopped) setError(cameraError(reason));
        return;
      }
      const element = video.current;
      if (stopped || !element) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      element.srcObject = stream;
      await element.play().catch(() => undefined);
      if (stopped) return;
      setReady(true);

      const Detector = (window as unknown as { BarcodeDetector?: DetectorClass }).BarcodeDetector;
      const formats = Detector ? await Detector.getSupportedFormats?.().catch(() => []) : [];
      const native = Detector && formats?.includes("qr_code") ? new Detector({ formats: ["qr_code"] }) : null;
      const decode = native ? null : (await import("jsqr")).default;

      const tick = async () => {
        if (stopped) return;
        let raw = "";
        if (element.readyState >= 2 && element.videoWidth) {
          if (native) {
            raw = (await native.detect(element).catch(() => []))[0]?.rawValue || "";
          } else if (decode && context) {
            const scale = Math.min(1, 640 / Math.max(element.videoWidth, element.videoHeight));
            canvas.width = Math.round(element.videoWidth * scale);
            canvas.height = Math.round(element.videoHeight * scale);
            context.drawImage(element, 0, 0, canvas.width, canvas.height);
            const image = context.getImageData(0, 0, canvas.width, canvas.height);
            raw = decode(image.data, image.width, image.height, { inversionAttempts: "dontInvert" })?.data || "";
          }
        }
        if (stopped) return;
        const code = voucherCode(raw);
        if (code) {
          navigator.vibrate?.(60);
          handler.current(code);
          return;
        }
        if (raw) setHint("Questo QR non è un voucher Virginia SPA.");
        frame = requestAnimationFrame(() => void tick());
      };
      void tick();
    };

    void start();
    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [supported]);

  const message = !supported ? "Questo browser non può usare la fotocamera. Apri l’area staff da Safari o Chrome su https, oppure scrivi il codice." : error;

  return (
    <div className="staff-scanner" role="dialog" aria-modal="true" aria-labelledby="staff-scanner-title">
      <div className="staff-scanner-panel">
        <header>
          <h2 id="staff-scanner-title">Scansiona voucher</h2>
          <button type="button" onClick={onClose}>Chiudi</button>
        </header>
        <div className={`staff-scanner-view${ready ? " is-ready" : ""}`}>
          <video ref={video} muted playsInline aria-hidden="true" />
          {!message && <span className="staff-scanner-frame" aria-hidden="true" />}
          {message ? <p role="alert">{message}</p> : !ready ? <p>Avvio fotocamera…</p> : null}
        </div>
        <p className="staff-scanner-help" aria-live="polite">{hint || "Inquadra il QR stampato sul voucher. Il codice viene letto da solo."}</p>
      </div>
    </div>
  );
}
