import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import TextArea from '@/components/atoms/TextArea'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import * as productService from '@/services/api/productService'

const ProductManager = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    Name: '',
    product_name: '',
    description: '',
    price: '',
    Tags: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productService.getAll(searchTerm)
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [searchTerm])

  const handleSearch = (value) => {
    setSearchTerm(value)
  }

  const handleAddNew = () => {
    setEditingProduct(null)
    setFormData({
      Name: '',
      product_name: '',
      description: '',
      price: '',
      Tags: ''
    })
    setShowModal(true)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      Name: product.Name || '',
      product_name: product.product_name || '',
      description: product.description || '',
      price: product.price || '',
      Tags: product.Tags || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (product) => {
    if (!confirm(`Are you sure you want to delete "${product.product_name || product.Name}"?`)) {
      return
    }

    try {
      await productService.deleteProduct(product.Id)
      toast.success('Product deleted successfully!')
      loadProducts()
    } catch (err) {
      toast.error('Failed to delete product: ' + err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingProduct) {
        await productService.update(editingProduct.Id, formData)
        toast.success('Product updated successfully!')
      } else {
        await productService.create(formData)
        toast.success('Product created successfully!')
      }
      
      setShowModal(false)
      loadProducts()
    } catch (err) {
      toast.error('Failed to save product: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 2
    }).format(amount || 0)
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <Error
        message={error}
        onRetry={loadProducts}
        type="general"
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
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-sm text-surface-600">Manage your product inventory</p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={handleAddNew}
        >
          Add Product
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <SearchBar
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search products by name, description..."
        />
      </Card>

      {/* Products Table */}
      <Card>
        {products.length === 0 ? (
          <Empty
            icon="Package"
            title="No products found"
            description={searchTerm ? "No products match your search criteria" : "Get started by adding your first product"}
            action={
              !searchTerm && (
                <Button variant="primary" icon="Plus" onClick={handleAddNew}>
                  Add Product
                </Button>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-surface-200">
                  <th className="text-left px-6 py-4 font-semibold text-surface-700">SKU</th>
                  <th className="text-left px-6 py-4 font-semibold text-surface-700">Product Name</th>
                  <th className="text-left px-6 py-4 font-semibold text-surface-700">Description</th>
                  <th className="text-right px-6 py-4 font-semibold text-surface-700">Price</th>
                  <th className="text-center px-6 py-4 font-semibold text-surface-700 w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <motion.tr
                    key={product.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="hover:bg-surface-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 border-b border-surface-200">
                      <span className="font-mono text-sm text-surface-600">
                        {product.Name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-surface-200">
                      <span className="font-medium text-gray-900">
                        {product.product_name || 'Unnamed Product'}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-surface-200">
                      <span className="text-surface-600 text-sm line-clamp-2">
                        {product.description || 'No description'}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-surface-200 text-right">
                      <span className="font-semibold text-primary-600">
                        {formatCurrency(product.price)}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-surface-200">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Edit"
                          onClick={() => handleEdit(product)}
                          className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          onClick={() => handleDelete(product)}
                          className="text-accent-500 hover:text-accent-600 hover:bg-accent-50"
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={() => setShowModal(false)}
                />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU *
                  </label>
                  <Input
                    value={formData.Name}
                    onChange={(e) => handleInputChange('Name', e.target.value)}
                    placeholder="Enter product SKU"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <Input
                    value={formData.product_name}
                    onChange={(e) => handleInputChange('product_name', e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <TextArea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter product description"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <Input
                    value={formData.Tags}
                    onChange={(e) => handleInputChange('Tags', e.target.value)}
                    placeholder="Enter tags (comma separated)"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-surface-200">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowModal(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={submitting}
                    icon={editingProduct ? "Save" : "Plus"}
                  >
                    {editingProduct ? 'Update' : 'Create'} Product
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default ProductManager