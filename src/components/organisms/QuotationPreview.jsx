import React from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const QuotationPreview = ({ quotation, scale = 0.8 }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: quotation.currency || 'THB',
      minimumFractionDigits: 2
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString))
  }

  return (
    <div className="sticky top-6">
      <Card className="p-0 document-preview">
        <div className="bg-surface-50 px-4 py-3 border-b border-surface-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Eye" size={16} className="text-surface-500" />
            <span className="text-sm font-medium text-surface-700">Live Preview</span>
          </div>
          <div className="text-xs text-surface-500">A4 Document</div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="aspect-[210/297] overflow-hidden"
          style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
        >
          <div className="w-full h-full bg-white p-8 text-sm overflow-y-auto">
            {/* Header Section */}
            <div className="mb-8 border-b border-surface-200 pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-primary-600 font-display mb-2">
                    {quotation.header?.companyName || 'Your Company Name'}
                  </h1>
                  <div className="text-surface-600 whitespace-pre-line">
                    {quotation.header?.companyAddress || 'Company Address'}
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-semibold text-surface-800 font-display">QUOTATION</h2>
                  <div className="mt-2 space-y-1">
                    <div><strong>Quote #:</strong> {quotation.header?.quoteNumber || 'QT-2024-001'}</div>
                    <div><strong>Date:</strong> {formatDate(new Date().toISOString().split('T')[0])}</div>
                    {quotation.validUntil && (
                      <div><strong>Valid Until:</strong> {formatDate(quotation.validUntil)}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-surface-800 mb-3 font-display">Bill To:</h3>
              <div className="bg-surface-50 p-4 rounded">
                <div className="font-semibold">{quotation.clientInfo?.name || 'Client Name'}</div>
                {quotation.clientInfo?.company && (
                  <div className="text-surface-600">{quotation.clientInfo.company}</div>
                )}
                <div className="text-surface-600 whitespace-pre-line mt-1">
                  {quotation.clientInfo?.address || 'Client Address'}
                </div>
                <div className="mt-2 space-y-1">
                  {quotation.clientInfo?.email && (
                    <div className="text-surface-600">Email: {quotation.clientInfo.email}</div>
                  )}
                  {quotation.clientInfo?.phone && (
                    <div className="text-surface-600">Phone: {quotation.clientInfo.phone}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-surface-100">
                    <th className="border border-surface-300 px-3 py-2 text-left font-semibold">Description</th>
                    <th className="border border-surface-300 px-3 py-2 text-center font-semibold w-16">Qty</th>
                    <th className="border border-surface-300 px-3 py-2 text-right font-semibold w-24">Unit Price</th>
                    <th className="border border-surface-300 px-3 py-2 text-right font-semibold w-24">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {quotation.items?.length > 0 ? (
                    quotation.items.map((item, index) => (
                      <tr key={item.Id || index}>
                        <td className="border border-surface-300 px-3 py-2">
                          {item.description || 'Product/Service description'}
                        </td>
                        <td className="border border-surface-300 px-3 py-2 text-center">
                          {item.quantity || 1}
                        </td>
                        <td className="border border-surface-300 px-3 py-2 text-right">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="border border-surface-300 px-3 py-2 text-right font-semibold">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="border border-surface-300 px-3 py-8 text-center text-surface-500">
                        No items added yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Totals */}
              {quotation.items?.length > 0 && (
                <div className="mt-4 flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between py-1">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(quotation.subtotal)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>VAT (7%):</span>
                      <span>{formatCurrency(quotation.tax)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-t border-surface-300 font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-primary-600">{formatCurrency(quotation.total)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Terms & Conditions */}
            {quotation.terms && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-surface-800 mb-3 font-display">Terms & Conditions:</h3>
                <div className="text-surface-600 whitespace-pre-line bg-surface-50 p-4 rounded">
                  {quotation.terms}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-surface-200 pt-6 mt-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Contact Information:</h4>
                  <div className="space-y-1 text-surface-600">
                    {quotation.footer?.contactEmail && (
                      <div>Email: {quotation.footer.contactEmail}</div>
                    )}
                    {quotation.footer?.contactPhone && (
                      <div>Phone: {quotation.footer.contactPhone}</div>
                    )}
                    {quotation.footer?.website && (
                      <div>Website: {quotation.footer.website}</div>
                    )}
                  </div>
                </div>
                
                {quotation.footer?.bankDetails && (
                  <div>
                    <h4 className="font-semibold mb-2">Bank Details:</h4>
                    <div className="text-surface-600 whitespace-pre-line">
                      {quotation.footer.bankDetails}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </Card>
    </div>
  )
}

export default QuotationPreview