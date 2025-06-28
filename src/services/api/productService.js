import { toast } from 'react-toastify'

// Initialize ApperClient
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'product';

export const getAll = async (searchTerm = '') => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "product_name" } },
        { field: { Name: "description" } },
        { field: { Name: "price" } },
        { field: { Name: "Tags" } }
      ],
      orderBy: [
        { fieldName: "CreatedOn", sorttype: "DESC" }
      ]
    };

    // Add search filter if provided
    if (searchTerm) {
      params.whereGroups = [{
        operator: "OR",
        subGroups: [{
          operator: "OR",
          conditions: [
            {
              fieldName: "Name",
              operator: "Contains",
              values: [searchTerm],
              include: true
            },
            {
              fieldName: "product_name", 
              operator: "Contains",
              values: [searchTerm],
              include: true
            },
            {
              fieldName: "description",
              operator: "Contains", 
              values: [searchTerm],
              include: true
            }
          ]
        }]
      }];
    }
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getById = async (id) => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "product_name" } },
        { field: { Name: "description" } },
        { field: { Name: "price" } },
        { field: { Name: "Tags" } }
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
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

export const create = async (productData) => {
  try {
    const params = {
      records: [{
        // Only include Updateable fields
        Name: productData.Name || productData.sku || '',
        product_name: productData.product_name || productData.name || '',
        description: productData.description || '',
        price: parseFloat(productData.price) || 0,
        Tags: productData.Tags || ''
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
    console.error("Error creating product:", error);
    throw error;
  }
};

export const update = async (id, productData) => {
  try {
    const params = {
      records: [{
        Id: parseInt(id),
        // Only include Updateable fields
        Name: productData.Name || productData.sku || '',
        product_name: productData.product_name || productData.name || '',
        description: productData.description || '',
        price: parseFloat(productData.price) || 0,
        Tags: productData.Tags || ''
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
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
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
    console.error("Error deleting product:", error);
    throw error;
  }
};