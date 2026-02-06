import crypto from 'crypto';

/**
 * PayFast signature field order (must follow this exact order)
 * Source: https://www.deanmalan.co.za/2023/2023-02-08-calculate-payfast-signature.html
 */
const PAYFAST_FIELD_ORDER = [
  // Merchant Details
  'merchant_id',
  'merchant_key',
  'return_url',
  'cancel_url',
  'notify_url',
  // Buyer Detail
  'name_first',
  'name_last',
  'email_address',
  'cell_number',
  // Transaction Details
  'm_payment_id',
  'amount',
  'item_name',
  'item_description',
  'custom_int1',
  'custom_int2',
  'custom_int3',
  'custom_int4',
  'custom_int5',
  'custom_str1',
  'custom_str2',
  'custom_str3',
  'custom_str4',
  'custom_str5',
  // Transaction Options
  'email_confirmation',
  'confirmation_address',
  // Set Payment Method
  'payment_method',
  // Recurring Billing Details
  'subscription_type',
  'billing_date',
  'recurring_amount',
  'frequency',
  'cycles',
];

/**
 * Sort fields according to PayFast priority order
 */
function sortByFieldOrder(fields: string[]): string[] {
  const fieldOrderMap = new Map(PAYFAST_FIELD_ORDER.map((field, index) => [field, index]));

  return fields.sort((a, b) => {
    const aIndex = fieldOrderMap.get(a) ?? PAYFAST_FIELD_ORDER.length;
    const bIndex = fieldOrderMap.get(b) ?? PAYFAST_FIELD_ORDER.length;

    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }

    // If both fields are not in the priority list, sort alphabetically
    return a.localeCompare(b);
  });
}

/**
 * URL encode using application/x-www-form-urlencoded rules
 * This is equivalent to Python's urllib.parse.quote_plus()
 */
function encodeValue(value: string): string {
  return encodeURIComponent(value).replace(/%20/g, '+');
}

/**
 * Generate PayFast signature from data object
 * @param data - Object containing payment data
 * @param passphrase - PayFast passphrase (optional)
 * @returns MD5 signature string
 */
export function generatePayFastSignature(data: Record<string, string | number>, passphrase?: string): string {
  // Filter out empty values and strip whitespace
  const filteredData: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    const strValue = String(value).trim();
    if (strValue) {
      filteredData[key] = strValue;
    }
  }

  // Sort keys according to PayFast field order
  const sortedKeys = sortByFieldOrder(Object.keys(filteredData));

  // Build parameter string
  let signatureString = '';
  for (const key of sortedKeys) {
    if (key !== 'signature') {
      signatureString += `${key}=${encodeValue(filteredData[key])}&`;
    }
  }

  // Remove trailing &
  signatureString = signatureString.slice(0, -1);

  // Append passphrase if provided
  if (passphrase) {
    signatureString += `&passphrase=${encodeValue(passphrase)}`;
  }

  console.log('[PayFast Signature] Sorted keys:', sortedKeys);
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
