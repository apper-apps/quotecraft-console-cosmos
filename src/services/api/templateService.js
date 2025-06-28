import templatesData from "@/services/mockData/templates.json";
import React from "react";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage for demo
let templates = [...templatesData]

export const getAll = async () => {
  await delay(250)
  return templates.map(template => ({ ...template }))
}

export const getById = async (id) => {
  await delay(200)
  const template = templates.find(t => t.Id === id)
  if (!template) {
    throw new Error('Template not found')
  }
  return { ...template }
}

export const create = async (templateData) => {
  await delay(400)
  
  const newTemplate = {
    ...templateData,
    Id: Math.max(...templates.map(t => t.Id), 0) + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  templates.push(newTemplate)
  return { ...newTemplate }
}

export const update = async (id, templateData) => {
  await delay(350)
  
  const index = templates.findIndex(t => t.Id === id)
  if (index === -1) {
    throw new Error('Template not found')
  }
  
  templates[index] = {
    ...templateData,
    Id: id,
    updatedAt: new Date().toISOString()
  }
  
  return { ...templates[index] }
}

export const deleteTemplate = async (id) => {
  await delay(300)
  
  const index = templates.findIndex(t => t.Id === id)
  if (index === -1) {
    throw new Error('Template not found')
  }
  
  templates.splice(index, 1)
  return true
}