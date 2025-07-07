import { toast } from 'react-toastify'

// Initialize ApperClient
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'dynamicattribute';

export const getAll = async () => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "attribute_name" } },
        { field: { Name: "data_type" } },
        { field: { Name: "attribute_value" } },
        { field: { Name: "product" } },
        { field: { Name: "Tags" } }
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
    console.error("Error fetching dynamic attributes:", error);
    throw error;
  }
};

export const getById = async (id) => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "attribute_name" } },
        { field: { Name: "data_type" } },
        { field: { Name: "attribute_value" } },
        { field: { Name: "product" } },
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
    console.error(`Error fetching dynamic attribute with ID ${id}:`, error);
    throw error;
  }
};

export const getByProductId = async (productId) => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "attribute_name" } },
        { field: { Name: "data_type" } },
        { field: { Name: "attribute_value" } },
        { field: { Name: "product" } },
        { field: { Name: "Tags" } }
      ],
      where: [
        {
          FieldName: "product",
          Operator: "EqualTo",
          Values: [parseInt(productId)]
        }
      ],
      orderBy: [
        { fieldName: "attribute_name", sorttype: "ASC" }
      ]
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching dynamic attributes for product ${productId}:`, error);
    return [];
  }
};

export const create = async (attributeData) => {
  try {
    const params = {
      records: [{
        // Only include Updateable fields
        Name: attributeData.Name || attributeData.attribute_name || '',
        attribute_name: attributeData.attribute_name || '',
        data_type: attributeData.data_type || 'Text',
        attribute_value: attributeData.attribute_value || '',
        product: parseInt(attributeData.product) || null,
        Tags: attributeData.Tags || ''
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
    console.error("Error creating dynamic attribute:", error);
    throw error;
  }
};

export const update = async (id, attributeData) => {
  try {
    const params = {
      records: [{
        Id: parseInt(id),
        // Only include Updateable fields
        Name: attributeData.Name || attributeData.attribute_name || '',
        attribute_name: attributeData.attribute_name || '',
        data_type: attributeData.data_type || 'Text',
        attribute_value: attributeData.attribute_value || '',
        product: parseInt(attributeData.product) || null,
        Tags: attributeData.Tags || ''
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
    console.error("Error updating dynamic attribute:", error);
    throw error;
  }
};

export const deleteAttribute = async (id) => {
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
    console.error("Error deleting dynamic attribute:", error);
    throw error;
  }
};