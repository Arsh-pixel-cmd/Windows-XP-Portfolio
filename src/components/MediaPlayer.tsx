// src/components/MediaPlayer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Square, SkipBack, SkipForward, Volume2, 
  VolumeX, Music, Disc, List, Activity 
} from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number; // seconds
  genre: string;
  notes: number[]; // frequency scale
}

const TRACKS: Track[] = [
  {
    id: 'xp-tour',
    title: 'Windows XP Tour (Velvet Dreams)',
    artist: 'Microsoft Sound Team',
    duration: 135,
    genre: 'Ambient Jazz',
    notes: [261.63, 329.63, 392.00, 523.25, 493.88, 392.00, 329.63, 293.66],
  },
  {
    id: 'synthwave',
    title: 'Neon Bliss Highway',
    artist: 'Arsh Audio Lab',
    duration: 180,
    genre: 'Retro Synthwave',
    notes: [130.81, 196.00, 261.63, 329.63, 392.00, 440.00, 392.00, 329.63],
  },
  {
    id: 'lofi',
    title: 'Midnight Coding in Reducer',
    artist: 'Lofi Kernel',
    duration: 154,
    genre: 'Lo-Fi Chillhop',
    notes: [220.00, 261.63, 329.63, 392.00, 440.00, 329.63, 261.63, 220.00],
  },
  {
    id: 'chiptune',
    title: '8-Bit Taskbar Adventure',
    artist: 'Virtual CPU',
    duration: 110,
    genre: 'Chiptune',
    notes: [329.63, 392.00, 493.88, 587.33, 659.25, 587.33, 493.88, 392.00],
  },
];

