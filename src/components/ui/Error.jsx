import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message = "Something went wrong", onRetry, type = "general" }) => {
  const getErrorIcon = () => {
    switch (type) {
      case 'network':
        return 'WifiOff'
      case 'file':
        return 'FileX'
      case 'template':
        return 'LayoutTemplate'
      default:
        return 'AlertTriangle'
    }
  }

  const getErrorTitle = () => {
    switch (type) {
      case 'network':
        return 'Connection Error'
      case 'file':
        return 'File Error'
      case 'template':
        return 'Template Error'
      default:
        return 'Oops! Something went wrong'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="relative mb-6"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center">
          <ApperIcon 
            name={getErrorIcon()} 
            size={32} 
            className="text-accent-500"
          />
        </div>
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center"
        >
          <ApperIcon name="X" size={12} className="text-white" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-3 max-w-md"
      >
        <h3 className="text-xl font-semibold text-gray-900 font-display">
          {getErrorTitle()}
        </h3>
        <p className="text-surface-600 leading-relaxed">
          {message}
        </p>
      </motion.div>

      {onRetry && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={onRetry}
          className="mt-6 btn-primary inline-flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ApperIcon name="RefreshCw" size={16} />
          <span>Try Again</span>
        </motion.button>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-4 text-sm text-surface-500"
      >
        If the problem persists, please check your connection and try again.
      </motion.div>
    </motion.div>
  )
}

export default Error