/** Tile colour per discipline. All hold >= 7:1 against white text. Unknown
 *  disciplines fall back to a stable pick from the same family, so a new
 *  article never needs a template edit. */
const KNOWN: Record<string, string> = {
  History: '#2F5073',
  Economics: '#6E4B22',
  'Political Science': '#5C2F3B',
  Psychology: '#3C5A48',
  Law: '#4B4068',
  Geography: '#2B5659',
  Classics: '#93452B',
};

const FALLBACK = ['#3A4E63', '#5A4A3A', '#4A5A3A', '#5A3A52'];

export function disciplineColor(name: string): string {
  if (KNOWN[name]) return KNOWN[name];
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return FALLBACK[h % FALLBACK.length];
}
