export const formatCurrency = (amount: number): string => {
  return `KES ${amount.toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const parseCurrencyValue = (value: string): number => {
  // Remove 'KES', 'Ksh', commas, and any other non-numeric characters except decimal points
  const cleanValue = value.replace(/[^\d.-]/g, '');
  return parseFloat(cleanValue) || 0;
};