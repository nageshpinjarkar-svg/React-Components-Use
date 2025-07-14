import type {
  ContactRelationship,
  EntryRegChoice,
  ReferralData,
  Sex,
} from 'src/features/entries/types'
import type {
  AdyenBrowserInfo,
  PaymentMethod,
  PaymentType,
} from 'src/features/payment/types'
import { IWaiver } from 'src/features/waiver/types'
import { EventPaymentProcessor, RegOption } from 'src/api/event/types'

export type Address = {
  street: string
  street2?: string
  city: string
  region: string
  country: string
  postalCode: string
}

export type Avalara = {
  customerCode: string
  transactionCode: string
}

export type PostTransactionPayloadItem = {
  id: number
  raceId: number
  firstName: string
  middleName?: string
  lastName: string
  sex: Sex
  birthdate?: string
  age: number
  tshirtSize?: string
  usatNum: string
  locationId?: number
  homePhone?: string
  mobilePhone?: string
  email?: string
  emergName?: string
  emergPhone?: string
  emergRelationship?: ContactRelationship
  address?: Address
  waivers: IWaiver[]
  regChoice: EntryRegChoice | null
}

export type PaymentPayload = {
  paymentType: PaymentType
  paymentMethod: PaymentMethod
  browserInfo?: AdyenBrowserInfo
  paymentProcessor?: EventPaymentProcessor
}

export type RegistrationTransactionPayload = {
  sourceType:
    | 'ON-SITE'
    | 'ON-LINE-CLASSIC'
    | 'ON-LINE'
    | 'IMPORT'
    | 'API'
    | 'MANUAL'
    | 'SERIES'
    | 'OTHER'
  eventId: number
  avalara: Avalara
  items: PostTransactionPayloadItem[]
  payment: PaymentPayload
  la?: string // Link Arguments - referral link
}

export type RegistrationTransactionResponseItem = {
  entryId: number
  athleteId: number
}

export type RegistrationTransactionResponse = {
  emailId: string
  resultCode: string
  receiptLink: string
  items: RegistrationTransactionResponseItem[]
  entryReferralData: ReferralData | null
}

export interface PostConsumerSurveyPayload {
  entryId: number
  score?: number | null
  comment?: string
}

export interface PostConsumerSurveyResponse {
  success: boolean
}

export type RegistrationCheckInEntriesPayload = {
  eventId: number
  uuid: string
  entries: {
    entryId: number
    checkedIn: boolean
    bib: string
  }[]
}

export type RegistrationCheckInEntriesResponse = {
  invalidBibs: number[]
  invalidTags: number[]
  updatedEntries: number[]
}

export interface GetRegionByZipCodePayload {
  zipCode: string
}

export interface GetRegionByZipCodeResponse {
  city: string
  label: string
  region: string
  regionId: string
  country: string
}

export interface PostOrderSummaryPayload {
  eventId: number
  participants: PostTransactionPayloadItem[]
  avalara: Avalara
  isCashPayment?: boolean
}

export interface ICustomFees {
  name: string
  fee: string
}

export interface PostOrderSummaryResponse {
  isPriceChanged: boolean
  isStatusChanged: boolean
  totalPrice: string
  customFees: ICustomFees[]
  participants: {
    id: number
    regOptions: RegOption[]
    regChoice: EntryRegChoice
  }[]
  totalServiceFee: string
  totalSalesTax: string
  total: string
}
