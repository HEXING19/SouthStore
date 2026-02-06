import crypto from 'crypto';

/**
 * Generate PayFast signature from data object
 * @param data - Object containing payment data
 * @param passphrase - PayFast passphrase (optional)
 * @returns MD5 signature string
 */
export function generatePayFastSignature(data: Record<string, string | number>, passphrase?: string): string {
  // Filter out empty values
  const filteredData = Object.entries(data).filter(([_, value]) => value !== '' && value !== null && value !== undefined);

  // Sort parameters alphabetically
  const sortedParams = filteredData.sort(([a], [b]) => a.localeCompare(b));

  // Build string
  let signatureString = sortedParams
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value)).replace(/%20/g, '+')}`)
    .join('&');

  // Append passphrase if provided
  if (passphrase) {
    signatureString += `&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, '+')}`;
  }

  // Generate MD5 hash
  return crypto.createHash('md5').update(signatureString).digest('hex');
}

/**
 * Verify PayFast signature
 * @param data - Object containing payment data
 * @param receivedSignature - Signature received from PayFast
 * @param passphrase - PayFast passphrase (optional)
 * @returns true if signature is valid
 */
export function verifyPayFastSignature(
  data: Record<string, string>,
  receivedSignature: string,
  passphrase?: string
): boolean {
  const calculatedSignature = generatePayFastSignature(data, passphrase);
  return calculatedSignature === receivedSignature;
}
