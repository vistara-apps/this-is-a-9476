import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { dbHelpers } from '../lib/supabase'
import { aiHelpers, fallbackRecommendations } from '../lib/ai'
import { useAuth } from '../contexts/AuthContext'
import { useEarnings } from './useEarnings'

// Custom hook for learning content and recommendations
export const useLearning = () => {
  const { user } = useAuth()
  const { earnings, earningsByPlatform } = useEarnings()
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState([])
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false)

  // Fetch all learning content
  const {
    data: learningContent = [],
    isLoading: isLoadingContent,
    error: contentError
  } = useQuery(
    ['learningContent'],
    () => dbHelpers.getLearningContent(),
    {
      select: (data) => data.data || []
    }
  )

  // Generate personalized recommendations based on earnings data
  useEffect(() => {
    if (earnings.length === 0 || earningsByPlatform.length === 0) return

    const generateRecommendations = async () => {
      setIsGeneratingRecommendations(true)
      
      try {
        // Prepare platform performance data
        const platformPerformance = {
          platforms: earningsByPlatform,
          topPlatform: earningsByPlatform.reduce((max, platform) => 
            platform.totalEarnings > (max?.totalEarnings || 0) ? platform : max, null
          ),
          lowestPlatform: earningsByPlatform.reduce((min, platform) => 
            platform.totalEarnings < (min?.totalEarnings || Infinity) ? platform : min, null
          )
        }

        // Try to get AI-powered recommendations
        const aiResult = await aiHelpers.generateLearningRecommendations(earnings, platformPerformance)
        
        if (aiResult.data && aiResult.data.recommendations) {
          setPersonalizedRecommendations(aiResult.data.recommendations)
        } else {
          // Fall back to rule-based recommendations
          const fallbackRecs = generateFallbackRecommendations(platformPerformance)
          setPersonalizedRecommendations(fallbackRecs)
        }
      } catch (error) {
        console.error('Error generating recommendations:', error)
        // Use fallback recommendations
        const fallbackRecs = generateFallbackRecommendations({
          platforms: earningsByPlatform,
          topPlatform: earningsByPlatform[0],
          lowestPlatform: earningsByPlatform[earningsByPlatform.length - 1]
        })
        setPersonalizedRecommendations(fallbackRecs)
      } finally {
        setIsGeneratingRecommendations(false)
      }
    }

    generateRecommendations()
  }, [earnings, earningsByPlatform])

  // Generate fallback recommendations when AI is unavailable
  const generateFallbackRecommendations = (platformPerformance) => {
    const recommendations = []
    const totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0)

    // Low overall earnings
    if (totalEarnings < 1000) {
      recommendations.push({
        title: "Creator Monetization Fundamentals",
        description: "Learn the basics of monetizing your content across multiple platforms",
        category: "Monetization",
        priority: "High",
        estimatedImpact: "Could increase earnings by 50-100% in first 3 months"
      })
    }

    // Platform-specific recommendations
    const youtubeEarnings = earningsByPlatform.find(p => p.platform.toLowerCase() === 'youtube')?.totalEarnings || 0
    if (youtubeEarnings < 500) {
      recommendations.push(fallbackRecommendations.lowYouTubeEarnings)
    }

    const patreonEarnings = earningsByPlatform.find(p => p.platform.toLowerCase() === 'patreon')?.totalEarnings || 0
    if (patreonEarnings < 200) {
      recommendations.push(fallbackRecommendations.lowPatreonEarnings)
    }

    // No brand deals detected
    const brandDealEarnings = earningsByPlatform.find(p => p.platform.toLowerCase().includes('sponsor'))?.totalEarnings || 0
    if (brandDealEarnings === 0) {
      recommendations.push(fallbackRecommendations.noBrandDeals)
    }

    // Limited platform diversity
    if (earningsByPlatform.length < 3) {
      recommendations.push({
        title: "Multi-Platform Creator Strategy",
        description: "Diversify your revenue streams across multiple platforms",
        category: "Content Creation",
        priority: "Medium",
        estimatedImpact: "Reduce risk and increase total earnings by 30-50%"
      })
    }

    return recommendations.slice(0, 5) // Limit to 5 recommendations
  }

  // Filter learning content by category
  const getContentByCategory = (category) => {
    return learningContent.filter(content => 
      content.category.toLowerCase() === category.toLowerCase()
    )
  }

  // Get recommended content based on personalized recommendations
  const getRecommendedContent = () => {
    const recommendedCategories = personalizedRecommendations.map(rec => rec.category)
    return learningContent.filter(content => 
      recommendedCategories.includes(content.category)
    ).slice(0, 6) // Limit to 6 items
  }

  // Get content by difficulty level
  const getContentByDifficulty = (difficulty) => {
    return learningContent.filter(content => 
      content.difficulty?.toLowerCase() === difficulty.toLowerCase()
    )
  }

  // Search learning content
  const searchContent = (query) => {
    const lowercaseQuery = query.toLowerCase()
    return learningContent.filter(content => 
      content.title.toLowerCase().includes(lowercaseQuery) ||
      content.description.toLowerCase().includes(lowercaseQuery) ||
      content.category.toLowerCase().includes(lowercaseQuery)
    )
  }

  // Get learning categories with content counts
  const getCategories = () => {
    const categories = {}
    learningContent.forEach(content => {
      if (!categories[content.category]) {
        categories[content.category] = {
          name: content.category,
          count: 0,
          content: []
        }
      }
      categories[content.category].count++
      categories[content.category].content.push(content)
    })
    return Object.values(categories)
  }

  // Track content engagement (for future personalization)
  const trackContentView = async (contentId) => {
    try {
      // In a real implementation, this would track user engagement
      console.log(`Tracking view for content: ${contentId}`)
      
      // Could store in database for future recommendation improvements
      // await dbHelpers.trackContentEngagement(user?.id, contentId, 'view')
    } catch (error) {
      console.error('Error tracking content view:', error)
    }
  }

  const trackContentComplete = async (contentId) => {
    try {
      console.log(`Tracking completion for content: ${contentId}`)
      // await dbHelpers.trackContentEngagement(user?.id, contentId, 'complete')
    } catch (error) {
      console.error('Error tracking content completion:', error)
    }
  }

  return {
    // Content data
    learningContent,
    personalizedRecommendations,
    
    // Loading states
    isLoadingContent,
    isGeneratingRecommendations,
    
    // Errors
    contentError,
    
    // Content filtering and search
    getContentByCategory,
    getRecommendedContent,
    getContentByDifficulty,
    searchContent,
    getCategories,
    
    // Engagement tracking
    trackContentView,
    trackContentComplete
  }
}

