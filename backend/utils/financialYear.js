/**
 * Indian Financial Year runs April (4) to March (3).
 * If month >= 4 → FY is year to year+1
 * If month <= 3 → FY is year-1 to year
 */
function computeFinancialYear(month, year) {
  if (month >= 4) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
}

/**
 * Returns all 12 months in an Indian FY in order: Apr..Mar
 * fyString: "2024-2025"
 */
function getFYMonths(fyString) {
  const [startYear] = fyString.split('-').map(Number);
  const months = [];
  for (let m = 4; m <= 12; m++) months.push({ month: m, year: startYear });
  for (let m = 1; m <= 3; m++) months.push({ month: m, year: startYear + 1 });
  return months;
}

const MONTH_NAMES = [
  '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

module.exports = { computeFinancialYear, getFYMonths, MONTH_NAMES };