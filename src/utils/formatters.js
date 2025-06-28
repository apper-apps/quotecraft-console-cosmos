export const formatCurrency = (amount, currency = 'THB') => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount || 0)
}

export const formatDate = (dateString, locale = 'th-TH') => {
  if (!dateString) return ''
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(dateString))
}

export const formatDateTime = (dateString, locale = 'th-TH') => {
  if (!dateString) return ''
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

export const formatNumber = (number, decimals = 2) => {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number || 0)
}

export const formatPercentage = (value, decimals = 1) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format((value || 0) / 100)
}

export const parseNumber = (value) => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^\d.-]/g, '')
    return parseFloat(cleaned) || 0
  }
  return 0
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const truncateText = (text, maxLength = 100) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const generateQuoteNumber = (prefix = 'QT') => {
  const year = new Date().getFullYear()
  const timestamp = Date.now().toString().slice(-6)
  return `${prefix}-${year}-${timestamp}`
}

export const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '')
  
  // Thai phone number format
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 9)}`
  }
  
  // International format
  if (cleaned.length === 11 && cleaned.startsWith('66')) {
    return `+66 ${cleaned.slice(2, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 11)}`
  }
  
  return phone
}