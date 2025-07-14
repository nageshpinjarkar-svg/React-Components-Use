import omit from 'lodash/omit'
import { format } from 'date-fns'

import {
  EventData,
  EventPaymentProcessor,
  RegOption,
} from 'src/api/event/types'
import {
  AdyenBrowserInfo,
  AdyenEncryptedPaymentMethodWithHolderName,
  PaymentMethod,
  PaymentType,
  Card,
  StripePaymentMethodWithHolderName,
  PAYMENT_TYPE_CASH,
} from 'src/features/payment/types'
import { IWaiver } from 'src/features/waiver/types'
import { EntryModel, ContactRelationship } from 'src/features/entries/types'
import { isStripeProcessor } from 'src/features/shared/utils'

import {
  PostTransactionPayloadItem,
  RegistrationTransactionPayload,
} from './types'

const calcAge = (birthDate: string | Date): number => {
  const diff = new Date().getTime() - new Date(birthDate).getTime()
  return Math.floor(diff / (1000 * 3600 * 24 * 365.25))
}

export const isMinorRegistration = (registration: EntryModel) => {
  return (
    registration.details.birthDate &&
    calcAge(new Date(registration.details.birthDate)) < 13
  )
}

export const getPaymentMethod = (
  isStripe: boolean,
  stripeData: Card<StripePaymentMethodWithHolderName>,
  adyenData: Card<AdyenEncryptedPaymentMethodWithHolderName>
): PaymentMethod => {
  if (!stripeData && !adyenData) return null
  if (isStripe) {
    return {
      paymentMethodId: stripeData.paymentMethodId,
      holderName: stripeData.holderName,
    } as StripePaymentMethodWithHolderName
  } else {
    return omit(adyenData, [
      'checkoutAttemptId',
    ]) as AdyenEncryptedPaymentMethodWithHolderName
  }
}

export const prepareRegistrationItem = (
  registration: EntryModel,
  regOptions: RegOption[],
  waivers: IWaiver[]
): PostTransactionPayloadItem => {
  const preparedWaivers = waivers.map((waiver) => ({
    ...waiver,
    parentInitials:
      waiver?.parentInitials && Object.keys(waiver?.parentInitials).length > 0
        ? waiver?.parentInitials[registration?.meta?.participantId]
        : '',
  }))

  return {
    id: registration.meta.participantId,
    firstName: registration.details.firstName,
    lastName: registration.details.lastName,
    sex: registration.details.gender,
    age: calcAge(registration.details.birthDate as string),
    birthdate: format(
      new Date(registration.details.birthDate as string),
      'yyyy-MM-dd'
    ),
    usatNum: '1',
    email: registration.details.email,
    homePhone: registration.details.phone,
    address: {
      street: registration.address.street || '111 East Diamond Ave',
      street2: registration.address.street2,
      city: registration.address.city || 'New York',
      postalCode: registration.address.postalCode || '10001',
      region: registration.address.state,
      country: registration.address.country,
    },
    emergName: registration.emergencyContact.fullName,
    emergPhone: registration.emergencyContact.phone,
    emergRelationship:
      registration.emergencyContact.relationship ?? ContactRelationship.Other,
    regChoice: registration.details.regChoice,
    raceId: (regOptions.find(
      (one) => one.id === registration.details.regChoice?.id
    )?.races || [])[0]?.id,
    waivers: preparedWaivers,
  }
}

export const prepareRegistrationTransactionPayload = (
  eventData: EventData,
  registrations: EntryModel[],
  paymentType: PaymentType,
  waivers: IWaiver[],
  card: PaymentMethod,
  la?: string,
  paymentMethodId?: string,
  browserInfo?: AdyenBrowserInfo
): RegistrationTransactionPayload => {
  const paymentMethod =
    paymentType === PAYMENT_TYPE_CASH
      ? null
      : getPaymentMethod(
          isStripeProcessor(eventData.paymentProcessor),
          {
            paymentMethodId,
            holderName: card!.holderName,
          },
          card as Card<AdyenEncryptedPaymentMethodWithHolderName>
        )
  const payload: RegistrationTransactionPayload = {
    la,
    sourceType: 'ON-SITE',
    avalara: {
      transactionCode: '',
      customerCode: '',
    },
    items: registrations.map((registration) =>
      prepareRegistrationItem(registration, eventData.regOptions, waivers)
    ),
    eventId: eventData.eventId,
    payment: {
      paymentType: paymentType!,
      paymentMethod,
      paymentProcessor:
        eventData.paymentProcessor || EventPaymentProcessor.Adyen,
      browserInfo,
    },
  }

  return payload
}
