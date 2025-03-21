import React from 'react'

interface LogoProps {
  className?: string
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
        {/* Background circle with gradient */}
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2A3B8F" />
            <stop offset="100%" stopColor="#2C75D8" />
          </linearGradient>
          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7BA9FF" />
            <stop offset="100%" stopColor="#4C87E6" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Main circular background */}
        <circle cx="150" cy="150" r="130" fill="url(#bgGradient)" />
        {/* Outer ring (token/blockchain representation) */}
        <circle cx="150" cy="150" r="130" fill="none" stroke="#5F9AE6" strokeWidth="4" strokeDasharray="8 4" />
        {/* Light beam emanating from book (lumen means light) */}
        <path d="M150 80 L100 200 L200 200 Z" fill="url(#glowGradient)" opacity="0.7" filter="url(#glow)" />
        {/* Open book base */}
        <path d="M90 170 C90 155, 150 140, 150 140 C150 140, 210 155, 210 170 L210 190 C210 205, 150 220, 150 220 C150 220, 90 205, 90 190 Z" fill="#E0E5FF" />
        <path d="M150 140 L150 220" stroke="#2A3B8F" strokeWidth="3" />
        {/* Character silhouettes emerging from book (representing interactive narrative) */}
        <path d="M125 160 C125 130, 140 120, 150 130 C160 120, 175 130, 175 160" fill="none" stroke="#2C75D8" strokeWidth="3" />
        <circle cx="125" cy="130" r="8" fill="#7BA9FF" />
        <circle cx="175" cy="130" r="8" fill="#7BA9FF" />
        {/* Branch paths (representing branching narrative) */}
        <path d="M130 100 L115 70" stroke="#5F9AE6" strokeWidth="2" />
        <path d="M130 100 L145 70" stroke="#5F9AE6" strokeWidth="2" />
        <path d="M170 100 L155 70" stroke="#5F9AE6" strokeWidth="2" />
        <path d="M170 100 L185 70" stroke="#5F9AE6" strokeWidth="2" />
        {/* Nodes at end of branches (choices/decision points) */}
        <circle cx="115" cy="70" r="5" fill="#FFD700" />
        <circle cx="145" cy="70" r="5" fill="#FFD700" />
        <circle cx="155" cy="70" r="5" fill="#FFD700" />
        <circle cx="185" cy="70" r="5" fill="#FFD700" />
      </svg>
    </div>
  )
}

export default Logo 