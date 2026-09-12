export const scrollState = {
  progress: 0,
  subscribers: new Set<(progress: number) => void>(),
  
  sections: [
    { id: 0, name: 'hero', start: 0.00, end: 0.17 },
    { id: 1, name: 'summary', start: 0.17, end: 0.34 },
    { id: 2, name: 'experience', start: 0.34, end: 0.51 },
    { id: 3, name: 'projects', start: 0.51, end: 0.68 },
    { id: 4, name: 'skills', start: 0.68, end: 0.85 },
    { id: 5, name: 'education', start: 0.85, end: 1.00 }
  ],

  set(p: number) {
    this.progress = p;
    this.subscribers.forEach(sub => sub(p));
  },
  
  get() {
    return this.progress;
  },

  getActiveSection() {
    const p = this.progress;
    for (let i = 0; i < this.sections.length; i++) {
      const sec = this.sections[i];
      if (p >= sec.start && p < sec.end) {
        const localProgress = (p - sec.start) / (sec.end - sec.start);
        return { id: sec.id, start: sec.start, end: sec.end, localProgress };
      }
    }
    const last = this.sections[this.sections.length - 1];
    return { id: last.id, start: last.start, end: last.end, localProgress: 1.0 };
  },
  
  subscribe(callback: (progress: number) => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }
};
