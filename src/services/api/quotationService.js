import quotationsData from '@/services/mockData/quotations.json'

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage for demo
let quotations = [...quotationsData]

export const getAll = async () => {
  await delay(300)
  return quotations.map(quotation => ({ ...quotation }))
}

export const getById = async (id) => {
  await delay(200)
  const quotation = quotations.find(q => q.Id === id)
  if (!quotation) {
    throw new Error('Quotation not found')
  }
  return { ...quotation }
}

export const create = async (quotationData) => {
  await delay(400)
  
  const newQuotation = {
    ...quotationData,
    Id: Math.max(...quotations.map(q => q.Id), 0) + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  quotations.push(newQuotation)
  return { ...newQuotation }
}

export const update = async (id, quotationData) => {
  await delay(350)
  
  const index = quotations.findIndex(q => q.Id === id)
  if (index === -1) {
    throw new Error('Quotation not found')
  }
  
  quotations[index] = {
    ...quotationData,
    Id: id,
    updatedAt: new Date().toISOString()
  }
  
  return { ...quotations[index] }
}

export const deleteQuotation = async (id) => {
  await delay(300)
  
  const index = quotations.findIndex(q => q.Id === id)
  if (index === -1) {
    throw new Error('Quotation not found')
  }
  
  quotations.splice(index, 1)
  return true
}