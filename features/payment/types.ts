export type PaymentType = 'CASH' | 'CREDIT'

export const PAYMENT_TYPE_CASH: PaymentType = 'CASH'

export const PAYMENT_TYPE_CARD: PaymentType = 'CREDIT'

export interface AdyenEncryptedPaymentMethod {
  checkoutAttemptId?: string
  encryptedCardNumber: string
  encryptedExpiryMonth: string
  encryptedExpiryYear: string
  encryptedSecurityCode: string
  type: string
}

export interface AdyenBrowserInfo {
  acceptHeader: string
  colorDepth: number
  javaEnabled: boolean
  javaScriptEnabled?: boolean
  language: string
  screenHeight: number
  screenWidth: number
  timeZoneOffset: number
  userAgent: string
}

export interface StripePaymentData {
  cardNumber: boolean
  cardExpiry: boolean
  cardCvc: boolean
}

export interface StripePaymentMethod {
  paymentMethodId?: string
}

export type BillingAddress = {
  city: string
  country: string
  postalCode: string
  state: string
  street: string
  street2: string
}

export type CardSlice = (AdyenEncryptedPaymentMethod | StripePaymentData) & {
  holderName: string
}

export interface AdyenEncryptedPaymentMethodWithHolderName
  extends AdyenEncryptedPaymentMethod {
  holderName: string
}

export interface StripePaymentMethodWithHolderName extends StripePaymentMethod {
  holderName: string
}

export type Card<T> = T extends AdyenEncryptedPaymentMethodWithHolderName
  ? AdyenEncryptedPaymentMethodWithHolderName
  : StripePaymentMethodWithHolderName

export interface PaymentSlice {
  paymentType: PaymentType | null
  card: CardSlice | null
  browserInfo: AdyenBrowserInfo | null
  billingAddress: BillingAddress
  stripeCardToken: string | null
}

export type PaymentMethod =
  | (
      | StripePaymentMethodWithHolderName
      | AdyenEncryptedPaymentMethodWithHolderName
    )
  | null

export interface CardPaymentModel<
  T extends AdyenEncryptedPaymentMethod | StripePaymentData,
> {
  card: T
  holderName: string
  address: {
    city: string
    country: string
    postalCode: string
    state: string
    street: string
    street2: string
  }
  meta: {
    paymentType: PaymentType | null
    isFirstEntryAddr: boolean
  }
}

export interface CardPaymentFormValues<
  T extends AdyenEncryptedPaymentMethod | StripePaymentData,
> {
  cardPayment: CardPaymentModel<T>
}

export type CardPaymentFormValuesType = CardPaymentFormValues<
  StripePaymentData | AdyenEncryptedPaymentMethod
>
