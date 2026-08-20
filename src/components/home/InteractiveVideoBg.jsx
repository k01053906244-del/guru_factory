import React, { useRef, useEffect } from 'react';

export default function InteractiveVideoBg({ isPlaying = true }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div 
      className={`fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-30 bg-slate-950 transition-opacity duration-500 gpu-layer ${
        isPlaying ? 'opacity-100' : 'opacity-15'
      }`}
      style={{ contain: 'strict' }}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover brightness-95 contrast-105 gpu-layer"
        style={{ transform: 'translateZ(0)' }}
      >
        <source src="./bg-video.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
