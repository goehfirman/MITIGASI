"use client";
import { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Play } from 'lucide-react';
import './audio-player.css';

export default function AudioPlayer({ autoPlayRequested }: { autoPlayRequested?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const initializedRef = useRef(false);

  // Restore saved audio settings from localStorage
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    try {
      const savedVolume = localStorage.getItem('mitigasi_audio_volume');
      if (savedVolume !== null) {
        const v = parseFloat(savedVolume);
        if (!isNaN(v) && v >= 0 && v <= 1) {
          setVolume(v);
          if (audioRef.current) audioRef.current.volume = v;
        }
      }

      const savedMuted = localStorage.getItem('mitigasi_audio_muted');
      if (savedMuted === 'true') {
        setIsMuted(true);
        if (audioRef.current) audioRef.current.muted = true;
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const playAudio = useCallback(() => {
    if (!audioRef.current) return;
    const isPausedByUser = sessionStorage.getItem('mitigasi_audio_user_paused') === 'true';
    if (isPausedByUser) return;

    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      // Browser autoplay policy blocked; will play on first user interaction
      setIsPlaying(false);
    });
  }, []);

  // Handle explicit autoPlayRequested prop
  useEffect(() => {
    if (autoPlayRequested) {
      sessionStorage.removeItem('mitigasi_audio_user_paused');
      playAudio();
    }
  }, [autoPlayRequested, playAudio]);

  // Handle auto-play attempt and user interaction listeners
  useEffect(() => {
    playAudio();

    const onUserInteraction = () => {
      playAudio();
    };

    const onRequestPlay = () => {
      sessionStorage.removeItem('mitigasi_audio_user_paused');
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    };

    window.addEventListener('click', onUserInteraction, { passive: true });
    window.addEventListener('touchstart', onUserInteraction, { passive: true });
    window.addEventListener('keydown', onUserInteraction, { passive: true });
    window.addEventListener('request-play-music', onRequestPlay);

    return () => {
      window.removeEventListener('click', onUserInteraction);
      window.removeEventListener('touchstart', onUserInteraction);
      window.removeEventListener('keydown', onUserInteraction);
      window.removeEventListener('request-play-music', onRequestPlay);
    };
  }, [playAudio]);

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !audioRef.current.muted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
      try {
        localStorage.setItem('mitigasi_audio_muted', newMuted ? 'true' : 'false');
      } catch {}
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        sessionStorage.removeItem('mitigasi_audio_user_paused');
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      } else {
        sessionStorage.setItem('mitigasi_audio_user_paused', 'true');
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    try {
      localStorage.setItem('mitigasi_audio_volume', String(newVolume));
    } catch {}
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
    <div className="audio-player-container" role="region" aria-label="Pemutar Musik Latar">
      <audio 
        ref={audioRef} 
        src="/background-music.mp3?v=3" 
        loop 
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <button 
        onClick={togglePlay} 
        aria-label={isPlaying ? "Jeda Musik" : "Putar Musik"} 
        title={isPlaying ? "Jeda Musik Latar" : "Putar Musik Latar"}
        className="audio-control-btn"
      >
        {isPlaying ? (
          <div className="equalizer playing" title="Musik sedang berputar">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        ) : (
          <Play size={16} className="play-icon" />
        )}
      </button>
      
      <div className="volume-wrapper">
        <button 
          onClick={toggleMute} 
          aria-label={isMuted || volume === 0 ? "Nyalakan Suara" : "Matikan Suara"} 
          title={isMuted || volume === 0 ? "Nyalakan Suara" : "Matikan Suara"}
          className="audio-control-btn"
        >
          {isMuted || volume === 0 ? <VolumeX size={17} /> : <Volume2 size={17} />}
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
            aria-label="Volume Musik"
            title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
          />
        </div>
      </div>
    </div>
  );
}
