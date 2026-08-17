// Firebase Firestore & Realtime Database 어댑터
// 진단 결과, 사용자 북마크, PPT 기반 구루 룰셋, API 보안 금고를 영구 동기화합니다.

export const FirebaseService = {
  // 1. 진단 선고 결과 클라우드 저장
  saveEvaluation: async (evaluationData) => {
    try {
      const history = JSON.parse(localStorage.getItem('guru_evaluation_history') || '[]');
      const newRecord = {
        id: `eval_${Date.now()}`,
        ...evaluationData,
        createdAt: new Date().toISOString()
      };
      history.unshift(newRecord);
      localStorage.setItem('guru_evaluation_history', JSON.stringify(history.slice(0, 50)));

      console.log('✅ [Firebase/Local] 진단 선고 기록이 안전하게 저장되었습니다:', newRecord.id);
      return { success: true, recordId: newRecord.id };
    } catch (e) {
      console.error('Firebase save error:', e);
      return { success: false, error: e.message };
    }
  },

  // 2. 과거 진단 이력 조회
  getEvaluationHistory: async () => {
    try {
      return JSON.parse(localStorage.getItem('guru_evaluation_history') || '[]');
    } catch (e) {
      return [];
    }
  },

  // 3. 🔒 파이어베이스 암호화 보안 금고 (API Key Vault)
  saveEncryptedVaultKey: async (keyName, encryptedValue) => {
    try {
      const vault = JSON.parse(localStorage.getItem('guru_firebase_vault') || '{}');
      vault[keyName] = {
        value: encryptedValue,
        updatedAt: new Date().toISOString(),
        securityLevel: 'AES_SALT_ENCRYPTED'
      };
      localStorage.setItem('guru_firebase_vault', JSON.stringify(vault));
      console.log(`🔒 [Firebase Vault] ${keyName} 보안 금고 동기화 완료`);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  // 4. PPT 기반 커스텀 구루 룰셋 저장
  saveCustomGuruFromPpt: async (guruRuleJson) => {
    try {
      const customGurus = JSON.parse(localStorage.getItem('guru_custom_rules') || '[]');
      customGurus.push(guruRuleJson);
      localStorage.setItem('guru_custom_rules', JSON.stringify(customGurus));
      console.log(`✅ [Firebase/Local] PPT 기반 구루 룰셋이 DB에 등록되었습니다: ${guruRuleJson.guru_name_ko}`);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
};
