import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  onClear,
  className = '',
  value = '',
  onChange
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleClear = () => {
    if (onChange) {
      onChange('')
    }
    if (onClear) {
      onClear()
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`relative ${className}`}
      animate={{ scale: isFocused ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ApperIcon 
            name="Search" 
            size={16} 
            className={`transition-colors duration-200 ${
              isFocused ? 'text-secondary-500' : 'text-surface-400'
            }`} 
          />
        </div>
        
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full pl-10 pr-10 py-2 border rounded-lg text-sm
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent
            ${isFocused ? 'border-secondary-300 bg-white' : 'border-surface-300 bg-surface-50'}
          `}
        />
        
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-surface-400 hover:text-surface-600 transition-colors duration-200"
          >
            <ApperIcon name="X" size={16} />
          </button>
        )}
      </div>
    </motion.form>
  )
}

export default SearchBar