export const MediaPlayer: React.FC = () => {
  const [currentTrackIdx, setCurrentTrackIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.7);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [vizMode, setVizMode] = useState<'bars' | 'wave'>('bars');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const stepIdxRef = useRef<number>(0);
  const musicTimerRef = useRef<NodeJS.Timeout | null>(null);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const track = TRACKS[currentTrackIdx];

  const stopAudio = () => {
    if (musicTimerRef.current) clearInterval(musicTimerRef.current);
    if (playTimerRef.current) clearInterval(playTimerRef.current);
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch {
        // already stopped
      }
      oscRef.current = null;
    }
  };

  const startSynthesis = (targetTrack: Track) => {
    stopAudio();

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContextClass();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(isMuted ? 0 : volume * 0.15, ctx.currentTime);
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    const notes = targetTrack.notes;
    stepIdxRef.current = 0;

    // Musical note sequencer
    musicTimerRef.current = setInterval(() => {
      if (!ctx || ctx.state === 'closed') return;
      const noteFreq = notes[stepIdxRef.current % notes.length];
      stepIdxRef.current++;

      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = targetTrack.id === 'chiptune' ? 'square' : targetTrack.id === 'synthwave' ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(noteFreq, ctx.currentTime);

      noteGain.gain.setValueAtTime(0, ctx.currentTime);
      noteGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }, 280);

    // Timeline progress timer
    playTimerRef.current = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= targetTrack.duration) {
          handleNext();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      startSynthesis(track);
    }
  };

  const handleStop = () => {
    stopAudio();
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleNext = () => {
    const nextIdx = (currentTrackIdx + 1) % TRACKS.length;
    setCurrentTrackIdx(nextIdx);
    setCurrentTime(0);
    if (isPlaying) {
      startSynthesis(TRACKS[nextIdx]);
    }
  };

  const handlePrev = () => {
    const prevIdx = (currentTrackIdx - 1 + TRACKS.length) % TRACKS.length;
    setCurrentTrackIdx(prevIdx);
    setCurrentTime(0);
    if (isPlaying) {
      startSynthesis(TRACKS[prevIdx]);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (isMuted && newVol > 0) setIsMuted(false);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(isMuted ? 0 : newVol * 0.15, audioCtxRef.current.currentTime);
    }
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(next ? 0 : volume * 0.15, audioCtxRef.current.currentTime);
    }
  };

  // Canvas visualizer animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      phase += 0.08;
      ctx.fillStyle = '#060E1E';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (vizMode === 'bars') {
        const barCount = 28;
        const barWidth = canvas.width / barCount - 2;

        for (let i = 0; i < barCount; i++) {
          const heightFactor = isPlaying 
            ? (Math.sin(phase + i * 0.4) * 0.4 + 0.6) * (Math.cos(phase * 0.5 + i * 0.2) * 0.3 + 0.7)
            : 0.05;
          const barHeight = Math.max(4, heightFactor * (canvas.height - 16));

          // XP Blue to Cyan gradient
          const grad = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
          grad.addColorStop(0, '#00D2FF');
          grad.addColorStop(0.5, '#0078D7');
          grad.addColorStop(1, '#002875');

          ctx.fillStyle = grad;
          ctx.fillRect(i * (barWidth + 2) + 2, canvas.height - barHeight, barWidth, barHeight);
        }
      } else {
        // Neon green oscilloscope wave
        ctx.strokeStyle = isPlaying ? '#00FF66' : '#005522';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
          const y = isPlaying 
            ? canvas.height / 2 + Math.sin(x * 0.05 + phase * 2) * 22 * Math.cos(x * 0.02 + phase)
            : canvas.height / 2;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, vizMode]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full bg-gradient-to-b from-[#182C54] via-[#0E1A33] to-[#0A1326] flex flex-col font-tahoma text-xs text-white select-none overflow-hidden">
      {/* Top Header / Skin Bar */}
      <div className="h-8 bg-gradient-to-r from-[#1E3768] via-[#2A4D91] to-[#1E3768] px-3 flex items-center justify-between border-b border-[#3E65B0]/40 shadow-md">
        <div className="flex items-center gap-2">
          <Disc size={16} className="text-cyan-400 animate-[spin_6s_linear_infinite]" />
          <span className="font-bold tracking-wide text-xs drop-shadow">
            Windows Media Player
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <button
            onClick={() => setVizMode(vizMode === 'bars' ? 'wave' : 'bars')}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-900/60 hover:bg-blue-800 border border-blue-400/30 text-cyan-200"
          >
            <Activity size={12} />
            <span>Viz: {vizMode === 'bars' ? 'Bars' : 'Wave'}</span>
          </button>
        </div>
      </div>

      {/* Main Visualizer + Track Details */}
      <div className="flex-1 flex overflow-hidden p-2 gap-2">
        {/* Visualizer Display Screen */}
        <div className="flex-1 flex flex-col bg-black rounded border-2 border-[#375A9C] shadow-inner overflow-hidden relative">
          <canvas
            ref={canvasRef}
            width={340}
            height={180}
            className="w-full flex-1"
          />

          {/* Overlay Track Information */}
          <div className="bg-gradient-to-t from-black via-black/80 to-transparent p-3 flex flex-col">
            <span className="text-cyan-300 font-bold text-sm truncate drop-shadow">
              {track.title}
            </span>
            <div className="flex justify-between text-[11px] text-gray-300 mt-0.5">
              <span>{track.artist}</span>
              <span className="text-cyan-400/90 font-mono">
                {formatTime(currentTime)} / {formatTime(track.duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Playlist Pane */}
        <div className="w-56 bg-[#0E1C38] rounded border border-[#2D4D85] flex flex-col overflow-hidden text-xs">
          <div className="bg-[#192E5B] p-1.5 px-2.5 font-bold border-b border-[#2D4D85] flex items-center gap-1.5 text-cyan-100">
            <List size={14} />
            <span>Now Playing List</span>
          </div>
          <div className="flex-1 overflow-auto p-1 space-y-0.5">
            {TRACKS.map((t, idx) => {
              const isSelected = idx === currentTrackIdx;
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    setCurrentTrackIdx(idx);
                    setCurrentTime(0);
                    if (isPlaying) startSynthesis(t);
                  }}
                  className={`p-1.5 rounded cursor-pointer transition-colors flex items-center gap-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#0058EE] to-[#378DFF] text-white font-semibold shadow'
                      : 'hover:bg-white/10 text-gray-300'
                  }`}
                >
                  <Music size={12} className={isSelected ? 'text-white' : 'text-blue-400'} />
                  <div className="flex-1 truncate">
                    <p className="truncate text-[11px]">{t.title}</p>
                    <p className="text-[10px] text-gray-400 font-normal">{t.genre}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-3 pt-1">
        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden border border-gray-600 cursor-pointer">
          <div 
            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-300"
            style={{ width: `${(currentTime / track.duration) * 100}%` }}
          />
        </div>
      </div>

      {/* Bottom Metallic Controls Bar */}
      <div className="h-14 bg-gradient-to-t from-[#0A1326] via-[#14264A] to-[#1E3768] p-2 px-4 flex items-center justify-between border-t border-[#375A9C]/40 shadow-2xl">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-7 h-7 rounded-full bg-gradient-to-b from-[#2A4D91] to-[#162A52] border border-[#4B79D4] flex items-center justify-center text-white hover:brightness-125 active:scale-95 shadow"
            title="Previous"
          >
            <SkipBack size={13} />
          </button>

          <button
            onClick={handlePlayPause}
            className="w-10 h-10 rounded-full bg-gradient-to-b from-[#00D2FF] via-[#0078D7] to-[#00409A] border-2 border-white/80 flex items-center justify-center text-white hover:brightness-110 active:scale-95 shadow-[0_0_12px_rgba(0,180,255,0.6)]"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" className="ml-0.5" />}
          </button>

          <button
            onClick={handleStop}
            className="w-7 h-7 rounded-full bg-gradient-to-b from-[#2A4D91] to-[#162A52] border border-[#4B79D4] flex items-center justify-center text-white hover:brightness-125 active:scale-95 shadow"
            title="Stop"
          >
            <Square size={12} fill="white" />
          </button>

          <button
            onClick={handleNext}
            className="w-7 h-7 rounded-full bg-gradient-to-b from-[#2A4D91] to-[#162A52] border border-[#4B79D4] flex items-center justify-center text-white hover:brightness-125 active:scale-95 shadow"
            title="Next"
          >
            <SkipForward size={13} />
          </button>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleMute}
            className="text-cyan-300 hover:text-white"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={e => handleVolumeChange(parseFloat(e.target.value))}
            className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>
    </div>
  );
};
