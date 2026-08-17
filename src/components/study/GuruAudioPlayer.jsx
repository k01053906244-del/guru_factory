import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function GuruAudioPlayer({
  title = "쇼핑카트에서 발견한 2,700% 수익의 비결",
  author = "피터 린치",
  audioSrc = "/audio/peter_lynch/shopping_cart_2700_secret.m4a"
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Audio playback error:", err);
      });
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const skipTime = (seconds) => {
    if (!audioRef.current) return;
    const newTime = Math.min(Math.max(audioRef.current.currentTime + seconds, 0), duration);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const changePlaybackRate = () => {
    const rates = [1.0, 1.2, 1.5, 2.0];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds === 0) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-gradient-to-r from-slate-950 via-indigo-950/90 to-purple-950/90 p-5 md:p-6 rounded-[2rem] border-2 border-amber-400/60 shadow-2xl space-y-4 text-white relative overflow-hidden backdrop-blur-xl">
      
      {/* 백그라운드 오디오 엘리먼트 */}
      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      {/* 상단 뱃지 & 실시간 이퀄라이저 웨이브폼 */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[12px] font-black text-amber-300 uppercase tracking-wide">
            🎧 AI 오디오 브리핑 바이블 · 실시간 스트리밍
          </span>
        </div>

        {/* 재생 중 실시간 사운드 이퀄라이저 바 */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/15">
          <span className="text-[11px] font-bold text-white/70">
            {isPlaying ? '🎙️ AI 해설 방송 중' : '⏸️ 재생 대기'}
          </span>
          <div className="flex items-end gap-0.5 h-3.5 w-6">
            {[40, 90, 60, 100, 70].map((h, i) => (
              <span
                key={i}
                style={{ height: isPlaying ? `${h}%` : '20%' }}
                className={`w-1 bg-amber-400 rounded-full transition-all duration-300 ${
                  isPlaying ? 'animate-pulse' : ''
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 오디오 메인 타이틀 & 설명 */}
      <div className="flex items-center gap-4">
        <div 
          onClick={togglePlay}
          className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-500 flex items-center justify-center text-slate-950 shadow-xl cursor-pointer hover:scale-105 transition-transform flex-shrink-0 active:scale-95 group"
        >
          <span className="material-symbols-outlined text-[32px] md:text-[36px] group-hover:scale-110 transition-transform">
            {isLoading ? 'hourglass_top' : isPlaying ? 'pause' : 'play_arrow'}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[11px] font-extrabold text-indigo-300 bg-indigo-900/60 px-2 py-0.5 rounded border border-indigo-500/30">
              {author} 직강 팟캐스트
            </span>
            <span className="text-[11px] text-white/50">
              {duration > 0 ? `· 총 ${Math.round(duration / 60)}분 오디오` : '· AI 오디오 바이블'}
            </span>
          </div>
          <h3 className="text-[16px] md:text-[19px] font-black text-white truncate">
            {title}
          </h3>
          <p className="text-[12px] text-white/70 truncate">
            노트북LM AI가 완벽하게 추출한 피터 린치의 텐배거(10루타) 발굴 오디오 해설
          </p>
        </div>
      </div>

      {/* 프로그레스 바 & 타임스탬프 */}
      <div className="space-y-1.5 pt-1">
        <div className="relative w-full flex items-center">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
            style={{
              background: `linear-gradient(to right, #f59e0b ${progressPercent}%, #0f172a ${progressPercent}%)`
            }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] font-mono text-white/60">
          <span>{formatTime(currentTime)}</span>
          <span className="text-amber-300 font-extrabold">
            {duration > 0 ? formatTime(duration) : '로딩 중...'}
          </span>
        </div>
      </div>

      {/* 재생 컨트롤러 버튼들 (15초 뒤로, 재생/정지, 15초 앞으로, 배속) */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => skipTime(-15)}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[12px] font-extrabold rounded-xl border border-white/15 transition-all flex items-center gap-1 active:scale-95"
            title="15초 뒤로 이동"
          >
            <span className="material-symbols-outlined text-[16px]">replay_10</span>
            <span className="hidden sm:inline">-15초</span>
          </button>

          <button
            onClick={() => skipTime(15)}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[12px] font-extrabold rounded-xl border border-white/15 transition-all flex items-center gap-1 active:scale-95"
            title="15초 앞으로 이동"
          >
            <span className="material-symbols-outlined text-[16px]">forward_10</span>
            <span className="hidden sm:inline">+15초</span>
          </button>
        </div>

        {/* 배속 조절 버튼 */}
        <button
          onClick={changePlaybackRate}
          className="px-3.5 py-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-mono font-black text-[12px] rounded-xl border border-amber-400/40 transition-all active:scale-95"
          title="재생 속도 변경"
        >
          {playbackRate.toFixed(1)}x 배속
        </button>
      </div>
    </div>
  );
}
