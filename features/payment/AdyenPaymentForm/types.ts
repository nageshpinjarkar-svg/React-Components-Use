export interface AdyenEncryptedPaymentMethod {
  checkoutAttemptId: string
  encryptedCardNumber: string
  encryptedExpiryMonth: string
  encryptedExpiryYear: string
  encryptedSecurityCode: string
  type: string
}
