import { TimeOfDay } from '../utils/date';

// LottieFiles 무료 공개 애니메이션 URL
export const TIME_ANIMATIONS: Record<TimeOfDay, string> = {
  earlyMorning: 'https://assets5.lottiefiles.com/packages/lf20_xlky4kvh.json', // 일출
  morning: 'https://assets2.lottiefiles.com/packages/lf20_kk62um5v.json', // 태양
  afternoon: 'https://assets9.lottiefiles.com/packages/lf20_tszzqf9h.json', // 밝은 태양
  lateAfternoon: 'https://assets3.lottiefiles.com/packages/lf20_hx7ddrwt.json', // 노을
  evening: 'https://assets1.lottiefiles.com/packages/lf20_xlmz9xwm.json', // 저녁
  night: 'https://assets4.lottiefiles.com/packages/lf20_ono86qn7.json', // 달/별
};

// 시간대별 인사말
export const TIME_GREETINGS: Record<TimeOfDay, string> = {
  earlyMorning: '상쾌한 아침이에요',
  morning: '좋은 아침이에요',
  afternoon: '좋은 오후예요',
  lateAfternoon: '오후도 힘내세요',
  evening: '편안한 저녁이에요',
  night: '오늘 하루 수고했어요',
};

// 시간대별 이모지 (Lottie 로딩 실패 시 fallback)
export const TIME_EMOJIS: Record<TimeOfDay, string> = {
  earlyMorning: '🌅',
  morning: '☀️',
  afternoon: '🌞',
  lateAfternoon: '🌇',
  evening: '🌆',
  night: '🌙',
};
