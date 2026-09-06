// Formatting + small helpers used across Lustre

/** Indian number formatting for currency, e.g. 3850000 -> ₹38,50,000 */
export function inr(value: number, opts: { compact?: boolean; paise?: boolean } = {}): string {
  if (opts.compact) {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2).replace(/\.00$/, '')}Cr`
    if (value >= 100000) return `₹${(value / 100000).toFixed(2).replace(/\.00$/, '')}L`
    if (value >= 1000) return `₹${(value / 1000).toFixed(1).replace(/\.0$/, '')}K`
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: opts.paise ? 2 : 0,
  }).format(value)
}

/** Plain Indian-grouped number (no symbol) */
export function inNum(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value)
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

/** Initials from a name, e.g. "Arjun Mehta" -> "AM" */
export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('')
}

/** Relative-ish time label for demo data */
export function timeAgo(minutes: number): string {
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${Math.round(minutes)}m ago`
  const h = minutes / 60
  if (h < 24) return `${Math.round(h)}h ago`
  return `${Math.round(h / 24)}d ago`
}
