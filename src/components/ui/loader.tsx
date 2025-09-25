"use client"

import React from 'react'
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { cn } from '@/lib/utils'

interface LoaderProps {
  size?: number
  className?: string
  text?: string
  showBackground?: boolean
}

export function Loader({ 
  size = 64, 
  className, 
  text = "Loading...", 
  showBackground = true 
}: LoaderProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-screen",
      showBackground && "relative overflow-hidden",
      className
    )}>
      {/* Animated Background */}
      {showBackground && (
        <div className="absolute inset-0 bg-gradient-to-br from-lime-50 via-lime-100 to-lime-200">
          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-lime-300/30 rounded-full animate-pulse blur-xl"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-lime-400/40 rounded-full animate-pulse blur-lg animation-delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-lime-500/20 rounded-full animate-pulse blur-md animation-delay-2000"></div>
          
          {/* Floating particles */}
          <div className="absolute inset-0">
            {[
              { left: 20, top: 30, duration: 2.5 },
              { left: 80, top: 20, duration: 3.0 },
              { left: 60, top: 70, duration: 2.8 },
              { left: 30, top: 80, duration: 3.2 },
              { left: 90, top: 60, duration: 2.7 },
              { left: 50, top: 40, duration: 3.1 }
            ].map((particle, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-lime-600/60 rounded-full animate-bounce"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${particle.duration}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Loader Content */}
      <div className="relative z-10 flex flex-col items-center space-y-4">
        {/* Big Infinite Spinner */}
        <div className="relative">
          <Spinner 
            variant="infinite" 
            size={size}
            className="text-lime-600"
          />
          
          {/* Glow effect */}
          <div 
            className="absolute inset-0 rounded-full blur-md opacity-30"
            style={{
              background: 'radial-gradient(circle, rgba(132, 204, 22, 0.3) 0%, transparent 70%)',
              transform: 'scale(1.5)'
            }}
          />
        </div>

        {/* Loading Text */}
        {text && (
          <div className="text-center">
            <p className="text-lg font-medium text-lime-700 animate-pulse">
              {text}
            </p>
            <div className="flex items-center justify-center space-x-1 mt-2">
              <div className="w-2 h-2 bg-lime-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-lime-600 rounded-full animate-bounce animation-delay-200"></div>
              <div className="w-2 h-2 bg-lime-600 rounded-full animate-bounce animation-delay-400"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Full screen loader variant
export function FullScreenLoader({ 
  size = 80, 
  text = "Loading...", 
  className 
}: Omit<LoaderProps, 'showBackground'>) {
  return (
    <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm">
      <Loader 
        size={size} 
        text={text} 
        showBackground={true}
        className={className}
      />
    </div>
  )
}

// Inline loader variant
export function InlineLoader({ 
  size = 32, 
  text, 
  className 
}: Omit<LoaderProps, 'showBackground'>) {
  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <div className="flex items-center space-x-3">
        <Spinner 
          variant="infinite" 
          size={size}
          className="text-lime-600"
        />
        {text && (
          <span className="text-lime-700 font-medium">
            {text}
          </span>
        )}
      </div>
    </div>
  )
}

// Button loader variant
export function ButtonLoader({ 
  size = 16, 
  className 
}: Omit<LoaderProps, 'text' | 'showBackground'>) {
  return (
    <Spinner 
      variant="infinite" 
      size={size}
      className={cn("text-current", className)}
    />
  )
}