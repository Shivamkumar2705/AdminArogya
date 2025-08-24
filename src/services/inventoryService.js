import API from './api';

const InventoryService = {
  // Process inventory update file
  processInventoryUpdate: async (file) => {
    try {
      const formData = new FormData();
      formData.append('inventoryFile', file);

      const response = await API.post('/inventory/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Download inventory template
  downloadTemplate: async () => {
    try {
      const response = await API.get('/inventory/template', {
        responseType: 'blob', // Important for file download
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'inventory_template.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return { success: true };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get inventory update history
  getInventoryUpdates: async (page = 1, limit = 10) => {
    try {
      const response = await API.get('/inventory/updates', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get inventory update details
  getInventoryUpdateDetails: async (updateId) => {
    try {
      const response = await API.get(`/inventory/updates/${updateId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default InventoryService;
