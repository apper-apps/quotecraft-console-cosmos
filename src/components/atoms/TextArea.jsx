import React, { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const TextArea = forwardRef(({ 
  label, 
  error, 
  rows = 4,
  className = '',
  containerClassName = '',
  required = false,
  ...props 
}, ref) => {
  const baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 resize-vertical'
  const errorClasses = error ? 'border-accent-500 focus:ring-accent-500' : 'border-surface-300'

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-accent-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        rows={rows}
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-accent-500 flex items-center mt-1">
          <ApperIcon name="AlertCircle" size={14} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  )
})

TextArea.displayName = 'TextArea'

export default TextArea