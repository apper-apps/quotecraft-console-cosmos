import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import TemplateGrid from '@/components/organisms/TemplateGrid'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import * as templateService from '@/services/api/templateService'

const TemplateManager = () => {
  const [templates, setTemplates] = useState([])
  const [filteredTemplates, setFilteredTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const loadTemplates = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await templateService.getAll()
      setTemplates(data)
      setFilteredTemplates(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTemplates()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = templates.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredTemplates(filtered)
    } else {
      setFilteredTemplates(templates)
    }
  }, [searchQuery, templates])

  const handleCreateNew = () => {
    // Navigate to template creator or show modal
    toast.info('Template creator coming soon!')
  }

  const handleSelectTemplate = (template) => {
    // Navigate to quotation builder with template
    window.location.href = `/?template=${template.Id}`
  }

  const handleEditTemplate = (template) => {
    toast.info('Template editor coming soon!')
  }

  const handleDeleteTemplate = async (templateId) => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return
    }

    try {
await templateService.deleteTemplate(templateId)
      setTemplates(templates.filter(t => t.Id !== templateId))
      toast.success('Template deleted successfully!')
    } catch (err) {
      toast.error('Failed to delete template: ' + err.message)
    }
  }

  if (loading) {
    return <Loading type="template" />
  }

  if (error) {
    return (
      <Error
        message={error}
        onRetry={loadTemplates}
        type="template"
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Template Manager
          </h1>
          <p className="text-surface-600 mt-1">
            Create and manage quotation templates to streamline your workflow
          </p>
        </div>
        
        <Button
          variant="primary"
          icon="Plus"
          onClick={handleCreateNew}
          className="shrink-0"
        >
          Create Template
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="LayoutTemplate" size={24} className="text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600 font-display">
                {templates.length}
              </p>
              <p className="text-sm text-surface-600">Total Templates</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="FileText" size={24} className="text-secondary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-600 font-display">
                {templates.filter(t => t.isDefault).length}
              </p>
              <p className="text-sm text-surface-600">Default Templates</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-100 to-accent-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="Star" size={24} className="text-accent-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-accent-600 font-display">
                {templates.filter(t => t.featured).length}
              </p>
              <p className="text-sm text-surface-600">Featured Templates</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <SearchBar
            placeholder="Search templates..."
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            className="sm:w-80"
          />
          
          <div className="flex items-center space-x-2">
            <Button variant="secondary" size="sm" icon="Filter">
              Filter
            </Button>
            <Button variant="secondary" size="sm" icon="ArrowUpDown">
              Sort
            </Button>
          </div>
        </div>
      </Card>

      {/* Template Grid */}
      <TemplateGrid
        templates={filteredTemplates}
        onSelect={handleSelectTemplate}
        onEdit={handleEditTemplate}
        onDelete={handleDeleteTemplate}
        onCreateNew={handleCreateNew}
        loading={loading}
      />

      {/* Quick Actions */}
      <Card className="p-6 bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-primary-700 font-display">
              Need a custom template?
            </h3>
            <p className="text-surface-600">
              Create professional templates that match your brand and workflow
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="secondary" size="sm" icon="BookOpen">
              Template Guide
            </Button>
            <Button variant="primary" size="sm" icon="Zap">
              Quick Create
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default TemplateManager