// ─── Monthly payment threshold & fixed plan table ─────────────────────────────

export const MONTHLY_THRESHOLD = 15000

export const MONTHLY_PLANS_TABLE = [
  { months: 12, label: '1-year', rate: 0,   factor: null      },
  { months: 24, label: '2-year', rate: 4.9, factor: 0.043827  },
  { months: 36, label: '3-year', rate: 4.9, factor: 0.029926  },
  { months: 48, label: '4-year', rate: 4.9, factor: 0.022984  },
  { months: 60, label: '5-year', rate: 4.9, factor: 0.018825  },
  { months: 72, label: '6-year', rate: 4.9, factor: 0.016059  },
  { months: 84, label: '7-year', rate: 4.9, factor: 0.014087  },
]

// Returns plan rows using the fixed factor table.
// selectedMonths filters to specific terms (default: all).
export function getMonthlyPlans(total, selectedMonths = null) {
  const downPayment = Math.round(total * 0.10 * 100) / 100
  const balance     = Math.round((total - downPayment) * 100) / 100
  const rows = selectedMonths
    ? MONTHLY_PLANS_TABLE.filter(p => selectedMonths.includes(p.months))
    : MONTHLY_PLANS_TABLE
  return rows.map(p => {
    const monthly = p.factor == null
      ? Math.round((balance / p.months) * 100) / 100
      : Math.round(balance * p.factor * 100) / 100
    const totalFinanced = Math.round(monthly * p.months * 100) / 100
    return { ...p, downPayment, balance, monthly, totalFinanced }
  })
}

// ─── Rate Tables ──────────────────────────────────────────────────────────────

// Table 1: 1yr / 3yr / 5yr / 10yr — rate per $10,000/month
const TABLE1 = [
  { min:  0, max: 40, r1: null,   r3: 283.47, r5: 195.28, r10: 125.99 },
  { min: 41, max: 50, r1: null,   r3: 370.62, r5: 243.58, r10: 152.24 },
  { min: 51, max: 60, r1: null,   r3: 353.82, r5: 247.78, r10: 165.88 },
  { min: 61, max: 70, r1: null,   r3: 374.82, r5: 263.53, r10: 171.14 },
  { min: 71, max: 75, r1: null,   r3: 386.36, r5: 271.93, r10: 193.18 },
  { min: 76, max: 80, r1: null,   r3: 424.16, r5: 300.27, r10: 212.08 },
  { min: 81, max: 85, r1: null,   r3: 444.11, r5: 322.32, r10: null   },
  { min: 86, max: 99, r1: 860.00, r3: 310.00, r5: 200.00, r10: null   },
]

// Table 2: 15yr / 20yr — rate per $10,000/month (per-age from 51+)
const TABLE2 = {}
for (let a = 0;  a <= 45; a++) TABLE2[a] = { r15: 81.30,  r20: 66.70 }
for (let a = 46; a <= 50; a++) TABLE2[a] = { r15: 81.30,  r20: 68.40 }
Object.assign(TABLE2, {
  51: { r15:  84.20, r20: 72.10 }, 52: { r15:  85.70, r20: 72.50 },
  53: { r15:  87.00, r20: 73.00 }, 54: { r15:  88.50, r20: 73.30 },
  55: { r15:  90.00, r20: 79.30 }, 56: { r15:  91.50, r20: 80.90 },
  57: { r15:  92.90, r20: 82.40 }, 58: { r15:  94.40, r20: 83.50 },
  59: { r15:  95.80, r20: 83.80 }, 60: { r15:  97.10, r20: 87.70 },
  61: { r15:  98.60, r20: 88.00 }, 62: { r15: 100.00, r20: 88.30 },
  63: { r15: 101.30, r20: 88.60 }, 64: { r15: 103.10, r20: 88.90 },
  65: { r15: 104.80, r20: 96.60 },
  66: { r15: 106.50, r20: null  }, 67: { r15: 108.30, r20: null  },
  68: { r15: 109.90, r20: null  }, 69: { r15: 111.70, r20: null  },
  70: { r15: 113.40, r20: null  },
  // 71+: neither available (not in map)
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function calcAge(birthdateStr) {
  if (!birthdateStr) return null
  const birth = new Date(birthdateStr)
  if (isNaN(birth)) return null
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

const r2 = n => Math.round(n * 100) / 100

// Returns array of { years, label, monthly, totalInvestment, perDay }
// Only includes plans available for the given age; empty array if age is null.
export function getPaymentPlans(age, amount) {
  if (age == null || !amount) return []

  const row1 = TABLE1.find(r => age >= r.min && age <= r.max) || null
  const row2 = TABLE2[age] || null

  const candidates = [
    { years:  1, rate: row1?.r1  ?? null },
    { years:  3, rate: row1?.r3  ?? null },
    { years:  5, rate: row1?.r5  ?? null },
    { years: 10, rate: row1?.r10 ?? null },
    { years: 15, rate: row2?.r15 ?? null },
    { years: 20, rate: row2?.r20 ?? null },
  ]

  return candidates
    .filter(c => c.rate != null)
    .map(({ years, rate }) => {
      const monthly         = r2((amount / 10000) * rate)
      const totalInvestment = r2(monthly * years * 12)
      const perDay          = r2((totalInvestment - amount) / (years * 365))
      return { years, label: `${years}-year`, monthly, totalInvestment, perDay }
    })
}
