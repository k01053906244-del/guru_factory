import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthService } from '../../services/authService';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, message }) {
  const [authTab, setAuthTab] = useState('social'); // 'social' | 'email'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSocialLogin = async (provider) => {
    setIsSubmitting(true);
    try {
      const user = await AuthService.loginWithSocial(provider);
      if (onLoginSuccess) onLoginSuccess(user);
      onClose();
    } catch (e) {
      console.error('Social login error:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      const user = await AuthService.loginWithEmail(email, password, name);
      if (onLoginSuccess) onLoginSuccess(user);
      onClose();
    } catch (e) {
      console.error('Email login error:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="w-full max-w-md bg-slate-900 border-2 border-indigo-500/60 rounded-[2.5rem] p-6 md:p-8 shadow-2xl space-y-5 text-white relative overflow-hidden"
        >
          {/* 상단 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          {/* 헤더 & 안내 */}
          <div className="text-center space-y-2 pt-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-amber-400 p-0.5 shadow-xl mx-auto flex items-center justify-center">
              <span className="text-[28px]">🏛️</span>
            </div>

            <h3 className="text-[22px] font-black text-white tracking-tight">
              명저 원본 자료실 로그인
            </h3>
            
            <p className="text-[13px] text-amber-300/90 font-bold leading-relaxed px-2">
              {message || '로그인하시면 《월가의 영웅》 PPTX 3종 원본 파일과 워크북을 무료로 즉시 다운로드하실 수 있습니다.'}
            </p>
          </div>

          {/* 3대 회원 혜택 배지 */}
          <div className="bg-slate-950/80 border border-white/10 p-3.5 rounded-2xl space-y-1.5 text-[12px]">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>1호 피터린치 PPTX 3종 원본 파일 평생 소장</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-300 font-bold">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>10대 청문회 진단 기록 클라우드 영구 보관</span>
            </div>
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>거장 1:1 AI 명저 코칭 질의응답 무료 제공</span>
            </div>
          </div>

          {/* 로그인 탭 */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-white/10 text-[12px] font-black">
            <button
              onClick={() => setAuthTab('social')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                authTab === 'social'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              ⚡ 1초 간편 소셜 로그인
            </button>
            <button
              onClick={() => setAuthTab('email')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                authTab === 'email'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              ✉️ 이메일 로그인
            </button>
          </div>

          {/* 1. 간편 소셜 로그인 버튼들 */}
          {authTab === 'social' && (
            <div className="space-y-2.5 pt-1">
              <button
                onClick={() => handleSocialLogin('google')}
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-black text-[14px] rounded-xl flex items-center justify-center gap-2.5 shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google 계정으로 1초 로그인</span>
              </button>

              <button
                onClick={() => handleSocialLogin('kakao')}
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-black text-[14px] rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
                <span>카카오 계정으로 1초 로그인</span>
              </button>
            </div>
          )}

          {/* 2. 이메일 로그인 폼 */}
          {authTab === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-3 pt-1">
              <div className="space-y-1">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름 또는 닉네임 (선택)"
                  className="w-full py-2.5 px-3.5 bg-slate-950 text-white text-[13px] rounded-xl border border-white/20 focus:border-amber-400 focus:outline-none placeholder:text-white/30"
                />
              </div>

              <div className="space-y-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 주소 (예: user@viewbinlife.com)"
                  className="w-full py-2.5 px-3.5 bg-slate-950 text-white text-[13px] rounded-xl border border-white/20 focus:border-amber-400 focus:outline-none placeholder:text-white/30"
                />
              </div>

              <div className="space-y-1">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  className="w-full py-2.5 px-3.5 bg-slate-950 text-white text-[13px] rounded-xl border border-white/20 focus:border-amber-400 focus:outline-none placeholder:text-white/30"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-[14px] rounded-xl shadow-xl transition-all active:scale-95 cursor-pointer"
              >
                {isSubmitting ? '로그인 처리 중...' : '이메일로 시작하기'}
              </button>
            </form>
          )}

          <div className="text-center">
            <span className="text-[11px] text-white/50">
              로그인 시 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
