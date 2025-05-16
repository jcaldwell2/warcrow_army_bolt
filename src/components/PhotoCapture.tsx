
import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RefreshCw, Check } from 'lucide-react';

interface PhotoCaptureProps {
  onPhotoTaken: (photoData: string) => void;
  phase: string;
  turn: number;
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({ onPhotoTaken, phase, turn }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const takePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame to the canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Add timestamp and game info as overlay
        context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        context.fillRect(0, canvas.height - 40, canvas.width, 40);
        
        context.font = '16px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'left';
        context.fillText(`Phase: ${phase} | Turn: ${turn} | ${new Date().toLocaleString()}`, 10, canvas.height - 15);
        
        // Convert canvas to data URL and set as photo
        const photoData = canvas.toDataURL('image/jpeg');
        setPhoto(photoData);
      }
    }
  }, [phase, turn]);

  const resetPhoto = useCallback(() => {
    setPhoto(null);
  }, []);

  const confirmPhoto = useCallback(() => {
    if (photo) {
      onPhotoTaken(photo);
      stopCamera();
    }
  }, [photo, onPhotoTaken, stopCamera]);

  // Start camera on component mount
  React.useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full overflow-hidden rounded-lg border bg-background">
        {!photo ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-auto"
            style={{ display: stream ? 'block' : 'none' }}
          />
        ) : (
          <img
            src={photo}
            alt="Captured game state"
            className="w-full h-auto"
          />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex gap-2 justify-center w-full">
        {!photo ? (
          <Button onClick={takePhoto} disabled={!stream}>
            <Camera className="mr-2 h-4 w-4" />
            Take Photo
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={resetPhoto}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retake
            </Button>
            <Button onClick={confirmPhoto}>
              <Check className="mr-2 h-4 w-4" />
              Use Photo
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default PhotoCapture;
