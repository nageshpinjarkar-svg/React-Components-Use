export enum GraphicUsage {
  ResponsiveLogo = 'responsive-logo',
  EmailHeader = 'email-header',
  ResponsiveHeader = 'responsive-header',
  RegShare = 'reg-share',
  ReceiptHeader = 'receipt-header',
  ResultsBg = 'results-bg',
  RegBgWeb = 'reg-bg-web',
  RegBgKiosk = 'reg-bg-kiosk',
  KioskRaceImg = 'kiosk-race-img',
  FacebookIcon = 'facebook-icon',
  HeroImage = 'hero-image',
}

export enum EmergencySectionVisibility {
  Both = 'BOTH',
  Kiosk = 'KIOSK-EXPO', // quick reg or kiosk
  None = 'NONE',
  Web = 'WEB', // only for full reg
}

interface Graphic {
  contentUsage: GraphicUsage
  eventId: number
  id: number
  url: string
}

interface PacketPickUpDisplayOption {
  displayOrder: number
  eventId: number
  name: string
  optionId: number
  tag: string
}

export enum RegOptionStatus {
  isActive,
  isFull,
  isClosed,
  isNotStarted,
}

export interface Race {
  actualEndTime: number
  actualStartTime: number
  racelinkRaceId: number
  courseDistance: number
  id: number
  name: string
  plannedEndTime: number
  plannedStartTime: number
  prefDistanceUnit: string
  subtype: string
  type: string
}

export interface RegOption {
  closingDate: number
  displayOrder: number
  hideInForm: boolean
  id: number
  maxAge: number
  minAge: null | number
  name: string
  openingDate: number
  status: RegOptionStatus
  sku: string
  timeZone: string
  type: null | string
  gender: null | string
  races: Race[]
  price?: number
}

export enum EventWaiverRules {
  Standard = 'STANDARD',
  Initials = 'INITIALS',
  Checkbox = 'CHECKBOX',
  CheckboxAndInitials = 'CHECKINITIAL',
}

export interface EventWaiver {
  id: number
  name: string
  rules: EventWaiverRules
  scroll: boolean
  waiver: string
}

export enum EventPaymentProcessor {
  Adyen = 'adyen',
  Stripe = 'stripe_us',
  Stripe_EU = 'stripe_eu',
}

export interface EventData {
  currencyId: string
  description: string
  eventId: number
  graphics: Graphic[]
  hometown: string
  imageUrl: string
  internationalShippingAmount: null | number
  localEndDate: string
  localStartDate: string
  marketingConsentQuestion: boolean
  marketingConsentQuestionText: string
  marketingEmailQuestion: boolean
  marketingEmailQuestionText: string
  marketingEmailsEventName: null | string
  name: string
  packetPickUpDisplayOptions: PacketPickUpDisplayOption[]
  policyAgree: boolean
  policyUrl: null | string
  races: Race[]
  regClosingDate: string
  regOpeningDate: string
  regOptions: RegOption[]
  registerUrl: string
  shippingAmount: null | number
  timeZone: string
  url: string
  wantsEmergencyGroup: EmergencySectionVisibility
  waivers: EventWaiver[]
  paymentProcessor: EventPaymentProcessor
  isOnlineRegOpened: boolean
  isOnSiteRegOpened: boolean
}

export interface EmailData {
  id: string
  subject: string
  text: string
  to: string
  eventId: number
  from: string
  html: string
}

export const REG_OPEN_STATUS_MAP = {
  qr: 'isOnlineRegOpened',
  full: 'isOnlineRegOpened',
  kiosk: 'isOnSiteRegOpened',
} as const
