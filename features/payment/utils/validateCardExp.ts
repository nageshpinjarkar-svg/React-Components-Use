export const validateCardExp = (expirationDate: string) => {
  if (!expirationDate) {
    return false
  }
  const today = new Date()
  const monthToday = today.getMonth() + 1
  const yearToday = Number(today.getFullYear().toString().slice(-2))
  const [expMonth, expYear] = expirationDate.split('/').map(Number)

  if (expMonth > 12 || expMonth < 1) {
    return false
  }

  if (expYear < yearToday) {
    return false
  }

  if (expYear === yearToday && expMonth < monthToday) {
    return false
  }

  return true
}
