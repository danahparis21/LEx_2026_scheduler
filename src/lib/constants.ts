export const LEX_START_DATE = new Date('2026-04-06');
export const LEX_END_DATE = new Date('2026-04-17');

export const ADMIN_USERNAME = 'lexusername';
export const ADMIN_PASSWORD = 'lexpassword';

export function getDayNumber(date: Date): number {
  // Use local date components to avoid timezone issues
  const startYear = LEX_START_DATE.getFullYear();
  const startMonth = LEX_START_DATE.getMonth();
  const startDay = LEX_START_DATE.getDate();
  const startLocal = new Date(startYear, startMonth, startDay);
  
  const dYear = date.getFullYear();
  const dMonth = date.getMonth();
  const dDay = date.getDate();
  const dLocal = new Date(dYear, dMonth, dDay);
  
  const diff = Math.floor((dLocal.getTime() - startLocal.getTime()) / (1000 * 60 * 60 * 24));
  return diff + 1;
}

export function getDayName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function toDateString(date: Date): string {
  // Timezone-safe date formatting
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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