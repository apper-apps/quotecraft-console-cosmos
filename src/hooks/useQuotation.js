import { useState, useEffect } from 'react'
import * as quotationService from '@/services/api/quotationService'

export const useQuotation = (quotationId = null) => {
  const [quotation, setQuotation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

const createEmptyQuotation = () => ({
    Id: Date.now(),
    templateId: null,
    client_name: '',
    client_address: '',
    quotation_number: `QT-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    header_text: JSON.stringify({
      companyName: '',
      companyAddress: '',
      logo: null
    }),
    footer_text: JSON.stringify({
      contactEmail: '',
      contactPhone: '',
      website: '',
      bankDetails: ''
    }),
    terms_and_conditions: '',
    subtotal: 0,
    tax: 0,
    total: 0,
    currency: 'THB',
    items: [],
    // Legacy fields for UI compatibility
    clientInfo: {
      name: '',
      company: '',
      address: '',
      email: '',
      phone: ''
    },
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
        
        // Convert database fields to UI format for compatibility
        const processedData = data ? {
          ...data,
          clientInfo: {
            name: data.client_name || '',
            company: '',
            address: data.client_address || '',
            email: '',
            phone: ''
          },
          header: data.header_text ? 
            (typeof data.header_text === 'string' ? 
              JSON.parse(data.header_text) : data.header_text) 
            : {
              companyName: '',
              companyAddress: '',
              quoteNumber: data.quotation_number || '',
              logo: null
            },
          footer: data.footer_text ? 
            (typeof data.footer_text === 'string' ? 
              JSON.parse(data.footer_text) : data.footer_text) 
            : {
              contactEmail: '',
              contactPhone: '',
              website: '',
              bankDetails: ''
            },
          terms: data.terms_and_conditions || '',
          validUntil: data.date || '',
          items: data.items || []
        } : null;
        
        setQuotation(processedData)
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