import { useState, useEffect } from 'react'
import { loadStripe, Stripe } from '@stripe/stripe-js'

import { EventPaymentProcessor } from 'src/api/event/types'

function useStripeInstance(
  paymentProcessor?: EventPaymentProcessor
): Promise<Stripe | null> | null {
  const [stripeInstance, setStripeInstance] =
    useState<Promise<Stripe | null> | null>(null)

  useEffect(() => {
    let stripeKey: string | null = null

    if (paymentProcessor === EventPaymentProcessor.Stripe) {
      stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    } else if (paymentProcessor === EventPaymentProcessor.Stripe_EU) {
      stripeKey = process.env.NEXT_PUBLIC_STRIPE_EU_PUBLISHABLE_KEY!
    }

    if (stripeKey) {
      const stripe = loadStripe(stripeKey)
      setStripeInstance(stripe)
    }
  }, [paymentProcessor])

  return stripeInstance
}

export default useStripeInstance
