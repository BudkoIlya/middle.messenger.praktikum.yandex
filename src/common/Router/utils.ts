const normalizeLeadingSlash = (s: string): string => (s.startsWith('/') ? s.slice(1) : s);

const pathSegments = (s: string): string[] => normalizeLeadingSlash(s).split('/').filter(Boolean);

const getUrlPath = (url: string): string => url.split('?')[0] || '';

const getPatternBase = (pattern: string): string => pattern.split('?')[0] || '';

export const matchesPath = (url: string, pattern: string): boolean => {
  const urlSegs = pathSegments(getUrlPath(url));
  const patSegs = pathSegments(getPatternBase(pattern));

  if (urlSegs.length !== patSegs.length) return false;

  for (let i = 0; i < patSegs.length; i++) {
    const pat = patSegs[i];
    const seg = urlSegs[i];
    if (pat?.startsWith(':')) {
      if (!seg) return false; // параметр — непустой сегмент
    } else {
      if (pat !== seg) return false; // литерал — строгое совпадение
    }
  }
  return true;
};
