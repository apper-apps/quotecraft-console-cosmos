export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone) => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '')
  
  // Check Thai phone number formats
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return true
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('66')) {
    return true
  }
  
  return false
}

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0
}

export const validateMinLength = (value, minLength) => {
  return value && value.toString().length >= minLength
}

export const validateMaxLength = (value, maxLength) => {
  return !value || value.toString().length <= maxLength
}

export const validateNumber = (value, min = null, max = null) => {
  const number = parseFloat(value)
  
  if (isNaN(number)) return false
  if (min !== null && number < min) return false
  if (max !== null && number > max) return false
  
  return true
}

export const validateDate = (dateString) => {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date)
}

export const validateUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const validateQuotation = (quotation) => {
  const errors = {}
  
  // Client info validation
  if (!validateRequired(quotation.clientInfo?.name)) {
    errors.clientName = 'Client name is required'
  }
  
  if (quotation.clientInfo?.email && !validateEmail(quotation.clientInfo.email)) {
    errors.clientEmail = 'Invalid email format'
  }
  
  if (quotation.clientInfo?.phone && !validatePhone(quotation.clientInfo.phone)) {
    errors.clientPhone = 'Invalid phone number format'
  }
  
  // Header validation
  if (!validateRequired(quotation.header?.companyName)) {
    errors.companyName = 'Company name is required'
  }
  
  if (!validateRequired(quotation.header?.quoteNumber)) {
    errors.quoteNumber = 'Quote number is required'
  }
  
  // Items validation
  if (!quotation.items || quotation.items.length === 0) {
    errors.items = 'At least one line item is required'
  } else {
    quotation.items.forEach((item, index) => {
      if (!validateRequired(item.description)) {
        errors[`item_${index}_description`] = 'Description is required'
      }
      
      if (!validateNumber(item.quantity, 0)) {
        errors[`item_${index}_quantity`] = 'Valid quantity is required'
      }
      
      if (!validateNumber(item.unitPrice, 0)) {
        errors[`item_${index}_unitPrice`] = 'Valid unit price is required'
      }
    })
  }
  
  // Date validation
  if (quotation.validUntil && !validateDate(quotation.validUntil)) {
    errors.validUntil = 'Invalid date format'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const validateLineItem = (item) => {
  const errors = {}
  
  if (!validateRequired(item.description)) {
    errors.description = 'Description is required'
  }
  
  if (!validateNumber(item.quantity, 0.01)) {
    errors.quantity = 'Quantity must be greater than 0'
  }
  
  if (!validateNumber(item.unitPrice, 0)) {
    errors.unitPrice = 'Unit price must be 0 or greater'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const validateTemplate = (template) => {
  const errors = {}
  
  if (!validateRequired(template.name)) {
    errors.name = 'Template name is required'
  }
  
  if (!validateMinLength(template.name, 2)) {
    errors.name = 'Template name must be at least 2 characters'
  }
  
  if (!validateMaxLength(template.name, 100)) {
    errors.name = 'Template name must be less than 100 characters'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}