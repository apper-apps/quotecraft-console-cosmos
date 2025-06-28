import { toast } from 'react-toastify'

// Initialize ApperClient
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'quotation';

export const getAll = async () => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "client_name" } },
        { field: { Name: "client_address" } },
        { field: { Name: "quotation_number" } },
        { field: { Name: "date" } },
        { field: { Name: "header_text" } },
        { field: { Name: "footer_text" } },
        { field: { Name: "terms_and_conditions" } },
        { field: { Name: "subtotal" } },
        { field: { Name: "tax" } },
        { field: { Name: "total" } }
      ],
      orderBy: [
        { fieldName: "CreatedOn", sorttype: "DESC" }
      ]
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching quotations:", error);
    throw error;
  }
};

export const getById = async (id) => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "client_name" } },
        { field: { Name: "client_address" } },
        { field: { Name: "quotation_number" } },
        { field: { Name: "date" } },
        { field: { Name: "header_text" } },
        { field: { Name: "footer_text" } },
        { field: { Name: "terms_and_conditions" } },
        { field: { Name: "subtotal" } },
        { field: { Name: "tax" } },
        { field: { Name: "total" } }
      ]
    };
    
    const response = await apperClient.getRecordById(tableName, parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching quotation with ID ${id}:`, error);
    throw error;
  }
};

export const create = async (quotationData) => {
  try {
    const params = {
      records: [{
        Name: quotationData.Name || `Quotation ${quotationData.quotation_number}`,
        Tags: quotationData.Tags || '',
        client_name: quotationData.clientInfo?.name || '',
        client_address: quotationData.clientInfo?.address || '',
        quotation_number: quotationData.header?.quoteNumber || '',
        date: quotationData.validUntil || new Date().toISOString().split('T')[0],
        header_text: JSON.stringify(quotationData.header) || '',
        footer_text: JSON.stringify(quotationData.footer) || '',
        terms_and_conditions: quotationData.terms || '',
        subtotal: quotationData.subtotal || 0,
        tax: quotationData.tax || 0,
        total: quotationData.total || 0
      }]
    };
    
    const response = await apperClient.createRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      return successfulRecords.length > 0 ? successfulRecords[0].data : null;
    }
  } catch (error) {
    console.error("Error creating quotation:", error);
    throw error;
  }
};

export const update = async (id, quotationData) => {
  try {
    const params = {
      records: [{
        Id: parseInt(id),
        Name: quotationData.Name || `Quotation ${quotationData.quotation_number}`,
        Tags: quotationData.Tags || '',
        client_name: quotationData.clientInfo?.name || '',
        client_address: quotationData.clientInfo?.address || '',
        quotation_number: quotationData.header?.quoteNumber || '',
        date: quotationData.validUntil || new Date().toISOString().split('T')[0],
        header_text: JSON.stringify(quotationData.header) || '',
        footer_text: JSON.stringify(quotationData.footer) || '',
        terms_and_conditions: quotationData.terms || '',
        subtotal: quotationData.subtotal || 0,
        tax: quotationData.tax || 0,
        total: quotationData.total || 0
      }]
    };
    
    const response = await apperClient.updateRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
    }
  } catch (error) {
    console.error("Error updating quotation:", error);
    throw error;
  }
};

export const deleteQuotation = async (id) => {
  try {
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        failedDeletions.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      return successfulDeletions.length > 0;
    }
  } catch (error) {
    console.error("Error deleting quotation:", error);
    throw error;
  }
};