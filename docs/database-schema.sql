-- CreatorFlow Database Schema
-- Based on PRD Data Model Specifications

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    userId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    encryptedAPIKeys JSONB DEFAULT '{}',
    platformIntegrations JSONB DEFAULT '[]',
    subscriptionTier VARCHAR(50) DEFAULT 'free',
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform Integrations table
CREATE TABLE platform_integrations (
    integrationId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID NOT NULL REFERENCES users(userId) ON DELETE CASCADE,
    platformName VARCHAR(100) NOT NULL,
    apiCredentials JSONB NOT NULL,
    lastSync TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    isActive BOOLEAN DEFAULT true,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(userId, platformName)
);

-- Earnings table
CREATE TABLE earnings (
    earningId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID NOT NULL REFERENCES users(userId) ON DELETE CASCADE,
    platform VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    date DATE NOT NULL,
    source VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_earnings_user_date (userId, date),
    INDEX idx_earnings_platform (platform),
    INDEX idx_earnings_date (date)
);

-- Learning Content table
CREATE TABLE learning_content (
    contentId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(500),
    tags TEXT[],
    category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50),
    type VARCHAR(50), -- 'article', 'course', 'video', etc.
    readTime VARCHAR(50),
    associatedPainPoint VARCHAR(255),
    isRecommended BOOLEAN DEFAULT false,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_learning_category (category),
    INDEX idx_learning_tags USING GIN (tags)
);

-- User Subscriptions table (for Stripe integration)
CREATE TABLE user_subscriptions (
    subscriptionId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID NOT NULL REFERENCES users(userId) ON DELETE CASCADE,
    stripeCustomerId VARCHAR(255) UNIQUE,
    stripeSubscriptionId VARCHAR(255) UNIQUE,
    status VARCHAR(50) NOT NULL, -- 'active', 'canceled', 'past_due', etc.
    tier VARCHAR(50) NOT NULL, -- 'basic', 'advanced'
    currentPeriodStart TIMESTAMP WITH TIME ZONE,
    currentPeriodEnd TIMESTAMP WITH TIME ZONE,
    cancelAtPeriodEnd BOOLEAN DEFAULT false,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(userId)
);

-- Content Engagement table (for tracking user interactions)
CREATE TABLE content_engagement (
    engagementId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID NOT NULL REFERENCES users(userId) ON DELETE CASCADE,
    contentId UUID NOT NULL REFERENCES learning_content(contentId) ON DELETE CASCADE,
    engagementType VARCHAR(50) NOT NULL, -- 'view', 'complete', 'bookmark', etc.
    duration INTEGER, -- in seconds, for tracking time spent
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_engagement_user (userId),
    INDEX idx_engagement_content (contentId),
    INDEX idx_engagement_type (engagementType)
);

-- User Goals table (for tracking creator goals and progress)
CREATE TABLE user_goals (
    goalId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID NOT NULL REFERENCES users(userId) ON DELETE CASCADE,
    goalType VARCHAR(100) NOT NULL, -- 'monthly_earnings', 'platform_growth', etc.
    targetValue DECIMAL(10,2) NOT NULL,
    currentValue DECIMAL(10,2) DEFAULT 0,
    targetDate DATE,
    isCompleted BOOLEAN DEFAULT false,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_goals_user (userId),
    INDEX idx_goals_type (goalType)
);

-- AI Recommendations table (for storing AI-generated recommendations)
CREATE TABLE ai_recommendations (
    recommendationId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID NOT NULL REFERENCES users(userId) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(50) NOT NULL, -- 'High', 'Medium', 'Low'
    estimatedImpact TEXT,
    isViewed BOOLEAN DEFAULT false,
    isCompleted BOOLEAN DEFAULT false,
    generatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiresAt TIMESTAMP WITH TIME ZONE,
    
    INDEX idx_recommendations_user (userId),
    INDEX idx_recommendations_priority (priority),
    INDEX idx_recommendations_category (category)
);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = userId);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = userId);

-- RLS Policies for platform_integrations table
CREATE POLICY "Users can manage own integrations" ON platform_integrations
    FOR ALL USING (auth.uid() = userId);

-- RLS Policies for earnings table
CREATE POLICY "Users can manage own earnings" ON earnings
    FOR ALL USING (auth.uid() = userId);

-- RLS Policies for user_subscriptions table
CREATE POLICY "Users can view own subscription" ON user_subscriptions
    FOR SELECT USING (auth.uid() = userId);

CREATE POLICY "System can manage subscriptions" ON user_subscriptions
    FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for content_engagement table
CREATE POLICY "Users can manage own engagement" ON content_engagement
    FOR ALL USING (auth.uid() = userId);

-- RLS Policies for user_goals table
CREATE POLICY "Users can manage own goals" ON user_goals
    FOR ALL USING (auth.uid() = userId);

-- RLS Policies for ai_recommendations table
CREATE POLICY "Users can view own recommendations" ON ai_recommendations
    FOR SELECT USING (auth.uid() = userId);

CREATE POLICY "Users can update own recommendations" ON ai_recommendations
    FOR UPDATE USING (auth.uid() = userId);

-- Learning content is public (no RLS needed)
-- But we can add policies if we want to restrict access based on subscription tier

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platform_integrations_updated_at BEFORE UPDATE ON platform_integrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_content_updated_at BEFORE UPDATE ON learning_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_goals_updated_at BEFORE UPDATE ON user_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample learning content
INSERT INTO learning_content (title, description, category, difficulty, type, readTime, tags, isRecommended) VALUES
('How to Secure Your First Brand Deal', 'Learn the essential steps to land lucrative brand partnerships and sponsorship deals as a content creator.', 'Brand Partnerships', 'Intermediate', 'Article', '8 min read', ARRAY['brand deals', 'sponsorships', 'partnerships'], true),
('YouTube Monetization Strategies Beyond AdSense', 'Discover multiple revenue streams on YouTube including memberships, Super Chat, and merchandise.', 'Monetization', 'Beginner', 'Course', '2 hour course', ARRAY['youtube', 'monetization', 'revenue streams'], true),
('Content Analytics: Understanding Your Audience', 'Master the art of analyzing your content performance and audience behavior to optimize earnings.', 'Analytics', 'Advanced', 'Article', '12 min read', ARRAY['analytics', 'audience', 'performance'], false),
('Building a Sustainable Patreon Strategy', 'Create a recurring revenue stream with effective Patreon tier structuring and content planning.', 'Monetization', 'Intermediate', 'Course', '1.5 hour course', ARRAY['patreon', 'subscriptions', 'recurring revenue'], false),
('Social Media Cross-Promotion Tactics', 'Leverage multiple platforms to grow your audience and increase overall creator earnings.', 'Audience Growth', 'Beginner', 'Article', '6 min read', ARRAY['social media', 'cross-promotion', 'growth'], false),
('Email Marketing for Creators', 'Build and monetize an email list to create direct relationships with your most engaged fans.', 'Marketing', 'Intermediate', 'Course', '3 hour course', ARRAY['email marketing', 'audience building', 'direct marketing'], false),
('Creating High-Converting Landing Pages', 'Design landing pages that convert visitors into paying customers and subscribers.', 'Marketing', 'Advanced', 'Article', '10 min read', ARRAY['landing pages', 'conversion', 'web design'], false),
('Live Streaming Revenue Optimization', 'Maximize earnings from live streaming through donations, subscriptions, and viewer engagement.', 'Content Creation', 'Beginner', 'Article', '7 min read', ARRAY['live streaming', 'donations', 'engagement'], false);
