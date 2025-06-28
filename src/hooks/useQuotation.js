import { useState, useEffect } from 'react'
import * as quotationService from '@/services/api/quotationService'

export const useQuotation = (quotationId = null) => {
  const [quotation, setQuotation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createEmptyQuotation = () => ({
    Id: Date.now(),
    templateId: null,
    clientInfo: {
      name: '',
      company: '',
      address: '',
      email: '',
      phone: ''
    },
    items: [],
    header: {
      companyName: '',
      companyAddress: '',
      quoteNumber: `QT-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      logo: null
    },
    footer: {
      contactEmail: '',
      contactPhone: '',
      website: '',
      bankDetails: ''
    },
    terms: '',
    subtotal: 0,
    tax: 0,
    total: 0,
    currency: 'THB',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const loadQuotation = async (id) => {
    try {
      setLoading(true)
      setError(null)
      
      if (id) {
        const data = await quotationService.getById(parseInt(id))
        setQuotation(data)
      } else {
        setQuotation(createEmptyQuotation())
      }
    } catch (err) {
      setError(err.message)
      setQuotation(createEmptyQuotation())
    } finally {
      setLoading(false)
    }
  }

  const updateQuotation = (updatedQuotation) => {
    setQuotation({
      ...updatedQuotation,
      updatedAt: new Date().toISOString()
    })
  }

  const saveQuotation = async () => {
    try {
      if (quotation.Id && quotation.Id !== Date.now()) {
        return await quotationService.update(quotation.Id, quotation)
      } else {
        return await quotationService.create(quotation)
      }
    } catch (err) {
      throw new Error('Failed to save quotation: ' + err.message)
    }
  }

  const calculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0)
    const tax = subtotal * 0.07 // 7% VAT
    const total = subtotal + tax
    
    return { subtotal, tax, total }
  }

  useEffect(() => {
    loadQuotation(quotationId)
  }, [quotationId])

  return {
    quotation,
    loading,
    error,
    updateQuotation,
    saveQuotation,
    calculateTotals,
    refresh: () => loadQuotation(quotationId)
  }
}