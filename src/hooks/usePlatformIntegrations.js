import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { dbHelpers } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

// Available platforms for integration
export const AVAILABLE_PLATFORMS = {
  YOUTUBE: {
    id: 'youtube',
    name: 'YouTube',
    description: 'Connect your YouTube channel to track ad revenue, memberships, and Super Chat earnings',
    icon: 'Youtube',
    color: '#FF0000',
    authUrl: 'https://accounts.google.com/oauth/authorize',
    scopes: ['https://www.googleapis.com/auth/youtube.readonly', 'https://www.googleapis.com/auth/yt-analytics.readonly']
  },
  PATREON: {
    id: 'patreon',
    name: 'Patreon',
    description: 'Track your subscription revenue and patron growth',
    icon: 'Heart',
    color: '#FF424D',
    authUrl: 'https://www.patreon.com/oauth2/authorize',
    scopes: ['identity', 'campaigns', 'pledges-to-me']
  },
  KOFI: {
    id: 'kofi',
    name: 'Ko-fi',
    description: 'Monitor donations and shop sales from Ko-fi',
    icon: 'Coffee',
    color: '#FF5E5B',
    authUrl: 'https://ko-fi.com/oauth/authorize',
    scopes: ['read:donations', 'read:shop']
  },
  TWITCH: {
    id: 'twitch',
    name: 'Twitch',
    description: 'Track subscriptions, bits, and ad revenue from Twitch',
    icon: 'Twitch',
    color: '#9146FF',
    authUrl: 'https://id.twitch.tv/oauth2/authorize',
    scopes: ['channel:read:subscriptions', 'bits:read', 'analytics:read:revenue']
  },
  TWITTER: {
    id: 'twitter',
    name: 'Twitter',
    description: 'Connect Twitter for Super Follows and Tip Jar earnings',
    icon: 'Twitter',
    color: '#1DA1F2',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    scopes: ['tweet.read', 'users.read', 'follows.read']
  },
  INSTAGRAM: {
    id: 'instagram',
    name: 'Instagram',
    description: 'Track Instagram creator fund and branded content earnings',
    icon: 'Instagram',
    color: '#E4405F',
    authUrl: 'https://api.instagram.com/oauth/authorize',
    scopes: ['user_profile', 'user_media', 'instagram_basic']
  }
}

// Custom hook for managing platform integrations
export const usePlatformIntegrations = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [connectingPlatform, setConnectingPlatform] = useState(null)

  // Fetch user's platform integrations
  const {
    data: integrations = [],
    isLoading,
    error,
    refetch
  } = useQuery(
    ['platformIntegrations', user?.id],
    () => dbHelpers.getUserPlatformIntegrations(user?.id),
    {
      enabled: !!user?.id,
      select: (data) => data.data || []
    }
  )

  // Create platform integration mutation
  const createIntegrationMutation = useMutation(
    (integrationData) => dbHelpers.createPlatformIntegration({
      ...integrationData,
      userId: user?.id,
      lastSync: new Date().toISOString()
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['platformIntegrations'])
        setConnectingPlatform(null)
      },
      onError: (error) => {
        console.error('Error creating platform integration:', error)
        setConnectingPlatform(null)
      }
    }
  )

  // Get connected platforms with their details
  const connectedPlatforms = integrations.map(integration => ({
    ...integration,
    platformDetails: AVAILABLE_PLATFORMS[integration.platformName.toUpperCase()]
  }))

  // Get available platforms (not yet connected)
  const availablePlatforms = Object.values(AVAILABLE_PLATFORMS).filter(
    platform => !integrations.some(integration => 
      integration.platformName.toLowerCase() === platform.id
    )
  )

  // Connect to a platform
  const connectPlatform = async (platformId) => {
    const platform = AVAILABLE_PLATFORMS[platformId.toUpperCase()]
    if (!platform) {
      throw new Error('Platform not supported')
    }

    setConnectingPlatform(platformId)

    try {
      // In a real implementation, this would handle OAuth flow
      // For now, we'll simulate the connection process
      
      // Step 1: Redirect to platform's OAuth URL
      const authUrl = buildAuthUrl(platform)
      
      // In a real app, you would redirect to the OAuth URL
      // window.location.href = authUrl
      
      // For demo purposes, we'll simulate a successful connection
      await simulateOAuthFlow(platform)
      
    } catch (error) {
      console.error(`Error connecting to ${platform.name}:`, error)
      setConnectingPlatform(null)
      throw error
    }
  }

  // Build OAuth URL for platform
  const buildAuthUrl = (platform) => {
    const params = new URLSearchParams({
      client_id: process.env[`VITE_${platform.id.toUpperCase()}_CLIENT_ID`] || 'demo_client_id',
      redirect_uri: `${window.location.origin}/auth/callback/${platform.id}`,
      response_type: 'code',
      scope: platform.scopes.join(' '),
      state: generateRandomState()
    })

    return `${platform.authUrl}?${params.toString()}`
  }

  // Simulate OAuth flow for demo
  const simulateOAuthFlow = async (platform) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Create the integration record
    const integrationData = {
      platformName: platform.id,
      apiCredentials: {
        // In a real app, these would be the actual OAuth tokens
        accessToken: 'demo_access_token',
        refreshToken: 'demo_refresh_token',
        expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
      }
    }

    return createIntegrationMutation.mutateAsync(integrationData)
  }

  // Disconnect from a platform
  const disconnectPlatform = async (integrationId) => {
    try {
      // In a real implementation, this would revoke OAuth tokens
      // and delete the integration record
      console.log(`Disconnecting platform integration: ${integrationId}`)
      
      // For now, we'll just refetch the data
      await refetch()
    } catch (error) {
      console.error('Error disconnecting platform:', error)
      throw error
    }
  }

  // Sync platform data
  const syncPlatformData = async (integrationId) => {
    try {
      // In a real implementation, this would fetch latest data from the platform
      console.log(`Syncing data for integration: ${integrationId}`)
      
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update last sync time
      // This would typically be done on the backend
      await refetch()
    } catch (error) {
      console.error('Error syncing platform data:', error)
      throw error
    }
  }

  // Generate random state for OAuth security
  const generateRandomState = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15)
  }

  // Get platform connection status
  const getPlatformStatus = (platformId) => {
    const integration = integrations.find(
      int => int.platformName.toLowerCase() === platformId.toLowerCase()
    )
    
    if (!integration) return 'disconnected'
    
    // Check if tokens are expired (in a real app)
    const expiresAt = new Date(integration.apiCredentials?.expiresAt || 0)
    if (expiresAt < new Date()) return 'expired'
    
    return 'connected'
  }

  return {
    integrations,
    connectedPlatforms,
    availablePlatforms,
    isLoading,
    error,
    connectingPlatform,
    connectPlatform,
    disconnectPlatform,
    syncPlatformData,
    getPlatformStatus,
    refetch,
    isConnecting: createIntegrationMutation.isLoading
  }
}

// Hook for handling OAuth callbacks
export const useOAuthCallback = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const handleOAuthCallback = async (platform, code, state) => {
    try {
      // In a real implementation, this would exchange the code for tokens
      const response = await fetch('/api/oauth/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          platform,
          code,
          state,
          userId: user?.id
        })
      })

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries(['platformIntegrations'])
      
      return { success: true, integration: data.integration }
    } catch (error) {
      console.error('OAuth callback error:', error)
      return { success: false, error: error.message }
    }
  }

  return { handleOAuthCallback }
}
