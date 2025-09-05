import React from 'react'
import { ExternalLink, Unlink, Link } from 'lucide-react'

const PlatformCard = ({ 
  name, 
  icon: Icon, 
  connected, 
  earnings = 0, 
  onConnect, 
  onDisconnect,
  color = '#6B7280' 
}) => {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-md flex items-center justify-center"
            style={{ backgroundColor: `${color}20`, color }}
          >
            <Icon size={20} />
          </div>
          <div>
            <h3 className="font-medium text-text-primary">{name}</h3>
            <p className="text-sm text-text-secondary">
              {connected ? 'Connected' : 'Not connected'}
            </p>
          </div>
        </div>
        <button
          onClick={connected ? onDisconnect : onConnect}
          className={`
            p-2 rounded-md transition-colors
            ${connected 
              ? 'bg-red-500/10 hover:bg-red-500/20 text-red-500' 
              : 'bg-accent/10 hover:bg-accent/20 text-accent'
            }
          `}
        >
          {connected ? <Unlink size={16} /> : <Link size={16} />}
        </button>
      </div>
      
      {connected && (
        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">This month</span>
            <span className="font-semibold text-text-primary">
              ${earnings.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlatformCard