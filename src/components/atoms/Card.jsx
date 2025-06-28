import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  padding = 'default',
  shadow = 'default',
  border = true,
  hover = false,
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  }
  
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    default: 'shadow-card',
    lg: 'shadow-lg',
    document: 'shadow-document'
  }
  
  const baseClasses = `bg-white rounded-lg overflow-hidden transition-all duration-200 ${border ? 'border border-surface-200' : ''}`
  
  const Component = hover ? motion.div : 'div'
  const motionProps = hover ? {
    whileHover: { 
      scale: 1.02,
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
    },
    transition: { duration: 0.2 }
  } : {}

  return (
    <Component
      className={`${baseClasses} ${shadowClasses[shadow]} ${paddingClasses[padding]} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Card