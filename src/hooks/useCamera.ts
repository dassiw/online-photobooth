import { useCallback, useEffect, useRef, useState } from 'react';
import { createDemoCameraStream, type DemoStreamHandle } from '../utils/demoStream';

export interface UseCameraResult {
  stream: MediaStream | null;
  isDemo: boolean;
  isLoading: boolean;
  error: string | null;
  startCamera: () => Promise<void>;
  enableDemoCamera: (label?: string) => void;
  stopCamera: () => void;
}

export function useCamera(defaultLabel = 'You'): UseCameraResult {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const demoHandleRef = useRef<DemoStreamHandle | null>(null);

  const stopCamera = useCallback(() => {
    if (demoHandleRef.current) {
      demoHandleRef.current.stop();
      demoHandleRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setStream(null);
    setIsDemo(false);
  }, []);

  const enableDemoCamera = useCallback(
    (label = defaultLabel) => {
      stopCamera();
      const handle = createDemoCameraStream('local', label);
      demoHandleRef.current = handle;
      streamRef.current = handle.stream;
      setStream(handle.stream);
      setIsDemo(true);
      setError(null);
    },
    [defaultLabel, stopCamera],
  );

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setIsLoading(false);
      setError('Camera API is unavailable in this browser. Switched to Demo Camera!');
      enableDemoCamera();
      return;
    }

    try {
      stopCamera();
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = mediaStream;
      setStream(mediaStream);
      setIsDemo(false);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Unable to access webcam.';
      setError(`Webcam unavailable (${msg}). Using Demo Camera so you can shoot right away!`);
      enableDemoCamera();
    } finally {
      setIsLoading(false);
    }
  }, [enableDemoCamera, stopCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    stream,
    isDemo,
    isLoading,
    error,
    startCamera,
    enableDemoCamera,
    stopCamera,
  };
}
