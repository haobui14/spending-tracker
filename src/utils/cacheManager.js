/**
 * Cache Manager for offline functionality with user privacy
 */

// Clean up cache data for user privacy while preserving offline functionality
export const cleanupUserCache = (currentUserId) => {
  console.log('Cache cleanup for user privacy...');
  
  // Get all localStorage keys
  const keys = Object.keys(localStorage);
  
  // Preserve these keys across user changes
  const preserveKeys = ['themeMode', 'theme', 'darkMode', 'language', 'mui-theme'];
  
  keys.forEach(key => {
    // Skip preserved keys
    if (preserveKeys.some(preserve => key.includes(preserve))) {
      console.log('Preserving setting:', key);
      return;
    }
    
    // Remove session data (temporary cache)
    if (key.includes('session_')) {
      localStorage.removeItem(key);
      console.log('Removed session cache:', key);
    }
    
    // Remove offline cache for different users (keep current user's cache)
    if (key.includes('offline_') && currentUserId) {
      if (!key.endsWith(`_${currentUserId}`)) {
        localStorage.removeItem(key);
        console.log('Removed other user cache:', key);
      }
    }
    
    // Remove other user-specific keys that don't belong to current user
    if (key.includes('_') && currentUserId) {
      const parts = key.split('_');
      const lastPart = parts[parts.length - 1];
      // If it looks like a user ID and isn't the current user
      if (lastPart.length > 10 && lastPart !== currentUserId) {
        localStorage.removeItem(key);
        console.log('Removed other user data:', key);
      }
    }
  });
};

// Clean all cache (for logout)
export const clearAllCache = () => {
  console.log('Clearing all cache...');
  localStorage.clear();
};

// Get offline cache key for specific data
export const getOfflineCacheKey = (userId, year, month) => {
  return `offline_${year}_${month}_${userId}`;
};

// Get session cache key for specific data
export const getSessionCacheKey = (userId, year, month) => {
  return `session_${year}_${month}_${userId}`;
};

// Check if data exists in offline cache
export const hasOfflineData = (userId, year, month) => {
  const key = getOfflineCacheKey(userId, year, month);
  return localStorage.getItem(key) !== null;
};

// Get offline data
export const getOfflineData = (userId, year, month) => {
  const key = getOfflineCacheKey(userId, year, month);
  const data = localStorage.getItem(key);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Error parsing offline data:', e);
      return null;
    }
  }
  return null;
};

// Save offline data
export const saveOfflineData = (userId, year, month, data) => {
  const key = getOfflineCacheKey(userId, year, month);
  localStorage.setItem(key, JSON.stringify(data));
  console.log('Saved offline data:', key);
};

// Get list of months with offline data for current user
export const getOfflineMonths = (userId) => {
  const keys = Object.keys(localStorage);
  const offlineMonths = [];
  
  keys.forEach(key => {
    if (key.startsWith('offline_') && key.endsWith(`_${userId}`)) {
      // Extract year and month from key like "offline_2025_7_userId"
      const parts = key.split('_');
      if (parts.length >= 4) {
        const year = parts[1];
        const month = parts[2];
        offlineMonths.push({ year: parseInt(year), month: parseInt(month) });
      }
    }
  });
  
  return offlineMonths.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year; // Newest year first
    return b.month - a.month; // Newest month first
  });
};
