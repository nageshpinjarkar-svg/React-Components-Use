import { StripeElementLocale, StripeElementsOptions } from '@stripe/stripe-js'
import { useSelector } from 'react-redux'
import { Elements } from '@stripe/react-stripe-js'

import {
  RegContainer,
  RegContainerProps,
} from 'src/features/policy/components/RegContainer'
import { getServerSideProps } from 'src/features/policy/props'
import { selectLanguage } from 'src/components/LanguageSelector/languageSlice'
import { useEventData } from 'src/shared/hooks'
import useStripeInstance from 'src/shared/hooks/useStripeInstance'
import AlertModal from 'src/components/shared/AlertModal'
import ChronoSnackbar from 'src/components/shared/ChronoSnackbar'
import { CookiesConsent } from 'src/components/CookiesConsent'
import RegistrationClosed from 'src/features/registrationClosed/RegistrationClosed'
import { REG_OPEN_STATUS_MAP } from 'src/api/event/types'
import { useGetPolicyType } from 'src/features/shared/hooks'

const SectionPage = (props: RegContainerProps) => {
  const { event } = useEventData()

  const stripeInstance = useStripeInstance(event?.paymentProcessor)
  const currentLang = useSelector(selectLanguage)
  const regType = useGetPolicyType()
  const isRegOpenedPropertyName = REG_OPEN_STATUS_MAP[regType]

  const stripeOptions: StripeElementsOptions = {
    paymentMethodCreation: 'manual',
    locale: currentLang.value as StripeElementLocale,
    appearance: {
      variables: {
        fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
        borderRadius: '4px',
      },
    },
  }

  const isRegistrationClosed = !event?.[isRegOpenedPropertyName]

  if (isRegistrationClosed) {
    return <RegistrationClosed eventUrl={event!.url} />
  }

  return (
    <Elements stripe={stripeInstance} options={stripeOptions}>
      <AlertModal />
      <ChronoSnackbar />
      <RegContainer {...props} />

      {!props.isCookiesConsent ? <CookiesConsent /> : null}
    </Elements>
  )
}

export { getServerSideProps }

export default SectionPage
