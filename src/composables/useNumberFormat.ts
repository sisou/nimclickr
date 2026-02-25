const THRESHOLDS: [number, string][] = [
  [1e15, 'Qa'],
  [1e12, 'T'],
  [1e9, 'B'],
  [1e6, 'M'],
  [1e3, 'K'],
]

export function formatNum(n: number, decimalsBelow = 0): string {
  if (!isFinite(n)) return '0'
  const abs = Math.abs(n)

  for (const [threshold, suffix] of THRESHOLDS) {
    if (abs >= threshold) {
      const val = n / threshold
      // Show up to 2 decimal places, strip trailing zeros
      const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(2).replace(/\.?0+$/, '')
      return `${formatted}${suffix}`
    }
  }

  // Below 1000 — show 1 decimal if under the threshold, otherwise integer
  if (decimalsBelow > 0 && abs < decimalsBelow) {
    return n.toFixed(1)
  }
  return Math.floor(n).toString()
}

export function formatTps(tps: number): string {
  return formatNum(tps)
}
