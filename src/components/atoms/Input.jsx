import React, { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = forwardRef(({ 
  label, 
  error, 
  icon, 
  iconPosition = 'left',
  type = 'text',
  className = '',
  containerClassName = '',
  required = false,
  ...props 
}, ref) => {
  const baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200'
  const errorClasses = error ? 'border-accent-500 focus:ring-accent-500' : 'border-surface-300'
  const iconClasses = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-accent-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} size={16} className="text-surface-400" />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={`${baseClasses} ${errorClasses} ${iconClasses} ${className}`}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} size={16} className="text-surface-400" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-accent-500 flex items-center mt-1">
          <ApperIcon name="AlertCircle" size={14} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input