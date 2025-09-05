import React from 'react'
import { DollarSign, TrendingUp, Users, Target } from 'lucide-react'
import StatCard from './StatCard'
import PlatformCard from './PlatformCard'
import RevenueChart from './RevenueChart'
import { mockData } from '../data/mockData'
import { 
  Youtube, 
  Twitter, 
  Instagram, 
  Twitch,
  Coffee,
  Heart
} from 'lucide-react'

const DashboardView = () => {
  const { stats, platforms, revenueData } = mockData

  const platformIcons = {
    'YouTube': Youtube,
    'Patreon': Heart,
    'Ko-fi': Coffee,
    'Twitch': Twitch,
    'Twitter': Twitter,
    'Instagram': Instagram
  }

  const platformColors = {
    'YouTube': '#FF0000',
    'Patreon': '#FF424D',
    'Ko-fi': '#FF5E5B',
    'Twitch': '#9146FF',
    'Twitter': '#1DA1F2',
    'Instagram': '#E4405F'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary">Track your creator earnings across all platforms</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last year</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Earnings"
          value={`$${stats.totalEarnings.toLocaleString()}`}
          change="+12.5%"
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Monthly Growth"
          value={`${stats.monthlyGrowth}%`}
          change="+2.3%"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          title="Active Platforms"
          value={stats.activePlatforms}
          change="No change"
          changeType="neutral"
          icon={Users}
        />
        <StatCard
          title="Goal Progress"
          value={`${stats.goalProgress}%`}
          change="+5%"
          changeType="positive"
          icon={Target}
        />
      </div>

      {/* Revenue Chart */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-text-primary">Revenue Overview</h2>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm">Weekly</button>
            <button className="btn-primary text-sm">Monthly</button>
            <button className="btn-secondary text-sm">Yearly</button>
          </div>
        </div>
        <RevenueChart data={revenueData} />
      </div>

      {/* Platform Connections */}
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-4">Platform Connections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((platform) => {
            const Icon = platformIcons[platform.name] || Users
            return (
              <PlatformCard
                key={platform.id}
                name={platform.name}
                icon={Icon}
                connected={platform.connected}
                earnings={platform.earnings}
                color={platformColors[platform.name]}
                onConnect={() => console.log(`Connecting to ${platform.name}`)}
                onDisconnect={() => console.log(`Disconnecting from ${platform.name}`)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DashboardView