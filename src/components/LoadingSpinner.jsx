import React from 'react'
import { Loader2 } from 'lucide-react'
import clsx from 'clsx'

const LoadingSpinner = ({ 
  size = 'md', 
  className = '', 
  text = '',
  color = 'primary' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const colorClasses = {
    primary: 'text-primary',
    accent: 'text-accent',
    white: 'text-white',
    gray: 'text-text-secondary'
  }

  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 
          className={clsx(
            'animate-spin',
            sizeClasses[size],
            colorClasses[color]
          )} 
        />
        {text && (
          <p className="text-sm text-text-secondary animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  )
}

export default LoadingSpinner