// Hook for content analytics and insights
export const useLearningAnalytics = () => {
  const { learningContent, personalizedRecommendations } = useLearning()
  const [contentInsights, setContentInsights] = useState([])

  useEffect(() => {
    if (learningContent.length === 0) return

    const generateInsights = () => {
      const insights = []

      // Most popular category
      const categories = {}
      learningContent.forEach(content => {
        categories[content.category] = (categories[content.category] || 0) + 1
      })
      
      const mostPopularCategory = Object.entries(categories)
        .sort(([,a], [,b]) => b - a)[0]

      if (mostPopularCategory) {
        insights.push({
          type: 'info',
          title: 'Most Popular Category',
          description: `${mostPopularCategory[0]} has the most content (${mostPopularCategory[1]} items)`,
          recommendation: `Explore ${mostPopularCategory[0]} content to maximize learning opportunities`
        })
      }

      // Personalized recommendations available
      if (personalizedRecommendations.length > 0) {
        const highPriorityRecs = personalizedRecommendations.filter(rec => rec.priority === 'High')
        if (highPriorityRecs.length > 0) {
          insights.push({
            type: 'success',
            title: 'High-Priority Recommendations',
            description: `You have ${highPriorityRecs.length} high-priority learning recommendations`,
            recommendation: 'Focus on these recommendations for maximum impact on your earnings'
          })
        }
      }

      // Content difficulty distribution
      const difficulties = {}
      learningContent.forEach(content => {
        if (content.difficulty) {
          difficulties[content.difficulty] = (difficulties[content.difficulty] || 0) + 1
        }
      })

      const beginnerContent = difficulties['Beginner'] || 0
      const totalContent = learningContent.length

      if (beginnerContent / totalContent > 0.4) {
        insights.push({
          type: 'info',
          title: 'Beginner-Friendly Content',
          description: `${Math.round((beginnerContent / totalContent) * 100)}% of content is beginner-friendly`,
          recommendation: 'Great for getting started with new monetization strategies'
        })
      }

      setContentInsights(insights)
    }

    generateInsights()
  }, [learningContent, personalizedRecommendations])

  return {
    contentInsights,
    totalContent: learningContent.length,
    recommendationCount: personalizedRecommendations.length,
    highPriorityCount: personalizedRecommendations.filter(rec => rec.priority === 'High').length
  }
}
