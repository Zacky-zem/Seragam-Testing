const MONTHS: Record<string, number> = {
  januari: 1,
  februari: 2,
  maret: 3,
  april: 4,
  mei: 5,
  juni: 6,
  juli: 7,
  agustus: 8,
  september: 9,
  oktober: 10,
  november: 11,
  desember: 12,
}

const pad = (value: number) => String(value).padStart(2, '0')

const toDateParts = (year: number, month: number, day: number) => {
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1) return null
  const date = new Date(Date.UTC(year, month - 1, day, 12))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null
  return `${year}-${pad(month)}-${pad(day)}`
}

export const parseFlexibleDate = (value: unknown): string | null => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return toDateParts(value.getFullYear(), value.getMonth() + 1, value.getDate())
  }

  const text = String(value ?? '').trim().toLowerCase()
  if (!text) return null

  let match = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/.exec(text)
  if (match) return toDateParts(Number(match[1]), Number(match[2]), Number(match[3]))

  match = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/.exec(text)
  if (match) return toDateParts(Number(match[3]), Number(match[2]), Number(match[1]))

  match = /^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/.exec(text)
  if (match) return toDateParts(Number(match[3]), MONTHS[match[2]] ?? 0, Number(match[1]))

  return null
}

export const dateOnlyToUtc = (value: unknown) => {
  const normalized = parseFlexibleDate(value)
  if (!normalized) return null
  const [year, month, day] = normalized.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day, 12))
}
