import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { dbHelpers } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns'

// Custom hook for managing earnings data
export const useEarnings = (dateRange = 30) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Calculate date range
  const endDate = new Date()
  const startDate = subDays(endDate, dateRange)

  // Fetch user earnings
  const {
    data: earnings = [],
    isLoading,
    error,
    refetch
  } = useQuery(
    ['earnings', user?.id, dateRange],
    () => dbHelpers.getUserEarnings(
      user?.id,
      format(startDate, 'yyyy-MM-dd'),
      format(endDate, 'yyyy-MM-dd')
    ),
    {
      enabled: !!user?.id,
      select: (data) => data.data || []
    }
  )

  // Add new earning mutation
  const addEarningMutation = useMutation(
    (earningData) => dbHelpers.createEarning({
      ...earningData,
      userId: user?.id,
      createdAt: new Date().toISOString()
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['earnings'])
        queryClient.invalidateQueries(['platformStats'])
        queryClient.invalidateQueries(['earningsStats'])
      }
    }
  )

  // Calculate earnings statistics
  const earningsStats = {
    totalEarnings: earnings.reduce((sum, earning) => sum + earning.amount, 0),
    monthlyEarnings: earnings
      .filter(earning => {
        const earningDate = new Date(earning.date)
        return earningDate >= startOfMonth(new Date()) && earningDate <= endOfMonth(new Date())
      })
      .reduce((sum, earning) => sum + earning.amount, 0),
    averageDailyEarnings: earnings.length > 0 ? 
      earnings.reduce((sum, earning) => sum + earning.amount, 0) / dateRange : 0,
    topEarningDay: earnings.reduce((max, earning) => 
      earning.amount > (max?.amount || 0) ? earning : max, null
    )
  }

  // Group earnings by platform
  const earningsByPlatform = earnings.reduce((acc, earning) => {
    if (!acc[earning.platform]) {
      acc[earning.platform] = {
        platform: earning.platform,
        totalEarnings: 0,
        count: 0,
        earnings: []
      }
    }
    acc[earning.platform].totalEarnings += earning.amount
    acc[earning.platform].count += 1
    acc[earning.platform].earnings.push(earning)
    return acc
  }, {})

  // Group earnings by date for charts
  const earningsByDate = earnings.reduce((acc, earning) => {
    const date = format(new Date(earning.date), 'yyyy-MM-dd')
    if (!acc[date]) {
      acc[date] = 0
    }
    acc[date] += earning.amount
    return acc
  }, {})

  // Calculate growth metrics
  const calculateGrowth = (currentPeriod, previousPeriod) => {
    if (previousPeriod === 0) return currentPeriod > 0 ? 100 : 0
    return ((currentPeriod - previousPeriod) / previousPeriod) * 100
  }

  const addEarning = (earningData) => {
    return addEarningMutation.mutateAsync(earningData)
  }

  return {
    earnings,
    earningsStats,
    earningsByPlatform: Object.values(earningsByPlatform),
    earningsByDate,
    isLoading,
    error,
    refetch,
    addEarning,
    isAddingEarning: addEarningMutation.isLoading,
    addEarningError: addEarningMutation.error,
    calculateGrowth
  }
}

// Hook for platform-specific earnings
export const usePlatformEarnings = (platform) => {
  const { user } = useAuth()

  return useQuery(
    ['platformEarnings', user?.id, platform],
    () => dbHelpers.getEarningsByPlatform(user?.id, platform),
    {
      enabled: !!user?.id && !!platform,
      select: (data) => data.data || []
    }
  )
}

// Hook for earnings analytics and insights
export const useEarningsAnalytics = () => {
  const { earnings, earningsByPlatform } = useEarnings()
  const [insights, setInsights] = useState([])

  useEffect(() => {
    if (earnings.length === 0) return

    const generateInsights = () => {
      const newInsights = []

      // Top performing platform
      const topPlatform = earningsByPlatform.reduce((max, platform) => 
        platform.totalEarnings > (max?.totalEarnings || 0) ? platform : max, null
      )

      if (topPlatform) {
        newInsights.push({
          type: 'success',
          title: 'Top Performing Platform',
          description: `${topPlatform.platform} generated $${topPlatform.totalEarnings.toLocaleString()} this period`,
          recommendation: `Focus on scaling your ${topPlatform.platform} strategy`
        })
      }

      // Underperforming platforms
      const avgEarnings = earningsByPlatform.reduce((sum, p) => sum + p.totalEarnings, 0) / earningsByPlatform.length
      const underperformingPlatforms = earningsByPlatform.filter(p => p.totalEarnings < avgEarnings * 0.5)

      underperformingPlatforms.forEach(platform => {
        newInsights.push({
          type: 'warning',
          title: 'Underperforming Platform',
          description: `${platform.platform} earnings are below average`,
          recommendation: `Consider optimizing your ${platform.platform} monetization strategy`
        })
      })

      // Revenue diversification
      const platformCount = earningsByPlatform.length
      if (platformCount < 3) {
        newInsights.push({
          type: 'info',
          title: 'Revenue Diversification',
          description: 'You\'re earning from fewer than 3 platforms',
          recommendation: 'Consider expanding to additional platforms to reduce risk'
        })
      }

      setInsights(newInsights)
    }

    generateInsights()
  }, [earnings, earningsByPlatform])

  return {
    insights,
    topPlatform: earningsByPlatform.reduce((max, platform) => 
      platform.totalEarnings > (max?.totalEarnings || 0) ? platform : max, null
    ),
    platformDistribution: earningsByPlatform.map(platform => ({
      name: platform.platform,
      value: platform.totalEarnings,
      percentage: (platform.totalEarnings / earnings.reduce((sum, e) => sum + e.amount, 0)) * 100
    }))
  }
}
