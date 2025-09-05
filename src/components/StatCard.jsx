import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const StatCard = ({ title, value, change, changeType = 'neutral', icon: Icon, className = '' }) => {
  const getTrendIcon = () => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp size={16} className="text-green-500" />
      case 'negative':
        return <TrendingDown size={16} className="text-red-500" />
      default:
        return <Minus size={16} className="text-text-secondary" />
    }
  }

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-500'
      case 'negative':
        return 'text-red-500'
      default:
        return 'text-text-secondary'
    }
  }

  return (
    <div className={`stat-card ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
          <p className="text-2xl font-bold text-text-primary mb-2">{value}</p>
          {change && (
            <div className="flex items-center gap-1">
              {getTrendIcon()}
              <span className={`text-sm font-medium ${getChangeColor()}`}>
                {change}
              </span>
              <span className="text-xs text-text-secondary">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
            <Icon size={20} className="text-primary" />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard