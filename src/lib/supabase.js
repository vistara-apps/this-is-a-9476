import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema types based on PRD data model
export const TABLES = {
  USERS: 'users',
  PLATFORM_INTEGRATIONS: 'platform_integrations',
  EARNINGS: 'earnings',
  LEARNING_CONTENT: 'learning_content',
  USER_SUBSCRIPTIONS: 'user_subscriptions'
}

// Helper functions for database operations
export const dbHelpers = {
  // User operations
  async createUser(userData) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .insert([userData])
      .select()
    return { data, error }
  },

  async getUserById(userId) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('userId', userId)
      .single()
    return { data, error }
  },

  // Platform integration operations
  async createPlatformIntegration(integrationData) {
    const { data, error } = await supabase
      .from(TABLES.PLATFORM_INTEGRATIONS)
      .insert([integrationData])
      .select()
    return { data, error }
  },

  async getUserPlatformIntegrations(userId) {
    const { data, error } = await supabase
      .from(TABLES.PLATFORM_INTEGRATIONS)
      .select('*')
      .eq('userId', userId)
    return { data, error }
  },

  // Earnings operations
  async createEarning(earningData) {
    const { data, error } = await supabase
      .from(TABLES.EARNINGS)
      .insert([earningData])
      .select()
    return { data, error }
  },

  async getUserEarnings(userId, startDate = null, endDate = null) {
    let query = supabase
      .from(TABLES.EARNINGS)
      .select('*')
      .eq('userId', userId)
      .order('date', { ascending: false })

    if (startDate) {
      query = query.gte('date', startDate)
    }
    if (endDate) {
      query = query.lte('date', endDate)
    }

    const { data, error } = await query
    return { data, error }
  },

  async getEarningsByPlatform(userId, platform) {
    const { data, error } = await supabase
      .from(TABLES.EARNINGS)
      .select('*')
      .eq('userId', userId)
      .eq('platform', platform)
      .order('date', { ascending: false })
    return { data, error }
  },

  // Learning content operations
  async getLearningContent(tags = null) {
    let query = supabase
      .from(TABLES.LEARNING_CONTENT)
      .select('*')
      .order('title')

    if (tags && tags.length > 0) {
      query = query.contains('tags', tags)
    }

    const { data, error } = await query
    return { data, error }
  },

  // Subscription operations
  async createUserSubscription(subscriptionData) {
    const { data, error } = await supabase
      .from(TABLES.USER_SUBSCRIPTIONS)
      .insert([subscriptionData])
      .select()
    return { data, error }
  },

  async getUserSubscription(userId) {
    const { data, error } = await supabase
      .from(TABLES.USER_SUBSCRIPTIONS)
      .select('*')
      .eq('userId', userId)
      .single()
    return { data, error }
  }
}
