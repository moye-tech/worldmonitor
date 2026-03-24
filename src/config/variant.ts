// 允许的 variant 列表（新增 world-plus）
const ALLOWED_VARIANTS = ['tech', 'full', 'finance', 'happy', 'commodity', 'world-plus'];

const buildVariant = (() => {
  try {
    return import.meta.env?.VITE_VARIANT || 'full';
  } catch {
    return 'full';
  }
})();

/**
 * 检查 variant 是否在允许列表中
 */
function isAllowedVariant(v: string): boolean {
  return ALLOWED_VARIANTS.includes(v);
}

export const SITE_VARIANT: string = (() => {
  if (typeof window === 'undefined') return buildVariant;

  const isTauri = '__TAURI_INTERNALS__' in window || '__TAURI__' in window;
  if (isTauri) {
    const stored = localStorage.getItem('worldmonitor-variant');
    if (stored && isAllowedVariant(stored)) return stored;
    return buildVariant;
  }

  const h = location.hostname;
  if (h.startsWith('tech.')) return 'tech';
  if (h.startsWith('finance.')) return 'finance';
  if (h.startsWith('happy.')) return 'happy';
  if (h.startsWith('commodity.')) return 'commodity';
  if (h.startsWith('world-plus.')) return 'world-plus';

  if (h === 'localhost' || h === '127.0.0.1') {
    const stored = localStorage.getItem('worldmonitor-variant');
    if (stored && isAllowedVariant(stored)) return stored;
    return buildVariant;
  }

  return 'full';
})();
