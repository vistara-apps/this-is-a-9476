import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, DollarSign, Clock, Zap } from 'lucide-react'
import StatCard from './StatCard'
import { mockData } from '../data/mockData'

const InsightsView = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const { platformBreakdown, performanceMetrics, topContent } = mockData.insights

  const pieColors = ['hsl(210 70% 50%)', 'hsl(160 60% 45%)', 'hsl(280 60% 50%)', 'hsl(45 90% 55%)', 'hsl(340 75% 55%)']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Performance Insights</h1>
          <p className="text-text-secondary">Understand which content and platforms generate the most revenue</p>
        </div>
        <select 
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary"
        >
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
          <option value="quarter">Last 90 days</option>
          <option value="year">Last year</option>
        </select>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Revenue per Hour"
          value={`$${performanceMetrics.revenuePerHour}`}
          change="+8.2%"
          changeType="positive"
          icon={Clock}
        />
        <StatCard
          title="Top Platform"
          value={performanceMetrics.topPlatform}
          change="+15.3%"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          title="Best Content Type"
          value={performanceMetrics.bestContentType}
          change="+22.1%"
          changeType="positive"
          icon={Zap}
        />
        <StatCard
          title="Avg. Daily Earnings"
          value={`$${performanceMetrics.avgDailyEarnings}`}
          change="+5.7%"
          changeType="positive"
          icon={DollarSign}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Revenue Breakdown */}
        <div className="card">
          <h2 className="text-xl font-bold text-text-primary mb-6">Revenue by Platform</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 20%)" />
              <XAxis 
                dataKey="platform" 
                stroke="hsl(220 15% 65%)"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(220 15% 65%)"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(220 20% 12%)',
                  border: '1px solid hsl(220 20% 20%)',
                  borderRadius: '8px',
                  color: 'hsl(220 15% 95%)'
                }}
                formatter={(value) => [`$${value}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="hsl(210 70% 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Distribution Pie Chart */}
        <div className="card">
          <h2 className="text-xl font-bold text-text-primary mb-6">Revenue Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={platformBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="revenue"
              >
                {platformBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(220 20% 12%)',
                  border: '1px solid hsl(220 20% 20%)',
                  borderRadius: '8px',
                  color: 'hsl(220 15% 95%)'
                }}
                formatter={(value) => [`$${value}`, 'Revenue']}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 justify-center">
            {platformBreakdown.map((entry, index) => (
              <div key={entry.platform} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: pieColors[index % pieColors.length] }}
                />
                <span className="text-sm text-text-secondary">{entry.platform}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Content */}
      <div className="card">
        <h2 className="text-xl font-bold text-text-primary mb-6">Top Performing Content</h2>
        <div className="space-y-4">
          {topContent.map((content, index) => (
            <div key={content.id} className="flex items-center justify-between p-4 bg-bg rounded-md border border-border">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">{content.title}</h3>
                  <p className="text-sm text-text-secondary">{content.platform} • {content.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-text-primary">${content.revenue}</p>
                <p className="text-sm text-text-secondary">{content.views} views</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InsightsView