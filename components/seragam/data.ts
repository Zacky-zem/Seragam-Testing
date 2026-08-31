import type { UniformRecord } from './types'

export const departments = ['PGA', 'FATP - EXIM', 'MPC - WHS', 'QA', 'DE - MTC', 'ENG', 'Produksi', 'NYS - PP']

export const sectionsMap: Record<string, string[]> = {
  PGA: ['GAGS', 'PURCH', 'IT', 'IR', 'HR', 'QSA'],
  'FATP - EXIM': ['EXIM', 'FATP'],
  'MPC - WHS': ['WHS', 'MPC'],
  QA: ['QA ENG'],
  'DE - MTC': ['DE - MTC'],
  ENG: ['PE', 'PD'],
  Produksi: ['TRN', 'PSP', 'PROD'],
  'NYS - PP': ['NYS'],
}

export const uniformTypes = [
  'Kemeja Kerja Operator',
  'Kemeja Kerja Staff',
]

export const uniformSizes = ['S / 27', 'M / 28', 'M / 30', 'L / 30', 'L / 32', 'XL / 34', 'XXL / 36', '3XL / 38', '4XL / 40', 'Custom Size']
