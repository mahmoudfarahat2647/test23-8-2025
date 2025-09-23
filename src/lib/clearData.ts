/**
 * Utility function to clear all application data from localStorage
 * This provides a clean slate for backend developers to start with
 */

export const clearAllAppData = (): void => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      // Clear all localStorage data related to the application
      localStorage.removeItem('promptBoxData');
      localStorage.removeItem('promptEditor_data');
      localStorage.removeItem('promptbox_filters');
      
      // Clear any other potential localStorage items that might be used by the app
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('prompt') || key.includes('prompt')) {
          localStorage.removeItem(key);
        }
      });
      
      console.log('All application data cleared successfully');
    } catch (error) {
      console.error('Error clearing localStorage data:', error);
      throw error;
    }
  }
};

/**
 * Utility function to clear all localStorage data
 * WARNING: This will clear ALL localStorage data, not just application data
 */
export const clearAllLocalStorage = (): void => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.clear();
      console.log('All localStorage data cleared successfully');
    } catch (error) {
      console.error('Error clearing all localStorage data:', error);
      throw error;
    }
  }
};