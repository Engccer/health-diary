// Web Audio API 기반 사운드 효과 생성

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

// 성공 사운드: 상승하는 비프음
export function playSuccess(): void {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.warn('Audio playback failed:', e);
  }
}

// 레벨업 사운드: 팡파레 효과
export function playLevelUp(): void {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);

      gainNode.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
      gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + i * 0.15 + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.4);

      oscillator.start(ctx.currentTime + i * 0.15);
      oscillator.stop(ctx.currentTime + i * 0.15 + 0.4);
    });
  } catch (e) {
    console.warn('Audio playback failed:', e);
  }
}

// 뱃지 획득 사운드: 차임벨 효과
export function playBadge(): void {
  try {
    const ctx = getAudioContext();
    const frequencies = [1318.51, 1567.98, 2093.00]; // E6, G6, C7 (고음 차임)

    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);

      gainNode.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.5);

      oscillator.start(ctx.currentTime + i * 0.08);
      oscillator.stop(ctx.currentTime + i * 0.08 + 0.5);
    });
  } catch (e) {
    console.warn('Audio playback failed:', e);
  }
}
