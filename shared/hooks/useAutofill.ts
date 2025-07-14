import GetBrowser, { Browser } from 'src/components/shared/GetBrowser'
import { KIOSK_TYPE } from 'src/features/policy/constants'
import { useGetPolicyType } from 'src/features/shared/hooks'
import {
  DISABLE_AUTOCOMPLETE_SAFARI,
  DISABLE_AUTOCOMPLETE_CHROME,
} from 'src/types/general'

export const useAutofill = (autoComplete?: string) => {
  const isSafari = GetBrowser.get() === Browser.Safari

  const type = useGetPolicyType()

  const autoCompleteDisabled = type === KIOSK_TYPE
  const autoCompleteValue = autoCompleteDisabled
    ? isSafari
      ? DISABLE_AUTOCOMPLETE_SAFARI
      : DISABLE_AUTOCOMPLETE_CHROME
    : autoComplete

  const disablAutofillStylesForSafari = {
    '&:not(:-webkit-autofill) ::-webkit-contacts-auto-fill-button':
      autoCompleteDisabled
        ? {
            visibility: 'hidden !important',
          }
        : {},
  }

  return {
    autoCompleteValue,
    disablAutofillStylesForSafari,
  }
}
