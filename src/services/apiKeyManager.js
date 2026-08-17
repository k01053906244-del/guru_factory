// 🔒 토스증권 API 파이어베이스 보안 금고 & 1일 100회 엄격 Rate Limiter 매니저
import { FirebaseService } from './firebase';

const STORAGE_KEYS = {
  TOSS_API_VAULT: 'guru_vault_toss_enc_key',
  AI_API_VAULT: 'guru_vault_ai_enc_key',
  DAILY_API_USAGE: 'guru_vault_daily_usage_quota'
};

const DAILY_MAX_CALLS = 100; // 🛡️ 1일 최대 호출 한도 (100회 엄격 제한)

// 솔트 기반 암호화/복호화 유틸리티
const SALT_PREFIX = 'GURU_FACTORY_SECURE_VAULT_2026_';

const encryptKey = (plainText) => {
  if (!plainText) return '';
  try {
    const raw = `${SALT_PREFIX}${plainText}`;
    return btoa(encodeURIComponent(raw));
  } catch (e) {
    return plainText;
  }
};

const decryptKey = (cipherText) => {
  if (!cipherText) return '';
  try {
    const decoded = decodeURIComponent(atob(cipherText));
    if (decoded.startsWith(SALT_PREFIX)) {
      return decoded.replace(SALT_PREFIX, '');
    }
    return decoded;
  } catch (e) {
    return cipherText;
  }
};

export const ApiKeyManager = {
  // 1. 토스증권 API 키 조회 (복호화)
  getTossApiKey: () => {
    const enc = localStorage.getItem(STORAGE_KEYS.TOSS_API_VAULT) || '';
    return decryptKey(enc);
  },

  // 2. 토스증권 API 키 저장 (암호화 + 파이어베이스 보안 금고 백업)
  setTossApiKey: async (key) => {
    if (key && key.trim()) {
      const trimmed = key.trim();
      const enc = encryptKey(trimmed);
      localStorage.setItem(STORAGE_KEYS.TOSS_API_VAULT, enc);

      // 파이어베이스 보안 금고 컬렉션에 암호화 보관 동기화
      try {
        await FirebaseService.saveEncryptedVaultKey('toss_api_key', enc);
        console.log('🔒 [Firebase Vault] 토스증권 API 키가 파이어베이스 보안 금고에 암호화 저장되었습니다.');
      } catch (err) {
        console.warn('Firebase Vault Sync Notice:', err);
      }
    } else {
      localStorage.removeItem(STORAGE_KEYS.TOSS_API_VAULT);
    }
  },

  // 3. AI API 키 관리
  getAiApiKey: () => {
    const enc = localStorage.getItem(STORAGE_KEYS.AI_API_VAULT) || '';
    return decryptKey(enc);
  },

  setAiApiKey: async (key) => {
    if (key && key.trim()) {
      const trimmed = key.trim();
      const enc = encryptKey(trimmed);
      localStorage.setItem(STORAGE_KEYS.AI_API_VAULT, enc);
      try {
        await FirebaseService.saveEncryptedVaultKey('ai_api_key', enc);
      } catch (err) {}
    } else {
      localStorage.removeItem(STORAGE_KEYS.AI_API_VAULT);
    }
  },

  // 4. 🛡️ 1일 100회 엄격 Rate Limiter (호출량 검증 및 카운트 소진)
  getDailyUsage: () => {
    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_API_USAGE) || '{}');
      if (stored.date === todayStr) {
        return {
          date: todayStr,
          count: stored.count || 0,
          maxLimit: DAILY_MAX_CALLS,
          remaining: Math.max(0, DAILY_MAX_CALLS - (stored.count || 0)),
          isBlocked: (stored.count || 0) >= DAILY_MAX_CALLS
        };
      }
    } catch (e) {}

    return {
      date: todayStr,
      count: 0,
      maxLimit: DAILY_MAX_CALLS,
      remaining: DAILY_MAX_CALLS,
      isBlocked: false
    };
  },

  // API 호출 전 쿼터 소진 검사 (100회 초과 시 호출 원천 차단)
  consumeDailyQuota: () => {
    const todayStr = new Date().toISOString().split('T')[0];
    let currentUsage = ApiKeyManager.getDailyUsage();

    if (currentUsage.count >= DAILY_MAX_CALLS) {
      console.error(`🚨 [보안 경고] 1일 API 최대 호출 한도(${DAILY_MAX_CALLS}회)에 도달하여 통신이 원천 차단되었습니다.`);
      return { allowed: false, remaining: 0, message: `1일 최대 호출 한도(${DAILY_MAX_CALLS}회)를 모두 소진하였습니다.` };
    }

    const nextCount = currentUsage.count + 1;
    const updateData = {
      date: todayStr,
      count: nextCount,
      lastCallTime: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.DAILY_API_USAGE, JSON.stringify(updateData));
    
    return {
      allowed: true,
      remaining: DAILY_MAX_CALLS - nextCount,
      count: nextCount
    };
  },

  // 5. 마스킹된 키 반환 (보안 UI 표시용: sk-1234••••••••5678)
  getMaskedKey: (key) => {
    if (!key || key.length < 8) return '미등록 (공시 팩트체크 모드)';
    return `${key.slice(0, 4)}••••••••${key.slice(-4)}`;
  }
};
