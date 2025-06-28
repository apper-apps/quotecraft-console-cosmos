import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

const LineItemRow = ({ 
  item, 
  onUpdate, 
  onDelete, 
  index,
  currency = 'THB'
}) => {
  const handleChange = (field, value) => {
    const updatedItem = { ...item, [field]: value }
    
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = parseFloat(field === 'quantity' ? value : updatedItem.quantity) || 0
      const unitPrice = parseFloat(field === 'unitPrice' ? value : updatedItem.unitPrice) || 0
      updatedItem.total = quantity * unitPrice
    }
    
    onUpdate(updatedItem)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount || 0)
  }

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="hover:bg-surface-50 transition-colors duration-200"
    >
      <td className="px-4 py-3 border-b border-surface-200">
        <Input
          value={item.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Product or service description"
          className="text-sm"
        />
      </td>
      
      <td className="px-4 py-3 border-b border-surface-200 w-24">
        <Input
          type="number"
          value={item.quantity || ''}
          onChange={(e) => handleChange('quantity', e.target.value)}
          placeholder="1"
          min="0"
          step="1"
          className="text-sm text-center"
        />
      </td>
      
      <td className="px-4 py-3 border-b border-surface-200 w-32">
        <Input
          type="number"
          value={item.unitPrice || ''}
          onChange={(e) => handleChange('unitPrice', e.target.value)}
          placeholder="0.00"
          min="0"
          step="0.01"
          className="text-sm text-right"
        />
      </td>
      
      <td className="px-4 py-3 border-b border-surface-200 w-32 text-right">
        <span className="font-semibold text-primary-600">
          {formatCurrency(item.total)}
        </span>
      </td>
      
      <td className="px-4 py-3 border-b border-surface-200 w-16">
        <Button
          variant="ghost"
          size="sm"
          icon="Trash2"
          onClick={() => onDelete(item.Id)}
          className="text-accent-500 hover:text-accent-600 hover:bg-accent-50"
        />
      </td>
    </motion.tr>
  )
}

export default LineItemRow