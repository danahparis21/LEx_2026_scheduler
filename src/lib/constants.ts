export const LEX_START_DATE = new Date('2026-04-06');
export const LEX_END_DATE = new Date('2026-04-17');

export const ADMIN_USERNAME = 'lexusername';
export const ADMIN_PASSWORD = 'lexpassword';

export function getDayNumber(date: Date): number {
  const start = new Date(LEX_START_DATE);
  start.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const diff = Math.floor((d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diff + 1;
}

export function getDayName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

export const AVATAR_COLORS = [
  '#F9A8D4', '#A78BFA', '#FCA5A5', '#93C5FD',
  '#86EFAC', '#FDE68A', '#C4B5FD', '#FBCFE8',
  '#FDA4AF', '#DDD6FE',
];

export const AVATAR_EMOJIS = [
  '🌸', '🦋', '🌺', '✨', '🌷', '💖', '🌙', '⭐', '🎀', '🌼',
  '🐱', '🐰', '🦊', '🐻', '🐼', '🦄', '🐶', '🐸', '🦉', '🐧',
];
