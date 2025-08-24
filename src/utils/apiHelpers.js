/**
 * Utility functions for safely handling API responses
 */

/**
 * Safely extracts data from API response, handling both nested and direct response structures
 * @param {Object} response - The API response object
 * @param {string} [dataKey='data'] - The key to extract data from (defaults to 'data')
 * @returns {Array} - The extracted data array, or empty array if not found
 */
export const safeExtractData = (response, dataKey = 'data') => {
  try {
    // Handle case where response is null/undefined
    if (!response) return [];
    
    // Handle case where response.data is null/undefined
    if (!response.data) return [];
    
    // Check if response.data has the expected nested structure
    if (response.data && response.data[dataKey] && Array.isArray(response.data[dataKey])) {
      return response.data[dataKey];
    }
    
    // Check if response.data is directly an array
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // Check if response.data is an object with a data property that's an array
    if (response.data && typeof response.data === 'object' && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    // Fallback: return empty array
    console.warn('Unexpected API response structure:', response);
    return [];
  } catch (error) {
    console.error('Error extracting data from API response:', error);
    return [];
  }
};

/**
 * Ensures a value is always an array
 * @param {any} value - The value to ensure is an array
 * @returns {Array} - The value as an array, or empty array if conversion not possible
 */
export const ensureArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  if (typeof value === 'object') {
    // Try to convert object to array if it has numeric keys
    const keys = Object.keys(value);
    if (keys.length > 0 && keys.every(key => !isNaN(key))) {
      return Object.values(value);
    }
  }
  return [];
};

/**
 * Safely maps over an array with error handling
 * @param {Array} array - The array to map over
 * @param {Function} callback - The mapping function
 * @param {any} fallback - Fallback value if array is invalid
 * @returns {Array} - The mapped array or fallback
 */
export const safeMap = (array, callback, fallback = []) => {
  try {
    if (!Array.isArray(array)) return fallback;
    return array.map(callback);
  } catch (error) {
    console.error('Error in safeMap:', error);
    return fallback;
  }
};
