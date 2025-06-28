import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import QuotationEditor from '@/components/organisms/QuotationEditor'
import QuotationPreview from '@/components/organisms/QuotationPreview'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import * as quotationService from '@/services/api/quotationService'
import * as templateService from '@/services/api/templateService'

const QuotationBuilder = () => {
  const { id } = useParams()
  const [quotation, setQuotation] = useState(null)
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
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
    terms_and_conditions: `1. Payment is due within 30 days of invoice date.
2. All prices are in Thai Baht (THB) and include VAT.
3. This quotation is valid for 30 days from the date issued.
4. Additional charges may apply for changes to specifications.`,
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
    terms: `1. Payment is due within 30 days of invoice date.
2. All prices are in Thai Baht (THB) and include VAT.
3. This quotation is valid for 30 days from the date issued.
4. Additional charges may apply for changes to specifications.`,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [templatesData, quotationData] = await Promise.all([
        templateService.getAll(),
        id ? quotationService.getById(parseInt(id)) : Promise.resolve(null)
      ])
      
      setTemplates(templatesData)
const processedQuotation = quotationData ? {
        ...quotationData,
        // Convert database fields to UI format for compatibility
        clientInfo: {
          name: quotationData.client_name || '',
          company: '',
          address: quotationData.client_address || '',
          email: '',
          phone: ''
        },
        header: quotationData.header_text ? 
          (typeof quotationData.header_text === 'string' ? 
            JSON.parse(quotationData.header_text) : quotationData.header_text) 
          : {
            companyName: '',
            companyAddress: '',
            quoteNumber: quotationData.quotation_number || '',
            logo: null
          },
        footer: quotationData.footer_text ? 
          (typeof quotationData.footer_text === 'string' ? 
            JSON.parse(quotationData.footer_text) : quotationData.footer_text) 
          : {
            contactEmail: '',
            contactPhone: '',
            website: '',
            bankDetails: ''
          },
        terms: quotationData.terms_and_conditions || '',
        validUntil: quotationData.date || '',
        items: quotationData.items || []
      } : createEmptyQuotation();
      
      setQuotation(processedQuotation)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id])

  const handleQuotationUpdate = (updatedQuotation) => {
    setQuotation({
      ...updatedQuotation,
      updatedAt: new Date().toISOString()
    })
  }

  const handleSave = async () => {
    try {
      if (id) {
        await quotationService.update(parseInt(id), quotation)
        toast.success('Quotation saved successfully!')
      } else {
        await quotationService.create(quotation)
        toast.success('Quotation created successfully!')
      }
    } catch (err) {
      toast.error('Failed to save quotation: ' + err.message)
    }
  }

  const handleExport = async () => {
    try {
      // Simulate PDF generation
      toast.info('Generating PDF...')
      
      // Create a printable version
      const printWindow = window.open('', '_blank')
      const quotationHTML = generatePrintableHTML(quotation)
      
      printWindow.document.write(quotationHTML)
      printWindow.document.close()
      
      // Trigger print dialog
      setTimeout(() => {
        printWindow.print()
        toast.success('PDF ready for download!')
      }, 1000)
    } catch (err) {
      toast.error('Failed to export PDF: ' + err.message)
    }
  }

  const generatePrintableHTML = (quotation) => {
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

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Quotation - ${quotation.header?.quoteNumber}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap');
          
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 20mm;
            font-size: 12px;
            line-height: 1.5;
            color: #2C3E50;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #ECF0F1;
          }
          
          .company-info h1 {
            font-family: 'Poppins', sans-serif;
            font-size: 24px;
            color: #2C3E50;
            margin: 0 0 10px 0;
            font-weight: 700;
          }
          
          .quote-info {
            text-align: right;
          }
          
          .quote-info h2 {
            font-family: 'Poppins', sans-serif;
            font-size: 20px;
            margin: 0 0 15px 0;
            color: #2C3E50;
          }
          
          .client-section {
            margin: 30px 0;
            background: #F8F9FA;
            padding: 20px;
            border-radius: 8px;
          }
          
          .client-section h3 {
            font-family: 'Poppins', sans-serif;
            margin: 0 0 15px 0;
            color: #2C3E50;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          
          th, td {
            border: 1px solid #BDC3C7;
            padding: 10px;
            text-align: left;
          }
          
          th {
            background: #ECF0F1;
            font-weight: 600;
            color: #2C3E50;
          }
          
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          
          .totals {
            margin-top: 20px;
            float: right;
            width: 300px;
          }
          
          .totals table {
            margin: 0;
          }
          
          .totals .total-row {
            background: #E8F4FD;
            font-weight: 700;
            color: #2C3E50;
          }
          
          .terms {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ECF0F1;
          }
          
          .terms h3 {
            font-family: 'Poppins', sans-serif;
            color: #2C3E50;
          }
          
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ECF0F1;
            display: flex;
            justify-content: space-between;
          }
          
          .footer h4 {
            font-family: 'Poppins', sans-serif;
            color: #2C3E50;
            margin-bottom: 10px;
          }
          
          @media print {
            body { margin: 0; padding: 20mm; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-info">
            <h1>${quotation.header?.companyName || 'Your Company Name'}</h1>
            <div>${(quotation.header?.companyAddress || 'Company Address').replace(/\n/g, '<br>')}</div>
          </div>
          <div class="quote-info">
            <h2>QUOTATION</h2>
            <div><strong>Quote #:</strong> ${quotation.header?.quoteNumber || 'QT-2024-001'}</div>
            <div><strong>Date:</strong> ${formatDate(new Date().toISOString().split('T')[0])}</div>
            ${quotation.validUntil ? `<div><strong>Valid Until:</strong> ${formatDate(quotation.validUntil)}</div>` : ''}
          </div>
        </div>

        <div class="client-section">
          <h3>Bill To:</h3>
          <div><strong>${quotation.clientInfo?.name || 'Client Name'}</strong></div>
          ${quotation.clientInfo?.company ? `<div>${quotation.clientInfo.company}</div>` : ''}
          <div>${(quotation.clientInfo?.address || 'Client Address').replace(/\n/g, '<br>')}</div>
          ${quotation.clientInfo?.email ? `<div>Email: ${quotation.clientInfo.email}</div>` : ''}
          ${quotation.clientInfo?.phone ? `<div>Phone: ${quotation.clientInfo.phone}</div>` : ''}
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-center" width="80">Qty</th>
              <th class="text-right" width="120">Unit Price</th>
              <th class="text-right" width="120">Total</th>
            </tr>
          </thead>
          <tbody>
            ${quotation.items?.map(item => `
              <tr>
                <td>${item.description || 'Product/Service description'}</td>
                <td class="text-center">${item.quantity || 1}</td>
                <td class="text-right">${formatCurrency(item.unitPrice)}</td>
                <td class="text-right">${formatCurrency(item.total)}</td>
              </tr>
            `).join('') || '<tr><td colspan="4" class="text-center">No items added</td></tr>'}
          </tbody>
        </table>

        ${quotation.items?.length > 0 ? `
          <div class="totals">
            <table>
              <tr>
                <td>Subtotal:</td>
                <td class="text-right">${formatCurrency(quotation.subtotal)}</td>
              </tr>
              <tr>
                <td>VAT (7%):</td>
                <td class="text-right">${formatCurrency(quotation.tax)}</td>
              </tr>
              <tr class="total-row">
                <td><strong>Total:</strong></td>
                <td class="text-right"><strong>${formatCurrency(quotation.total)}</strong></td>
              </tr>
            </table>
          </div>
          <div style="clear: both;"></div>
        ` : ''}

        ${quotation.terms ? `
          <div class="terms">
            <h3>Terms & Conditions:</h3>
            <div>${quotation.terms.replace(/\n/g, '<br>')}</div>
          </div>
        ` : ''}

        <div class="footer">
          <div>
            <h4>Contact Information:</h4>
            ${quotation.footer?.contactEmail ? `<div>Email: ${quotation.footer.contactEmail}</div>` : ''}
            ${quotation.footer?.contactPhone ? `<div>Phone: ${quotation.footer.contactPhone}</div>` : ''}
            ${quotation.footer?.website ? `<div>Website: ${quotation.footer.website}</div>` : ''}
          </div>
          ${quotation.footer?.bankDetails ? `
            <div>
              <h4>Bank Details:</h4>
              <div>${quotation.footer.bankDetails.replace(/\n/g, '<br>')}</div>
            </div>
          ` : ''}
        </div>
      </body>
      </html>
    `
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <Error
        message={error}
        onRetry={loadData}
        type="general"
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-none"
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Editor Panel */}
        <div className="xl:col-span-2">
          <QuotationEditor
            quotation={quotation}
            onUpdate={handleQuotationUpdate}
            onSave={handleSave}
            onExport={handleExport}
            templates={templates}
          />
        </div>

        {/* Preview Panel */}
        <div className="xl:col-span-1">
          <QuotationPreview
            quotation={quotation}
            scale={0.75}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default QuotationBuilder