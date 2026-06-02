export const GST_RATE = 0.05
export const PST_RATE = 0.07

const r2 = n => Math.round(n * 100) / 100

export function calcTotals(items, packageDiscount, discountType, discountValue) {
  const subtotal  = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const discBase  = items.filter(i => !i.noDisc).reduce((s, i) => s + i.price * i.quantity, 0)

  const pkgDiscAmount = Math.min(Number(packageDiscount) || 0, discBase)
  const afterPkg      = discBase - pkgDiscAmount

  let userDiscAmount = 0
  if (Number(discountValue) > 0) {
    userDiscAmount = discountType === 'percentage'
      ? afterPkg * (Number(discountValue) / 100)
      : Math.min(Number(discountValue), afterPkg)
  }

  const discountAmount = pkgDiscAmount + userDiscAmount
  const afterAll       = subtotal - discountAmount
  const discFactor     = discBase > 0 ? (discBase - discountAmount) / discBase : 1

  const gstAmount = r2(items
    .filter(i => i.gst !== false)
    .reduce((s, i) => s + r2(i.price * i.quantity * (i.noDisc ? 1 : discFactor) * GST_RATE), 0))
  const pstAmount = r2(items
    .filter(i => i.pst === true)
    .reduce((s, i) => s + r2(i.price * i.quantity * (i.noDisc ? 1 : discFactor) * PST_RATE), 0))
  const taxAmount = r2(gstAmount + pstAmount)
  const total     = r2(afterAll + taxAmount)

  return {
    subtotal:        r2(subtotal),
    pkgDiscAmount:   r2(pkgDiscAmount),
    userDiscAmount:  r2(userDiscAmount),
    discountAmount:  r2(discountAmount),
    gstAmount,
    pstAmount,
    taxAmount,
    total,
  }
}
