// 👤 Guru Factory 회원 인증 & 세션 관리 서비스 (Firebase Auth & Local Vault 호환)

const STORAGE_KEY = 'guru_factory_current_user';

export const AuthService = {
  // 1. 현재 로그인 사용자 확인
  getCurrentUser: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  // 2. 로그인 상태 여부
  isLoggedIn: () => {
    return !!AuthService.getCurrentUser();
  },

  // 3. 소셜 1초 간편 로그인 (구글, 카카오 등)
  loginWithSocial: async (provider = 'google') => {
    const defaultUser = {
      id: `user_${Date.now()}`,
      name: provider === 'google' ? '구글 투자자' : '카카오 투자자',
      email: provider === 'google' ? 'investor@gmail.com' : 'investor@kakao.com',
      provider,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      role: 'MEMBER',
      permissions: ['DOWNLOAD_PPTX', 'VIEW_SUMMARY', 'AI_COACHING'],
      loginAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUser));
    window.dispatchEvent(new Event('auth_state_changed'));
    return defaultUser;
  },

  // 4. 이메일/비밀번호 로그인
  loginWithEmail: async (email, password, name) => {
    const user = {
      id: `user_${Date.now()}`,
      name: name || email.split('@')[0] || '스마트 투자자',
      email,
      provider: 'email',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      role: 'MEMBER',
      permissions: ['DOWNLOAD_PPTX', 'VIEW_SUMMARY', 'AI_COACHING'],
      loginAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('auth_state_changed'));
    return user;
  },

  // 5. 로그아웃
  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('auth_state_changed'));
  }
};
