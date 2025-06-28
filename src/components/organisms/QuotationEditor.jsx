import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import LineItemRow from '@/components/molecules/LineItemRow'
import ToolbarButton from '@/components/molecules/ToolbarButton'
import ApperIcon from '@/components/ApperIcon'

const QuotationEditor = ({ 
  quotation, 
  onUpdate, 
  onExport,
  onSave,
  templates = []
}) => {
  const [activeSection, setActiveSection] = useState('client')

  const handleClientInfoChange = useCallback((field, value) => {
    onUpdate({
      ...quotation,
      clientInfo: {
        ...quotation.clientInfo,
        [field]: value
      }
    })
  }, [quotation, onUpdate])

  const handleHeaderChange = useCallback((field, value) => {
    onUpdate({
      ...quotation,
      header: {
        ...quotation.header,
        [field]: value
      }
    })
  }, [quotation, onUpdate])

  const handleFooterChange = useCallback((field, value) => {
    onUpdate({
      ...quotation,
      footer: {
        ...quotation.footer,
        [field]: value
      }
    })
  }, [quotation, onUpdate])

  const handleTermsChange = useCallback((value) => {
    onUpdate({
      ...quotation,
      terms: value
    })
  }, [quotation, onUpdate])

  const addLineItem = () => {
    const newItem = {
      Id: Math.max(...quotation.items.map(item => item.Id), 0) + 1,
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }
    onUpdate({
      ...quotation,
      items: [...quotation.items, newItem]
    })
  }

  const updateLineItem = (updatedItem) => {
    const updatedItems = quotation.items.map(item =>
      item.Id === updatedItem.Id ? updatedItem : item
    )
    
    const subtotal = updatedItems.reduce((sum, item) => sum + (item.total || 0), 0)
    const tax = subtotal * 0.07 // 7% VAT
    const total = subtotal + tax
    
    onUpdate({
      ...quotation,
      items: updatedItems,
      subtotal,
      tax,
      total
    })
  }

  const deleteLineItem = (itemId) => {
    const updatedItems = quotation.items.filter(item => item.Id !== itemId)
    const subtotal = updatedItems.reduce((sum, item) => sum + (item.total || 0), 0)
    const tax = subtotal * 0.07
    const total = subtotal + tax
    
    onUpdate({
      ...quotation,
      items: updatedItems,
      subtotal,
      tax,
      total
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: quotation.currency || 'THB',
      minimumFractionDigits: 2
    }).format(amount || 0)
  }

  const sections = [
    { id: 'client', label: 'Client Info', icon: 'User' },
    { id: 'header', label: 'Header', icon: 'Layout' },
    { id: 'items', label: 'Line Items', icon: 'Package' },
    { id: 'footer', label: 'Footer', icon: 'FileText' },
    { id: 'terms', label: 'Terms', icon: 'FileCheck' }
  ]

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {sections.map(section => (
              <ToolbarButton
                key={section.id}
                icon={section.icon}
                label={section.label}
                active={activeSection === section.id}
                onClick={() => setActiveSection(section.id)}
              />
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon="Save" onClick={onSave}>
              Save Draft
            </Button>
            <Button variant="primary" size="sm" icon="Download" onClick={onExport}>
              Export PDF
            </Button>
          </div>
        </div>
      </Card>

      {/* Content Sections */}
      <AnimatePresence mode="wait">
        {activeSection === 'client' && (
          <motion.div
            key="client"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="User" size={20} className="text-secondary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 font-display">Client Information</h3>
                  <p className="text-sm text-surface-600">Enter your client's details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Client Name"
                  name="name"
                  value={quotation.clientInfo?.name || ''}
                  onChange={handleClientInfoChange}
                  placeholder="John Doe"
                  required
                  icon="User"
                />
                
                <FormField
                  label="Company"
                  name="company"
                  value={quotation.clientInfo?.company || ''}
                  onChange={handleClientInfoChange}
                  placeholder="Company Ltd."
                  icon="Building"
                />
                
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={quotation.clientInfo?.email || ''}
                  onChange={handleClientInfoChange}
                  placeholder="john@example.com"
                  icon="Mail"
                />
                
                <FormField
                  label="Phone"
                  name="phone"
                  value={quotation.clientInfo?.phone || ''}
                  onChange={handleClientInfoChange}
                  placeholder="+66 12 345 6789"
                  icon="Phone"
                />
                
                <FormField
                  label="Address"
                  name="address"
                  type="textarea"
                  value={quotation.clientInfo?.address || ''}
                  onChange={handleClientInfoChange}
                  placeholder="123 Main Street, Bangkok, 10100"
                  rows={3}
                  containerClassName="md:col-span-2"
                />
              </div>
            </Card>
          </motion.div>
        )}

        {activeSection === 'header' && (
          <motion.div
            key="header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Layout" size={20} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 font-display">Header Section</h3>
                  <p className="text-sm text-surface-600">Customize your quotation header</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Company Name"
                  name="companyName"
                  value={quotation.header?.companyName || ''}
                  onChange={handleHeaderChange}
                  placeholder="Your Company Name"
                  required
                  icon="Building"
                />
                
                <FormField
                  label="Quote Number"
                  name="quoteNumber"
                  value={quotation.header?.quoteNumber || ''}
                  onChange={handleHeaderChange}
                  placeholder="QT-2024-001"
                  icon="Hash"
                />
                
                <FormField
                  label="Company Address"
                  name="companyAddress"
                  type="textarea"
                  value={quotation.header?.companyAddress || ''}
                  onChange={handleHeaderChange}
                  placeholder="123 Business Street, Bangkok, 10100"
                  rows={3}
                  containerClassName="md:col-span-2"
                />
                
                <FormField
                  label="Valid Until"
                  name="validUntil"
                  type="date"
                  value={quotation.validUntil || ''}
                  onChange={(name, value) => onUpdate({ ...quotation, [name]: value })}
                  icon="Calendar"
                />
              </div>
            </Card>
          </motion.div>
        )}

        {activeSection === 'items' && (
          <motion.div
            key="items"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent-100 to-accent-200 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Package" size={20} className="text-accent-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 font-display">Line Items</h3>
                    <p className="text-sm text-surface-600">Add products or services</p>
                  </div>
                </div>
                
                <Button
                  variant="primary"
                  size="sm"
                  icon="Plus"
                  onClick={addLineItem}
                >
                  Add Item
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-surface-200">
                      <th className="text-left px-4 py-3 font-semibold text-surface-700">Description</th>
                      <th className="text-center px-4 py-3 font-semibold text-surface-700 w-24">Qty</th>
                      <th className="text-right px-4 py-3 font-semibold text-surface-700 w-32">Unit Price</th>
                      <th className="text-right px-4 py-3 font-semibold text-surface-700 w-32">Total</th>
                      <th className="w-16 px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {quotation.items?.map((item, index) => (
                        <LineItemRow
                          key={item.Id}
                          item={item}
                          index={index}
                          onUpdate={updateLineItem}
                          onDelete={deleteLineItem}
                          currency={quotation.currency}
                        />
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {quotation.items?.length === 0 && (
                <div className="text-center py-12 text-surface-500">
                  <ApperIcon name="Package" size={48} className="mx-auto mb-4 text-surface-300" />
                  <p className="text-lg font-medium">No items added yet</p>
                  <p className="text-sm">Click "Add Item" to start building your quotation</p>
                </div>
              )}

              {/* Totals */}
              {quotation.items?.length > 0 && (
                <div className="border-t border-surface-200 mt-6 pt-6">
                  <div className="flex justify-end">
                    <div className="w-80 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-surface-600">Subtotal:</span>
                        <span className="font-medium">{formatCurrency(quotation.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-surface-600">VAT (7%):</span>
                        <span className="font-medium">{formatCurrency(quotation.tax)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold border-t border-surface-200 pt-2">
                        <span>Total:</span>
                        <span className="text-primary-600">{formatCurrency(quotation.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {activeSection === 'footer' && (
          <motion.div
            key="footer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-surface-100 to-surface-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="FileText" size={20} className="text-surface-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 font-display">Footer Section</h3>
                  <p className="text-sm text-surface-600">Add contact information and notes</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Contact Email"
                  name="contactEmail"
                  type="email"
                  value={quotation.footer?.contactEmail || ''}
                  onChange={handleFooterChange}
                  placeholder="info@company.com"
                  icon="Mail"
                />
                
                <FormField
                  label="Contact Phone"
                  name="contactPhone"
                  value={quotation.footer?.contactPhone || ''}
                  onChange={handleFooterChange}
                  placeholder="+66 12 345 6789"
                  icon="Phone"
                />
                
                <FormField
                  label="Website"
                  name="website"
                  value={quotation.footer?.website || ''}
                  onChange={handleFooterChange}
                  placeholder="www.company.com"
                  icon="Globe"
                />
                
                <FormField
                  label="Bank Details"
                  name="bankDetails"
                  type="textarea"
                  value={quotation.footer?.bankDetails || ''}
                  onChange={handleFooterChange}
                  placeholder="Bank: Bangkok Bank, Account: 123-4-56789-0"
                  rows={3}
                />
              </div>
            </Card>
          </motion.div>
        )}

        {activeSection === 'terms' && (
          <motion.div
            key="terms"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="FileCheck" size={20} className="text-secondary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 font-display">Terms & Conditions</h3>
                  <p className="text-sm text-surface-600">Add payment terms and conditions</p>
                </div>
              </div>

              <FormField
                label="Terms and Conditions"
                type="textarea"
                value={quotation.terms || ''}
                onChange={(name, value) => handleTermsChange(value)}
                placeholder="1. Payment is due within 30 days of invoice date.&#10;2. All prices are in Thai Baht (THB) and include VAT.&#10;3. This quotation is valid for 30 days from the date issued."
                rows={8}
              />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default QuotationEditor