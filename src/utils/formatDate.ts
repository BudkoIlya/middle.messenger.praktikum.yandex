export type DateInput = string | Date;

export interface FormatSmartDateOptions {
  forceFull?: boolean;
  now?: Date;
}

const toDate = (v: DateInput): Date | null => {
  if (v instanceof Date) {
    return Number.isNaN(v.getTime()) ? null : new Date(v.getTime());
  }
  if (typeof v === 'string') {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
};

export const formatDate = (input: DateInput, opts: FormatSmartDateOptions = {}): string => {
  const { forceFull = false, now = new Date() } = opts;

  const date = toDate(input);
  if (!date) return '';

  const isSameDay =
    date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();

  const pad2 = (n: number) => String(n).padStart(2, '0');

  const hh = pad2(date.getHours());
  const mm = pad2(date.getMinutes());

  if (!forceFull && isSameDay) {
    return `${hh}:${mm}`;
  }

  const dd = pad2(date.getDate());
  const MM = pad2(date.getMonth() + 1);
  const yyyy = date.getFullYear();

  return `${dd}.${MM}.${yyyy} ${hh}:${mm}`;
};
