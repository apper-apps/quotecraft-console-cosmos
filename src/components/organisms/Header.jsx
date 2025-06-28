import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Header = () => {
  const location = useLocation()

  const navigation = [
    { name: 'Quotation Builder', href: '/', icon: 'FileText' },
    { name: 'Templates', href: '/templates', icon: 'LayoutTemplate' }
  ]

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-surface-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm"
            >
              <ApperIcon name="FileText" size={20} className="text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent font-display">
                QuoteCraft Pro
              </h1>
              <p className="text-xs text-surface-500 font-medium">
                Professional Quotation Builder
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href === '/' && location.pathname.startsWith('/quotation'))
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    flex items-center space-x-2 group
                    ${isActive 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-surface-600 hover:text-primary-600 hover:bg-surface-50'
                    }
                  `}
                >
                  <ApperIcon name={item.icon} size={16} />
                  <span>{item.name}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-primary-100 rounded-lg -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              size="sm"
              icon="Save"
              className="hidden sm:inline-flex"
            >
              Save Draft
            </Button>
            
            <Button
              variant="primary"
              size="sm"
              icon="Download"
              className="hidden sm:inline-flex"
            >
              Export PDF
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              icon="Menu"
              className="md:hidden"
            />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-surface-200 bg-surface-50">
        <div className="px-4 py-2">
          <div className="flex space-x-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href === '/' && location.pathname.startsWith('/quotation'))
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                    flex items-center justify-center space-x-2
                    ${isActive 
                      ? 'text-primary-600 bg-white shadow-sm' 
                      : 'text-surface-600 hover:text-primary-600 hover:bg-white/50'
                    }
                  `}
                >
                  <ApperIcon name={item.icon} size={16} />
                  <span className="text-xs">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header