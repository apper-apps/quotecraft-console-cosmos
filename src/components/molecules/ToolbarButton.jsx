import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const ToolbarButton = ({ 
  icon, 
  label, 
  onClick, 
  active = false, 
  disabled = false,
  variant = 'default',
  badge,
  ...props 
}) => {
  const variants = {
    default: active 
      ? 'bg-primary-50 text-primary-600 border-primary-200' 
      : 'text-surface-600 hover:text-primary-600 hover:bg-surface-50 border-transparent',
    accent: active
      ? 'bg-accent-50 text-accent-600 border-accent-200'
      : 'text-surface-600 hover:text-accent-600 hover:bg-accent-50 border-transparent'
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative inline-flex items-center justify-center px-3 py-2 border rounded-md text-sm font-medium
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
      `}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      <ApperIcon name={icon} size={16} />
      {label && <span className="ml-2 hidden sm:inline">{label}</span>}
      
      {badge && (
        <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </span>
      )}
    </motion.button>
  )
}

export default ToolbarButton