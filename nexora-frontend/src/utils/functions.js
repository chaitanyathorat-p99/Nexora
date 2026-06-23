/**
 * Format a number to Indian Rupee format
 * @param {number} num - The number to format
 * @param {boolean} includeSymbol - Whether to include the ₹ symbol
 * @returns {string} Formatted number as Indian Rupee
 */
export const formatNumberToIndianRupee = (num, includeSymbol = true) => {
  if (num === null || num === undefined) return '-';
  
  // Convert to number if it's a string
  const number = typeof num === 'string' ? parseFloat(num) : num;
  
  // Format the number
  const formatter = new Intl.NumberFormat('en-IN', {
    style: includeSymbol ? 'currency' : 'decimal',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(number);
};

/**
 * Format a date string to a readable format
 * @param {string} dateString - The date string to format
 * @param {string} format - The format to use (default: DD MMM YYYY)
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, format = 'DD MMM YYYY') => {
  if (!dateString) return '-';
  
  // Use moment or another date library if available
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}; 