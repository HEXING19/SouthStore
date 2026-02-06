/**
 * PayFast configuration
 */

export const payfastConfig = {
  merchantId: process.env.PAYFAST_MERCHANT_ID || '',
  merchantKey: process.env.PAYFAST_MERCHANT_KEY || '',
  passphrase: process.env.PAYFAST_PASSPHRASE || '',
  testMode: process.env.PAYFAST_TEST_MODE === 'true',
  sandboxUrl: process.env.PAYFAST_SANDBOX_URL || 'https://sandbox.payfast.co.za/eng/process',
  liveUrl: process.env.PAYFAST_LIVE_URL || 'https://www.payfast.co.za/eng/process',
  itnUrl: process.env.PAYFAST_ITN_URL || 'http://localhost:3000/api/checkout/itn',
};

/**
 * Get the appropriate PayFast URL based on test mode
 */
export function getPayFastUrl(): string {
  return payfastConfig.testMode ? payfastConfig.sandboxUrl : payfastConfig.liveUrl;
}

/**
 * Generate return URL for successful payment
 */
export function getReturnUrl(sessionId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/checkout/success?session_id=${sessionId}`;
}

/**
 * Generate cancel URL for cancelled payment
 */
export function getCancelUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/checkout/cancel`;
}

/**
 * Generate notify URL for ITN
 */
export function getNotifyUrl(): string {
  return payfastConfig.itnUrl;
}
