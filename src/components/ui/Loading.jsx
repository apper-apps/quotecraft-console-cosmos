import React from 'react'
import { motion } from 'framer-motion'

const Loading = ({ type = 'quotation' }) => {
  const skeletonVariants = {
    pulse: {
      opacity: [0.4, 0.8, 0.4],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  if (type === 'template') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            className="card p-0"
            variants={skeletonVariants}
            animate="pulse"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="h-48 bg-gradient-to-br from-surface-200 to-surface-300 rounded-t-lg"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gradient-to-r from-surface-200 to-surface-300 rounded w-3/4"></div>
              <div className="h-3 bg-gradient-to-r from-surface-200 to-surface-300 rounded w-1/2"></div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6">
      {/* Header skeleton */}
      <motion.div
        className="card p-6"
        variants={skeletonVariants}
        animate="pulse"
      >
        <div className="space-y-4">
          <div className="h-6 bg-gradient-to-r from-surface-200 to-surface-300 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-surface-200 to-surface-300 rounded w-1/3"></div>
              <div className="h-10 bg-gradient-to-r from-surface-200 to-surface-300 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-surface-200 to-surface-300 rounded w-1/3"></div>
              <div className="h-10 bg-gradient-to-r from-surface-200 to-surface-300 rounded"></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Line items skeleton */}
      <motion.div
        className="card p-6"
        variants={skeletonVariants}
        animate="pulse"
        style={{ animationDelay: '0.2s' }}
      >
        <div className="space-y-4">
          <div className="h-6 bg-gradient-to-r from-surface-200 to-surface-300 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="grid grid-cols-4 gap-4">
                <div className="h-10 bg-gradient-to-r from-surface-200 to-surface-300 rounded"></div>
                <div className="h-10 bg-gradient-to-r from-surface-200 to-surface-300 rounded"></div>
                <div className="h-10 bg-gradient-to-r from-surface-200 to-surface-300 rounded"></div>
                <div className="h-10 bg-gradient-to-r from-surface-200 to-surface-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Preview skeleton */}
      <motion.div
        className="card p-6"
        variants={skeletonVariants}
        animate="pulse"
        style={{ animationDelay: '0.4s' }}
      >
        <div className="space-y-4">
          <div className="h-6 bg-gradient-to-r from-surface-200 to-surface-300 rounded w-1/4"></div>
          <div className="aspect-[210/297] bg-gradient-to-br from-surface-200 to-surface-300 rounded-lg"></div>
        </div>
      </motion.div>
    </div>
  )
}

export default Loading