# CreatorFlow API Documentation

## Overview

CreatorFlow uses a combination of Supabase for backend services, Stripe for payments, and AI services for personalized recommendations. This document outlines all API integrations and endpoints required for the application.

## Table of Contents

1. [Authentication](#authentication)
2. [Database Operations](#database-operations)
3. [Platform Integrations](#platform-integrations)
4. [Payment Processing](#payment-processing)
5. [AI Services](#ai-services)
6. [Webhooks](#webhooks)

## Authentication

### Supabase Auth

CreatorFlow uses Supabase Auth for user authentication and authorization.

#### Sign Up
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'John Doe'
    }
  }
})
```

#### Sign In
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})
```

#### OAuth Sign In
```javascript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google', // or 'github'
  options: {
    redirectTo: `${window.location.origin}/dashboard`
  }
})
```

## Database Operations

### Users

#### Get User Profile
```javascript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('userId', userId)
  .single()
```

#### Update User Profile
```javascript
const { data, error } = await supabase
  .from('users')
  .update({ subscriptionTier: 'advanced' })
  .eq('userId', userId)
```

### Platform Integrations

#### Create Platform Integration
```javascript
const { data, error } = await supabase
  .from('platform_integrations')
  .insert([{
    userId: userId,
    platformName: 'youtube',
    apiCredentials: {
      accessToken: 'token',
      refreshToken: 'refresh_token',
      expiresAt: '2024-01-01T00:00:00Z'
    }
  }])
```

#### Get User Platform Integrations
```javascript
const { data, error } = await supabase
  .from('platform_integrations')
  .select('*')
  .eq('userId', userId)
  .eq('isActive', true)
```

### Earnings

#### Create Earning Record
```javascript
const { data, error } = await supabase
  .from('earnings')
  .insert([{
    userId: userId,
    platform: 'youtube',
    amount: 150.00,
    currency: 'USD',
    date: '2024-01-15',
    source: 'Ad Revenue'
  }])
```

#### Get User Earnings
```javascript
const { data, error } = await supabase
  .from('earnings')
  .select('*')
  .eq('userId', userId)
  .gte('date', startDate)
  .lte('date', endDate)
  .order('date', { ascending: false })
```

#### Get Earnings by Platform
```javascript
const { data, error } = await supabase
  .from('earnings')
  .select('*')
  .eq('userId', userId)
  .eq('platform', 'youtube')
  .order('date', { ascending: false })
```

### Learning Content

#### Get All Learning Content
```javascript
const { data, error } = await supabase
  .from('learning_content')
  .select('*')
  .order('title')
```

#### Get Content by Category
```javascript
const { data, error } = await supabase
  .from('learning_content')
  .select('*')
  .eq('category', 'Monetization')
  .order('title')
```

#### Search Learning Content
```javascript
const { data, error } = await supabase
  .from('learning_content')
  .select('*')
  .textSearch('title', searchQuery)
```

## Platform Integrations

### YouTube API

#### Get Channel Analytics
```javascript
// Endpoint: https://youtubeanalytics.googleapis.com/v2/reports
const response = await fetch(`https://youtubeanalytics.googleapis.com/v2/reports?ids=channel%3D%3DMINE&startDate=${startDate}&endDate=${endDate}&metrics=estimatedRevenue,views,subscribersGained&dimensions=day`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': 'application/json'
  }
})
```

#### Get Channel Details
```javascript
// Endpoint: https://www.googleapis.com/youtube/v3/channels
const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': 'application/json'
  }
})
```

### Patreon API

#### Get Campaign Data
```javascript
// Endpoint: https://www.patreon.com/api/oauth2/v2/campaigns
const response = await fetch('https://www.patreon.com/api/oauth2/v2/campaigns?include=pledges', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': 'application/json'
  }
})
```

### Ko-fi API

#### Get Donations
```javascript
// Ko-fi uses webhooks for real-time data
// Webhook endpoint: POST /api/webhooks/kofi
```

### Twitch API

#### Get Channel Analytics
```javascript
// Endpoint: https://api.twitch.tv/helix/analytics/extensions
const response = await fetch('https://api.twitch.tv/helix/analytics/extensions', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Client-Id': clientId,
    'Accept': 'application/json'
  }
})
```

## Payment Processing

### Stripe Integration

#### Create Checkout Session
```javascript
// Backend endpoint: POST /api/create-checkout-session
const response = await fetch('/api/create-checkout-session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    priceId: 'price_basic_monthly',
    userId: userId,
    successUrl: `${window.location.origin}/success`,
    cancelUrl: `${window.location.origin}/cancel`
  })
})
```

#### Create Customer Portal Session
```javascript
// Backend endpoint: POST /api/create-portal-session
const response = await fetch('/api/create-portal-session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    customerId: customerId,
    returnUrl: `${window.location.origin}/settings`
  })
})
```

#### Get Subscription Status
```javascript
// Backend endpoint: GET /api/subscription-status/:customerId
const response = await fetch(`/api/subscription-status/${customerId}`)
const data = await response.json()
```

## AI Services

### OpenAI Integration

#### Generate Learning Recommendations
```javascript
// Backend endpoint: POST /api/ai/recommendations
const response = await fetch('/api/ai/recommendations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`
  },
  body: JSON.stringify({
    earningsData: userEarnings,
    platformPerformance: platformStats
  })
})
```

#### Analyze Content Performance
```javascript
// Backend endpoint: POST /api/ai/analyze-content
const response = await fetch('/api/ai/analyze-content', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`
  },
  body: JSON.stringify({
    contentData: contentPerformanceData
  })
})
```

### Anthropic Integration (Alternative)

#### Generate Recommendations with Claude
```javascript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': apiKey,
    'Content-Type': 'application/json',
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  })
})
```

## Webhooks

### Stripe Webhooks

#### Subscription Created
```javascript
// Endpoint: POST /api/webhooks/stripe
// Event: customer.subscription.created
{
  "type": "customer.subscription.created",
  "data": {
    "object": {
      "id": "sub_1234567890",
      "customer": "cus_1234567890",
      "status": "active",
      "items": {
        "data": [
          {
            "price": {
              "id": "price_basic_monthly"
            }
          }
        ]
      }
    }
  }
}
```

#### Subscription Updated
```javascript
// Event: customer.subscription.updated
{
  "type": "customer.subscription.updated",
  "data": {
    "object": {
      "id": "sub_1234567890",
      "customer": "cus_1234567890",
      "status": "canceled",
      "cancel_at_period_end": true
    }
  }
}
```

### Platform Webhooks

#### Ko-fi Donation Webhook
```javascript
// Endpoint: POST /api/webhooks/kofi
{
  "verification_token": "your-verification-token",
  "message_id": "12345678-1234-1234-1234-123456789012",
  "timestamp": "2024-01-15T10:30:00Z",
  "type": "Donation",
  "is_public": true,
  "from_name": "Supporter Name",
  "message": "Keep up the great work!",
  "amount": "5.00",
  "url": "https://ko-fi.com/Home/CoffeeShop?txid=12345",
  "email": "supporter@example.com",
  "currency": "USD",
  "is_subscription_payment": false,
  "is_first_subscription_payment": false,
  "kofi_transaction_id": "12345678-1234-1234-1234-123456789012"
}
```

## Error Handling

### Standard Error Response Format
```javascript
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request is invalid",
    "details": {
      "field": "email",
      "issue": "Email is required"
    }
  }
}
```

### Common Error Codes
- `UNAUTHORIZED`: User is not authenticated
- `FORBIDDEN`: User doesn't have permission
- `NOT_FOUND`: Resource not found
- `INVALID_REQUEST`: Request validation failed
- `RATE_LIMITED`: Too many requests
- `INTERNAL_ERROR`: Server error

## Rate Limiting

### API Rate Limits
- Supabase: 100 requests per second per user
- Stripe: 100 requests per second
- OpenAI: 3,500 requests per minute (GPT-3.5-turbo)
- Platform APIs: Varies by platform

### Best Practices
1. Implement exponential backoff for retries
2. Cache frequently accessed data
3. Use batch operations when possible
4. Monitor rate limit headers
5. Implement circuit breakers for external APIs

## Security Considerations

### API Key Management
- Store API keys in environment variables
- Use different keys for development and production
- Rotate keys regularly
- Never expose keys in client-side code

### Data Protection
- All API communications use HTTPS
- Implement Row Level Security (RLS) in Supabase
- Validate all input data
- Sanitize user-generated content
- Use prepared statements for database queries

### Authentication
- Use JWT tokens for API authentication
- Implement token refresh mechanisms
- Set appropriate token expiration times
- Use secure session management

## Monitoring and Logging

### Key Metrics to Monitor
- API response times
- Error rates by endpoint
- User authentication success/failure rates
- Platform integration sync success rates
- Payment processing success rates

### Logging Best Practices
- Log all API requests and responses
- Include correlation IDs for request tracking
- Log security events (failed logins, etc.)
- Use structured logging (JSON format)
- Implement log aggregation and analysis

## Development Setup

### Environment Variables Required
```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret

# AI Services
VITE_AI_API_KEY=your-ai-api-key
VITE_AI_PROVIDER=openai

# Platform APIs
YOUTUBE_CLIENT_ID=your-youtube-client-id
YOUTUBE_CLIENT_SECRET=your-youtube-client-secret
PATREON_CLIENT_ID=your-patreon-client-id
PATREON_CLIENT_SECRET=your-patreon-client-secret
# ... other platform credentials
```

### Testing
- Use test API keys for all services
- Implement comprehensive unit tests
- Use integration tests for API endpoints
- Test webhook handling with mock data
- Validate error handling scenarios
