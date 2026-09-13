"use client";
import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import './audio-player.css';

export default function AudioPlayer({ autoPlayRequested }: { autoPlayRequested?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (autoPlayRequested && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        setIsPlaying(false);
      });
    }
  }, [autoPlayRequested]);

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !audioRef.current.muted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      if (newVolume === 0) {
        audioRef.current.muted = true;
        setIsMuted(true);
      } else {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  return (
    <div className="audio-player-container">
      <audio 
        ref={audioRef} 
        src="/background-music.mp3" 
        loop 
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <button onClick={togglePlay} aria-label="Toggle Play" className="audio-control-btn">
        <div className={`equalizer ${isPlaying ? 'playing' : ''}`}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </button>
      
      <div className="volume-wrapper">
        <button onClick={toggleMute} aria-label="Toggle Volume" className="audio-control-btn">
          {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <div className="volume-slider-container">
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            value={isMuted ? 0 : volume} 
            onChange={handleVolumeChange} 
            className="volume-slider"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}
