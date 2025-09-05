import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key'

export const stripe = await loadStripe(stripePublishableKey)

// Subscription tiers based on PRD business model
export const SUBSCRIPTION_TIERS = {
  BASIC: {
    id: 'basic',
    name: 'Basic',
    price: 10,
    priceId: 'price_basic_monthly', // Replace with actual Stripe price ID
    features: [
      'Revenue aggregation dashboard',
      'Basic platform integrations',
      'Monthly earnings reports',
      'Basic insights and analytics'
    ]
  },
  ADVANCED: {
    id: 'advanced',
    name: 'Advanced',
    price: 25,
    priceId: 'price_advanced_monthly', // Replace with actual Stripe price ID
    features: [
      'Everything in Basic',
      'Advanced analytics and insights',
      'Personalized learning pathways',
      'AI-powered content recommendations',
      'Priority platform integrations',
      'Custom reporting'
    ]
  }
}

// Stripe helper functions
export const stripeHelpers = {
  // Create checkout session for subscription
  async createCheckoutSession(priceId, userId, successUrl, cancelUrl) {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          successUrl,
          cancelUrl
        })
      })

      const session = await response.json()
      
      if (session.error) {
        throw new Error(session.error)
      }

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      return { success: true }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      return { error: error.message }
    }
  },

  // Create customer portal session
  async createPortalSession(customerId, returnUrl) {
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl
        })
      })

      const session = await response.json()
      
      if (session.error) {
        throw new Error(session.error)
      }

      // Redirect to customer portal
      window.location.href = session.url
      
      return { success: true }
    } catch (error) {
      console.error('Error creating portal session:', error)
      return { error: error.message }
    }
  },

  // Get subscription status
  async getSubscriptionStatus(customerId) {
    try {
      const response = await fetch(`/api/subscription-status/${customerId}`)
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      return { data: data.subscription }
    } catch (error) {
      console.error('Error getting subscription status:', error)
      return { error: error.message }
    }
  }
}

// Utility functions
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

export const getTierByPriceId = (priceId) => {
  return Object.values(SUBSCRIPTION_TIERS).find(tier => tier.priceId === priceId)
}
