//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { FormEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useElements, useStripe } from '@stripe/react-stripe-js'
import styled from 'styled-components'

import { action } from '@/api'
import { IAppState } from '@/state'
import { IUserTasksheetSubscription } from '@/state/user/types'
import {
  updateUserTasksheetSubscription
} from '@/state/user/actions'

import StripeAgreeToChargeCheckbox from '@desktop/Stripe/StripeAgreeToChargeCheckbox'
import StripeCardInput from '@desktop/Stripe/StripeCardInput'
import StripeForm from '@desktop/Stripe/StripeForm'
import StripeSubmitButton from '@desktop/Stripe/StripeSubmitButton'
import StripeTermsOfServiceCheckbox from '@desktop/Stripe/StripeTermsOfServiceCheckbox'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const StripePurchaseSubscriptionPaymentFormElements = ({
  monthlyOrLifetimeSubscription
}: IStripePurchaseSubscriptionPaymentFormElements) => { 
  
  const stripeElements = useElements()
  const stripe = useStripe()

  const dispatch = useDispatch()
  const userId = useSelector((state: IAppState) => state.user.id)
  const userSubscriptionStripePaymentIntentClientSecret = useSelector((state: IAppState) => state.user.tasksheetSubscription.stripeSetupIntentClientSecret)
  
  const [ isChargeAgreedTo, setIsChargeAgreedTo ] = useState(false)
  const [ isTermsOfServiceAccepted, setIsTermsOfServiceAccepted ] = useState(false)
  const [ isChargeBeingProcessed, setIsChargeBeingProcessed ] = useState(false)
  const [ stripeErrorMessage, setStripeErrorMessage] = useState(null)
  
  useEffect(() => {
    setIsChargeAgreedTo(false)
    setStripeErrorMessage(null)
  }, [ monthlyOrLifetimeSubscription ])
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStripeErrorMessage(null)
    setIsChargeBeingProcessed(true)

    const cardNumberElement = stripeElements.getElement('cardNumber')
    // Purchase a monthly susbcription
    if(monthlyOrLifetimeSubscription === 'MONTHLY') {
      // Get the Stripe setupIntent
      const { setupIntent, error } = await stripe.confirmCardSetup(userSubscriptionStripePaymentIntentClientSecret, {
        payment_method: {
          card: cardNumberElement,
        }
      })
      if(error) {
        setTimeout(() => {
          setStripeErrorMessage(error.message)
          setIsChargeBeingProcessed(false)
        }, 350)
      }
      else {
        // Send the setupIntent to the backend to process the subscription
        action.userSubscriptionPurchaseMonthly(userId, setupIntent.payment_method).then(response => {
          const error = response.status === 500
          if(error) {
            setIsChargeBeingProcessed(false)
            setStripeErrorMessage(response.data.message || 'We were unable to process your card. Please try again.')
          }
          else {
            dispatch(updateUserTasksheetSubscription({ type: 'MONTHLY' }))
          }
        })
      }
    }
    // Purchase a lifetime subscription
    if(monthlyOrLifetimeSubscription === 'LIFETIME') {
      // Get the Stripe paymentMethod
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement
      })
      if(error) {
        setTimeout(() => {
          setStripeErrorMessage(error.message)
          setIsChargeBeingProcessed(false)
        }, 350)
      }
      else {
        // Send the payment method to the backend to be processed
        action.userSubscriptionPurchaseLifetime(userId, paymentMethod.id).then(response => {
          const error = response.status === 500
          if(error) {
            setIsChargeBeingProcessed(false)
            setStripeErrorMessage(response.data.message || 'We were unable to process your card. Please try again.')
          }
          // If the purchase is successful, update the user subscription
          else {
            const nextUserSubscription = response.data as IUserTasksheetSubscription
            dispatch(updateUserTasksheetSubscription({ 
              type: nextUserSubscription.type, 
              subscriptionStartDate: nextUserSubscription.subscriptionStartDate,
              subscriptionEndDate: nextUserSubscription.subscriptionEndDate
            }))
          }
        })
      }
    }
  }
  
  const text = {
    MONTHLY: {
      agreeToCharge: "I agree to be charged $5 each month",
      submitButton: "Subscribe To Monthly Access"
    },
    LIFETIME: {
      agreeToCharge: "I agree to be charged $100 immediately",
      submitButton: "Purchase Lifetime Access"
    }
  }
  
  return (
      <StripeForm 
        onSubmit={handleSubmit}>
        <StripeCardInput />
        <StripeTermsOfServiceCheckbox
          checkboxValue={isTermsOfServiceAccepted}
          updateCheckboxValue={setIsTermsOfServiceAccepted}/>
        <StripeAgreeToChargeCheckbox
          checkboxValue={isChargeAgreedTo}
          updateCheckboxValue={setIsChargeAgreedTo}
          text={text[monthlyOrLifetimeSubscription].agreeToCharge}/>
        <StripeSubmitButton 
          isDisabled={!isChargeAgreedTo || !isTermsOfServiceAccepted}
          text={isChargeBeingProcessed ? 'Processing...' : text[monthlyOrLifetimeSubscription].submitButton}/>
        {stripeErrorMessage && 
          <StripeErrorMessage>
            {stripeErrorMessage}
          </StripeErrorMessage>
        }
      </StripeForm>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IStripePurchaseSubscriptionPaymentFormElements {
  monthlyOrLifetimeSubscription: 'MONTHLY' | 'LIFETIME'
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const StripeErrorMessage = styled.div`
  color: rgb(150, 0, 0);
`

export default StripePurchaseSubscriptionPaymentFormElements
