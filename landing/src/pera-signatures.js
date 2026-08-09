export function alignPeraSignatures(transactions, indexesToSign, signed) {
  let signedIndex = 0;
  return transactions.map((_, index) => !indexesToSign || indexesToSign.includes(index) ? signed[signedIndex++] ?? null : null);
}
