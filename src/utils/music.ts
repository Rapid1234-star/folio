let musicAudio: HTMLAudioElement | null = null;
let isMuted = localStorage.getItem('portfolio_muted') === 'true';

export const initMusic = () => {
  if (musicAudio) return;
  
  musicAudio = new Audio();
  musicAudio.loop = true;
  musicAudio.src = '/music/Cyber_Music.mp3';
  musicAudio.volume = 0.1;
  
  if (!isMuted) {
    musicAudio.play().catch(e => console.warn("Audio autoplay blocked", e));
  }
};

export const toggleMusic = () => {
  isMuted = !isMuted;
  localStorage.setItem('portfolio_muted', isMuted.toString());
  
  if (musicAudio) {
    if (isMuted) {
      musicAudio.pause();
    } else {
      musicAudio.play().catch(e => console.warn("Audio play blocked", e));
    }
  }
  
  return isMuted;
};

export const getIsMusicMuted = () => isMuted;
