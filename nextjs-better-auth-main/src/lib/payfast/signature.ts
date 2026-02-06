import crypto from 'crypto';

/**
 * Generate PayFast signature from data object
 * @param data - Object containing payment data
 * @param passphrase - PayFast passphrase (optional)
 * @returns MD5 signature string
 */
export function generatePayFastSignature(data: Record<string, string | number>, passphrase?: string): string {
  // Filter out empty values
  const filteredData = Object.entries(data).filter(([_, value]) => {
    const strValue = String(value);
    return strValue !== '' && strValue !== null && strValue !== undefined;
  });

  // Sort parameters alphabetically
  const sortedParams = filteredData.sort(([a], [b]) => a.localeCompare(b));

  // Build string
  let signatureString = sortedParams
    .map(([key, value]) => {
      // Don't encode the value - PayFast expects unencoded values in signature
      return `${key}=${String(value)}`;
    })
    .join('&');

  // Append passphrase if provided (unencoded)
  if (passphrase) {
    signatureString += `&passphrase=${passphrase}`;
  }

  console.log('[PayFast Signature] Input data:', Object.keys(data).sort());
  console.log('[PayFast Signature] Signature string:', signatureString);

  // Generate MD5 hash
  const signature = crypto.createHash('md5').update(signatureString).digest('hex');

  console.log('[PayFast Signature] Generated signature:', signature);

  return signature;
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
