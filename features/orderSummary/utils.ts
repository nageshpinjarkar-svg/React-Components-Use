// More info:

import { Dispatch } from '@reduxjs/toolkit'
import { TFunction } from 'i18next'

import { PostOrderSummaryResponse } from 'src/api/live/types'
import { RegOptionStatus } from 'src/api/event/types'
import AlertModal from 'src/components/shared/AlertModal'

import {
  updateEntryRegOptions,
  updateEntryRegChoice,
} from '../entries/entriesSlice'

import {
  setOrderSummaryStatus,
  OrderSummaryStatus,
  updateOrderSummary,
} from './orderSummarySlice'

// https://docs.adyen.com/development-resources/refusal-reasons/
export const mapRawErrorToType = {
  Refused: 'refused',
  Referral: 'referral',
  'Acquirer Error': 'acquirerError',
  'Blocked Card': 'blockedCard',
  'Expired Card': 'expiredCard',
  'Invalid Amount': 'invalidAmount',
  'Invalid Card Number': 'invalidCardNumber',
  'Issuer Unavailable': 'issuerUnavailable',
  'Not supported': 'notSupported',
  '3D Not Authenticated': '3dNotAuthenticated',
  'Not enough balance': 'notEnoughBalance',
  'Acquirer Fraud': 'acquirerFraud',
  Cancelled: 'cancelled',
  'Shopper Cancelled': 'shopperCancelled',
  'Invalid Pin': 'invalidPin',
  'Pin tries exceeded': 'pinTriesExceeded',
  'Pin validation not possible': 'pinValidationNotPossible',
  FRAUD: 'fraud',
  'Not Submitted': 'notSubmitted',
  'FRAUD-CANCELLED': 'fraudCancelled',
  'Transaction Not Permitted': 'transactionNotPermitted',
  'CVC Declined': 'cvcDeclined',
  'Restricted Card': 'restrictedCard',
  'Revocation Of Auth': 'revocationOfAuth',
  'Declined Non Generic': 'declinedNonGeneric',
  'Withdrawal amount exceeded': 'withdrawalAmountExceeded',
  'Withdrawal count exceeded': 'withdrawalCountExceeded',
  'Issuer Suspected Fraud': 'issuerSuspectedFraud',
  'AVS Declined': 'avsDeclined',
  'Card requires online pin': 'cardRequiresOnlinePin',
  'No checking account available on Card': 'noCheckingAccountAvailable',
  'No savings account available on Card': 'noSavingAccountAvailable',
  'Mobile pin required': 'mobilePinRequired',
  'Contactless fallback': 'contactlessFallback',
  'Authentication required': 'authenticationRequired',
  'RReq not received from DS': 'rreqNotReceived',
  'Current AID is in Penalty Box.': 'aidInPenaltyBox',
  'CVM Required Restart Payment': 'cvmRequired',
  '3DS Authentication Error': '3dsAuthEnticationError',
  'Transaction blocked by Adyen to prevent excessive retry fees':
    'preventedExcessiveRetryFees',
}

export const updateRegOptions = (
  data: PostOrderSummaryResponse,
  dispatch: Dispatch,
  t: TFunction<'translation', undefined>
) => {
  data.participants.forEach((participant) => {
    dispatch(
      updateEntryRegOptions({
        participantId: participant.id,
        regOptions: participant.regOptions,
      })
    )

    dispatch(
      updateEntryRegChoice({
        participantId: participant.id,
        regChoice:
          participant.regChoice?.status !== RegOptionStatus.isActive
            ? null
            : participant.regChoice,
      })
    )
  })

  const orderSummaryPayload = {
    totalPrice: data.totalPrice,
    customFees: data.customFees,
    totalServiceFee: data.totalServiceFee,
    totalSalesTax: data.totalSalesTax,
    total: data.total,
  }

  if (data.isStatusChanged) {
    AlertModal.open({
      title: t('isFullRegistration'),
      text: t('IsFullRegistrationDescription'),
      buttonText: t('isFullRegistrationConfirm'),
    })

    dispatch(setOrderSummaryStatus(OrderSummaryStatus.Failed))
  } else if (data.isPriceChanged) {
    AlertModal.open({
      title: t('isPriceChanged'),
      text: t('isPriceChangedDescription'),
      buttonText: t('isPriceChangedConfirm'),
    })

    dispatch(updateOrderSummary(orderSummaryPayload))
    dispatch(setOrderSummaryStatus(OrderSummaryStatus.Failed))
  } else {
    dispatch(updateOrderSummary(orderSummaryPayload))
    dispatch(setOrderSummaryStatus(OrderSummaryStatus.Succeeded))
  }
}
