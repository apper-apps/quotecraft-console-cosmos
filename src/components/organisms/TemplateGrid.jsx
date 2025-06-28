import React from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import Empty from '@/components/ui/Empty'

const TemplateGrid = ({ 
  templates, 
  onSelect, 
  onEdit, 
  onDelete, 
  onCreateNew,
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <Card className="p-0">
              <div className="h-48 bg-gradient-to-br from-surface-200 to-surface-300"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                <div className="h-3 bg-surface-200 rounded w-1/2"></div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    )
  }

  if (!templates || templates.length === 0) {
    return (
      <Empty
        type="templates"
        action={onCreateNew}
        actionLabel="Create Template"
      />
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {templates.map((template) => (
        <motion.div
          key={template.Id}
          variants={itemVariants}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-0 overflow-hidden group cursor-pointer" hover>
            {/* Template Preview */}
            <div 
              className="h-48 bg-gradient-to-br from-surface-100 to-surface-200 relative overflow-hidden"
              onClick={() => onSelect(template)}
            >
              <div className="absolute inset-0 p-4 scale-75 origin-top-left">
                <div className="bg-white shadow-sm h-full rounded border">
                  <div className="p-2 space-y-2">
                    <div className="h-2 bg-primary-200 rounded w-1/2"></div>
                    <div className="h-1 bg-surface-200 rounded w-3/4"></div>
                    <div className="h-1 bg-surface-200 rounded w-2/3"></div>
                    <div className="mt-3 space-y-1">
                      <div className="h-1 bg-surface-300 rounded"></div>
                      <div className="h-1 bg-surface-300 rounded w-4/5"></div>
                      <div className="h-1 bg-surface-300 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button
                  variant="primary"
                  size="sm"
                  icon="Eye"
                  className="transform scale-90 group-hover:scale-100 transition-transform duration-200"
                >
                  Use Template
                </Button>
              </div>
            </div>

            {/* Template Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-surface-800 font-display">
                  {template.name}
                </h3>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Edit"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(template)
                    }}
                    className="text-surface-500 hover:text-primary-600"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Trash2"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(template.Id)
                    }}
                    className="text-surface-500 hover:text-accent-600"
                  />
                </div>
              </div>
              
              <p className="text-sm text-surface-600 mb-3">
                {template.description || 'Custom template for quotations'}
              </p>

              <div className="flex items-center justify-between text-xs text-surface-500">
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Calendar" size={12} />
                  <span>Created {new Date(template.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="FileText" size={12} />
                  <span>Template</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default TemplateGrid