import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No items found", 
  description = "Get started by creating your first item", 
  action,
  actionLabel = "Create New",
  icon = "FileText",
  type = "default"
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case 'quotations':
        return {
          icon: 'FileText',
          title: 'No quotations yet',
          description: 'Create your first professional quotation to get started with QuoteCraft Pro.'
        }
      case 'templates':
        return {
          icon: 'LayoutTemplate',
          title: 'No templates found',
          description: 'Create custom templates to streamline your quotation process and maintain consistent branding.'
        }
      case 'lineItems':
        return {
          icon: 'Package',
          title: 'No line items added',
          description: 'Add products or services to build your quotation. Each item can include quantity, price, and descriptions.'
        }
      case 'clients':
        return {
          icon: 'Users',
          title: 'No clients yet',
          description: 'Add client information to personalize your quotations and build your customer database.'
        }
      default:
        return { icon, title, description }
    }
  }

  const content = getEmptyContent()

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]"
    >
      <motion.div
        variants={itemVariants}
        className="relative mb-6"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-24 h-24 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden"
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ApperIcon 
              name={content.icon} 
              size={36} 
              className="text-secondary-500"
            />
          </motion.div>
          
          {/* Decorative elements */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-br from-secondary-200 to-transparent rounded-2xl"
          />
        </motion.div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="space-y-3 max-w-md"
      >
        <h3 className="text-2xl font-semibold text-gray-900 font-display">
          {content.title}
        </h3>
        <p className="text-surface-600 leading-relaxed text-lg">
          {content.description}
        </p>
      </motion.div>

      {action && (
        <motion.button
          variants={itemVariants}
          onClick={action}
          className="mt-8 btn-primary inline-flex items-center space-x-2 px-6 py-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ApperIcon name="Plus" size={18} />
          <span>{actionLabel}</span>
        </motion.button>
      )}

      {/* Floating decoration */}
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 right-1/4 w-8 h-8 bg-gradient-to-br from-accent-200 to-accent-300 rounded-lg opacity-20 hidden lg:block"
      />
      
      <motion.div
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-1/4 left-1/4 w-6 h-6 bg-gradient-to-br from-secondary-200 to-secondary-300 rounded-full opacity-20 hidden lg:block"
      />
    </motion.div>
  )
}

export default Empty