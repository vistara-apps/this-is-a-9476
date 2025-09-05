export const mockData = {
  stats: {
    totalEarnings: 15420,
    monthlyGrowth: 12.5,
    activePlatforms: 4,
    goalProgress: 75
  },
  
  platforms: [
    { id: 1, name: 'YouTube', connected: true, earnings: 8500 },
    { id: 2, name: 'Patreon', connected: true, earnings: 3200 },
    { id: 3, name: 'Ko-fi', connected: true, earnings: 890 },
    { id: 4, name: 'Twitch', connected: false, earnings: 0 },
    { id: 5, name: 'Twitter', connected: false, earnings: 0 },
    { id: 6, name: 'Instagram', connected: false, earnings: 0 }
  ],
  
  revenueData: [
    { month: 'Jan', revenue: 8500 },
    { month: 'Feb', revenue: 9200 },
    { month: 'Mar', revenue: 8800 },
    { month: 'Apr', revenue: 10100 },
    { month: 'May', revenue: 11200 },
    { month: 'Jun', revenue: 12400 },
    { month: 'Jul', revenue: 13100 },
    { month: 'Aug', revenue: 14200 },
    { month: 'Sep', revenue: 15420 }
  ],
  
  insights: {
    platformBreakdown: [
      { platform: 'YouTube', revenue: 8500 },
      { platform: 'Patreon', revenue: 3200 },
      { platform: 'Ko-fi', revenue: 890 },
      { platform: 'Sponsorships', revenue: 2830 }
    ],
    
    performanceMetrics: {
      revenuePerHour: 45,
      topPlatform: 'YouTube',
      bestContentType: 'Tutorials',
      avgDailyEarnings: 514
    },
    
    topContent: [
      {
        id: 1,
        title: 'React Tutorial Series',
        platform: 'YouTube',
        type: 'Video Series',
        revenue: 2450,
        views: '125K'
      },
      {
        id: 2,
        title: 'JavaScript Masterclass',
        platform: 'Patreon',
        type: 'Course',
        revenue: 1890,
        views: '45K'
      },
      {
        id: 3,
        title: 'CSS Grid Complete Guide',
        platform: 'YouTube',
        type: 'Tutorial',
        revenue: 1320,
        views: '89K'
      },
      {
        id: 4,
        title: 'Web Dev Coffee Chat',
        platform: 'Ko-fi',
        type: 'Live Stream',
        revenue: 890,
        views: '12K'
      }
    ]
  },
  
  learning: {
    categories: [
      'Content Creation',
      'Monetization',
      'Audience Growth',
      'Brand Partnerships',
      'Analytics',
      'Marketing'
    ],
    
    learningContent: [
      {
        id: 1,
        title: 'How to Secure Your First Brand Deal',
        description: 'Learn the essential steps to land lucrative brand partnerships and sponsorship deals as a content creator.',
        category: 'Brand Partnerships',
        type: 'Article',
        difficulty: 'Intermediate',
        readTime: '8 min read',
        recommended: true
      },
      {
        id: 2,
        title: 'YouTube Monetization Strategies Beyond AdSense',
        description: 'Discover multiple revenue streams on YouTube including memberships, Super Chat, and merchandise.',
        category: 'Monetization',
        type: 'Course',
        difficulty: 'Beginner',
        readTime: '2 hour course',
        recommended: true
      },
      {
        id: 3,
        title: 'Content Analytics: Understanding Your Audience',
        description: 'Master the art of analyzing your content performance and audience behavior to optimize earnings.',
        category: 'Analytics',
        type: 'Article',
        difficulty: 'Advanced',
        readTime: '12 min read',
        recommended: false
      },
      {
        id: 4,
        title: 'Building a Sustainable Patreon Strategy',
        description: 'Create a recurring revenue stream with effective Patreon tier structuring and content planning.',
        category: 'Monetization',
        type: 'Course',
        difficulty: 'Intermediate',
        readTime: '1.5 hour course',
        recommended: false
      },
      {
        id: 5,
        title: 'Social Media Cross-Promotion Tactics',
        description: 'Leverage multiple platforms to grow your audience and increase overall creator earnings.',
        category: 'Audience Growth',
        type: 'Article',
        difficulty: 'Beginner',
        readTime: '6 min read',
        recommended: false
      },
      {
        id: 6,
        title: 'Email Marketing for Creators',
        description: 'Build and monetize an email list to create direct relationships with your most engaged fans.',
        category: 'Marketing',
        type: 'Course',
        difficulty: 'Intermediate',
        readTime: '3 hour course',
        recommended: false
      },
      {
        id: 7,
        title: 'Creating High-Converting Landing Pages',
        description: 'Design landing pages that convert visitors into paying customers and subscribers.',
        category: 'Marketing',
        type: 'Article',
        difficulty: 'Advanced',
        readTime: '10 min read',
        recommended: false
      },
      {
        id: 8,
        title: 'Live Streaming Revenue Optimization',
        description: 'Maximize earnings from live streaming through donations, subscriptions, and viewer engagement.',
        category: 'Content Creation',
        type: 'Article',
        difficulty: 'Beginner',
        readTime: '7 min read',
        recommended: false
      }
    ]
  }
}