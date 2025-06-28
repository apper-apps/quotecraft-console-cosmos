import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import * as productService from '@/services/api/productService'
const LineItemRow = ({ 
  item, 
  onUpdate, 
  onDelete, 
  index,
  currency = 'THB'
}) => {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadProducts = async () => {
      if (searchTerm.length > 1) {
        setLoading(true)
        try {
          const data = await productService.getAll(searchTerm)
          setProducts(data)
        } catch (error) {
          console.error('Error loading products:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setProducts([])
      }
    }

    const timeoutId = setTimeout(loadProducts, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm])
const handleChange = (field, value) => {
    const updatedItem = { ...item, [field]: value }
    
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = parseFloat(field === 'quantity' ? value : updatedItem.quantity) || 0
      const unitPrice = parseFloat(field === 'unitPrice' ? value : updatedItem.unitPrice) || 0
      updatedItem.total = quantity * unitPrice
    }
    
    onUpdate(updatedItem)
  }

  const handleProductSelect = (product) => {
    const updatedItem = {
      ...item,
      description: product.product_name || product.Name,
      unitPrice: parseFloat(product.price) || 0,
      productId: product.Id
    }
    
    // Recalculate total
    const quantity = parseFloat(updatedItem.quantity) || 0
    const unitPrice = parseFloat(updatedItem.unitPrice) || 0
    updatedItem.total = quantity * unitPrice
    
    onUpdate(updatedItem)
    setShowDropdown(false)
    setSearchTerm('')
  }

  const handleDescriptionChange = (value) => {
    setSearchTerm(value)
    setShowDropdown(value.length > 1)
    handleChange('description', value)
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
      <td className="px-4 py-3 border-b border-surface-200 relative">
        <div className="relative">
          <Input
            value={item.description || ''}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Search products or enter description"
            className="text-sm"
            onFocus={() => setShowDropdown(searchTerm.length > 1)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />
          
          {/* Product Search Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 bg-white border border-surface-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
              {loading ? (
                <div className="p-3 text-center text-surface-500">
                  <ApperIcon name="Loader2" size={16} className="animate-spin mx-auto" />
                </div>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <button
                    key={product.Id}
                    onClick={() => handleProductSelect(product)}
                    className="w-full text-left p-3 hover:bg-surface-50 border-b border-surface-100 last:border-b-0 transition-colors"
                  >
                    <div className="font-medium text-sm text-gray-900">
                      {product.product_name || product.Name}
                    </div>
                    <div className="text-xs text-surface-600 truncate">
                      {product.description}
                    </div>
                    <div className="text-xs text-primary-600 font-medium">
                      {formatCurrency(product.price)}
                    </div>
                  </button>
                ))
              ) : searchTerm.length > 1 ? (
                <div className="p-3 text-center text-surface-500 text-sm">
                  No products found
                </div>
              ) : null}
            </div>
          )}
        </div>
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