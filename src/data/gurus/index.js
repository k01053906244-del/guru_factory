import peterLynchRule from './peter_lynch.json';

export const GURUS_REGISTRY = [
  // 1호 명저: 유일하게 공식 탑재 완료된 도서
  {
    id: 'peter_lynch',
    slotNumber: 1,
    isLoaded: true,
    nameKo: '피터 린치',
    nameEn: 'Peter Lynch',
    title: '월가 전설의 마젤란 펀드 매니저 (연평균 29.2%)',
    bookTitle: '전설로 떠나는 월가의 영웅',
    tier: 'FREE',
    tierBadge: '✨ 무료 청문회',
    hasAudio: true,
    audioTitle: '쇼핑카트에서 발견한 2,700% 수익의 비결',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYpEdl9w7mMgImKMZxPDVPZbP6aJ3tb_M6iDOawhMALJnbfh9G8oZko2fG_yEgnGpno8YP2upgUOrSCv8wXEgL-uUs4-NUDKQ03yoxzxpDZBk-42W1_U8cqEDYhP8LCTt_eATpaYQV0DMzhNMZ7Ab3rRX4ratPoCqGAwctU57vCI6PpuSkoT0Ph3HdL9zrCaDvXJubp1hgM0GRG7Jz0c5G5TOOFC8hzMzWv94R6xCnrUDHukGaRa303A',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
    tagline: '상식과 일상에서 10배 주식(10-Bagger)을 발굴하라',
    ruleData: peterLynchRule,
    features: [
      '10대 심문 청문회 전 문항 무료',
      '토스증권 실시간 PEG & 부채비율 자동 채점',
      '피터 린치 10루타 선고문 및 티어 뱃지 즉시 발급'
    ]
  },

  // 2호 명저 공란 슬롯 (자료 탑재 대기)
  {
    id: 'slot_02',
    slotNumber: 2,
    isLoaded: false,
    nameKo: '2호 명저 (대기 중)',
    nameEn: 'Guru Slot #02',
    bookTitle: '자료 탑재 대기 중',
    tier: 'PAID_VIP',
    tierBadge: '🔒 탑재 대기',
    hasAudio: false,
    tagline: '대표님의 PPTX 및 음성 자료를 넣어주시면 즉시 활성화됩니다.'
  },

  // 3호 명저 공란 슬롯 (자료 탑재 대기)
  {
    id: 'slot_03',
    slotNumber: 3,
    isLoaded: false,
    nameKo: '3호 명저 (대기 중)',
    nameEn: 'Guru Slot #03',
    bookTitle: '자료 탑재 대기 중',
    tier: 'PAID_VIP',
    tierBadge: '🔒 탑재 대기',
    hasAudio: false,
    tagline: '대표님의 PPTX 및 음성 자료를 넣어주시면 즉시 활성화됩니다.'
  },

  // 4호 명저 공란 슬롯 (자료 탑재 대기)
  {
    id: 'slot_04',
    slotNumber: 4,
    isLoaded: false,
    nameKo: '4호 명저 (대기 중)',
    nameEn: 'Guru Slot #04',
    bookTitle: '자료 탑재 대기 중',
    tier: 'PAID_VIP',
    tierBadge: '🔒 탑재 대기',
    hasAudio: false,
    tagline: '대표님의 PPTX 및 음성 자료를 넣어주시면 즉시 활성화됩니다.'
  }
];
