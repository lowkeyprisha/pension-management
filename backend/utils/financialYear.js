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