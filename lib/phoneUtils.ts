/**
 * Formats a 10-digit phone number string into +91 XXXXX XXXXX format.
 * Prevents "91" duplication and ensures the +91 prefix is always present.
 */
export const formatPhoneNumber = (value: string): string => {
  if (!value) return '';

  // Remove all non-digit characters
  let digits = value.replace(/\D/g, '');
  
  // If it starts with 91, strip it to get the core 10 digits
  // We do this because the UI adds +91, and subsequent edits will include it in 'value'
  if (digits.startsWith('91')) {
    // Only strip if it leaves something or if it's just '91'
    if (digits.length > 2) {
      digits = digits.slice(2);
    } else if (digits.length === 2) {
      digits = '';
    }
  }

  // Limit to 10 digits
  const mainNumber = digits.slice(0, 10);

  // Format the digits
  if (mainNumber.length === 0) {
    return '+91 ';
  } else if (mainNumber.length <= 5) {
    return `+91 ${mainNumber}`;
  } else {
    return `+91 ${mainNumber.slice(0, 5)} ${mainNumber.slice(5)}`;
  }
};

/**
 * Cleans a phone number string to return only the last 10 digits.
 */
export const cleanPhoneNumber = (value: string): string => {
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  // If it's more than 10 digits and starts with 91, it's likely the prefix
  if (digits.length > 10 && digits.startsWith('91')) {
    return digits.slice(2, 12);
  }
  return digits.slice(-10);
};
