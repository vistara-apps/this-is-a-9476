// AI-powered content curation service
// Uses OpenAI/Anthropic for personalized learning recommendations

const AI_API_KEY = import.meta.env.VITE_AI_API_KEY || 'your-api-key'
const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER || 'openai' // 'openai' or 'anthropic'

// AI service configuration
const AI_CONFIG = {
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-3.5-turbo',
    headers: {
      'Authorization': `Bearer ${AI_API_KEY}`,
      'Content-Type': 'application/json'
    }
  },
  anthropic: {
    baseUrl: 'https://api.anthropic.com/v1',
    model: 'claude-3-haiku-20240307',
    headers: {
      'x-api-key': AI_API_KEY,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    }
  }
}

// AI helper functions
export const aiHelpers = {
  // Generate personalized learning recommendations based on earnings data
  async generateLearningRecommendations(userEarningsData, platformPerformance) {
    try {
      const prompt = this.buildRecommendationPrompt(userEarningsData, platformPerformance)
      
      if (AI_PROVIDER === 'openai') {
        return await this.callOpenAI(prompt)
      } else if (AI_PROVIDER === 'anthropic') {
        return await this.callAnthropic(prompt)
      } else {
        throw new Error('Invalid AI provider specified')
      }
    } catch (error) {
      console.error('Error generating AI recommendations:', error)
      return { error: error.message }
    }
  },

  // Build prompt for learning recommendations
  buildRecommendationPrompt(earningsData, platformPerformance) {
    const totalEarnings = earningsData.reduce((sum, earning) => sum + earning.amount, 0)
    const topPlatform = platformPerformance.topPlatform
    const lowestPlatform = platformPerformance.lowestPlatform
    
    return `
      As a creator monetization expert, analyze this creator's earnings data and provide personalized learning recommendations:

      Total Earnings: $${totalEarnings}
      Top Performing Platform: ${topPlatform.name} ($${topPlatform.earnings})
      Lowest Performing Platform: ${lowestPlatform.name} ($${lowestPlatform.earnings})
      
      Platform Breakdown:
      ${platformPerformance.platforms.map(p => `- ${p.name}: $${p.earnings}`).join('\n')}

      Based on this data, recommend 3-5 specific learning topics that would help this creator optimize their earnings. Focus on:
      1. Improving underperforming platforms
      2. Scaling successful strategies
      3. Diversifying revenue streams
      4. Addressing specific monetization gaps

      Return recommendations in JSON format:
      {
        "recommendations": [
          {
            "title": "Learning Topic Title",
            "description": "Why this is important for this creator",
            "category": "Monetization|Content Creation|Audience Growth|Brand Partnerships|Analytics|Marketing",
            "priority": "High|Medium|Low",
            "estimatedImpact": "Brief description of potential earnings impact"
          }
        ]
      }
    `
  },

  // Call OpenAI API
  async callOpenAI(prompt) {
    const config = AI_CONFIG.openai
    
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'system',
            content: 'You are a creator monetization expert who provides actionable, data-driven recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    })

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error.message)
    }

    try {
      const recommendations = JSON.parse(data.choices[0].message.content)
      return { data: recommendations }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      return { error: 'Failed to parse AI recommendations' }
    }
  },

  // Call Anthropic API
  async callAnthropic(prompt) {
    const config = AI_CONFIG.anthropic
    
    const response = await fetch(`${config.baseUrl}/messages`, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify({
        model: config.model,
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error.message)
    }

    try {
      const recommendations = JSON.parse(data.content[0].text)
      return { data: recommendations }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      return { error: 'Failed to parse AI recommendations' }
    }
  },

  // Analyze content performance and suggest improvements
  async analyzeContentPerformance(contentData) {
    const prompt = `
      Analyze this content performance data and provide actionable insights:
      
      ${contentData.map(content => `
        Title: ${content.title}
        Platform: ${content.platform}
        Type: ${content.type}
        Revenue: $${content.revenue}
        Views: ${content.views}
      `).join('\n')}

      Provide insights in JSON format:
      {
        "insights": [
          {
            "insight": "Key finding about content performance",
            "recommendation": "Specific action to take",
            "category": "Content Strategy|Platform Optimization|Monetization"
          }
        ]
      }
    `

    if (AI_PROVIDER === 'openai') {
      return await this.callOpenAI(prompt)
    } else {
      return await this.callAnthropic(prompt)
    }
  }
}

// Fallback recommendations when AI is unavailable
export const fallbackRecommendations = {
  lowYouTubeEarnings: {
    title: "YouTube Monetization Optimization",
    description: "Your YouTube earnings could be improved with better monetization strategies",
    category: "Monetization",
    priority: "High"
  },
  lowPatreonEarnings: {
    title: "Building a Sustainable Patreon Strategy",
    description: "Learn to create compelling subscription tiers and retain subscribers",
    category: "Monetization", 
    priority: "High"
  },
  noBrandDeals: {
    title: "Securing Your First Brand Partnership",
    description: "Brand deals could significantly boost your revenue",
    category: "Brand Partnerships",
    priority: "Medium"
  },
  lowEngagement: {
    title: "Audience Growth and Engagement Tactics",
    description: "Higher engagement leads to better monetization opportunities",
    category: "Audience Growth",
    priority: "Medium"
  }
}
