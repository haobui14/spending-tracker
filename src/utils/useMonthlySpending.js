import { useEffect, useState, useCallback } from 'react';
import { fetchMonthlySpending, setMonthlySpending } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

export default function useMonthlySpending(year, month) {
  const [user] = useAuthState(auth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchData = useCallback(async () => {
    console.log('useMonthlySpending - fetchData called');
    console.log('User object:', user);
    console.log('User UID:', user?.uid);
    console.log('Year:', year, 'Month:', month);
    console.log('Is offline:', isOffline);
    
    if (!user) {
      console.log('No user found, returning early');
      setData(null);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // If offline, don't clear data - let component handle offline cache
    if (!isOffline) {
      setData(null); // Clear previous data only when online
    }
    
    try {
      if (isOffline) {
        console.log('Offline mode - skipping fetch, relying on cache');
        setLoading(false);
        return;
      }
      
      const res = await fetchMonthlySpending(user.uid, year, month);
      console.log('fetchData result:', res);
      setData(res);
    } catch (e) {
      console.error('fetchData error:', e);
      setError(e);
      console.log('Error occurred - may be offline, keeping cached data');
    } finally {
      setLoading(false);
    }
  }, [user, year, month, isOffline]);

  // Clear data when parameters change to prevent stale data (only when online)
  useEffect(() => {
    console.log('useMonthlySpending - Parameters changed, clearing data');
    console.log('New params - year:', year, 'month:', month, 'user:', user?.uid);
    if (!isOffline) {
      setData(null);
      setLoading(true);
    }
  }, [year, month, user?.uid, isOffline]);

  useEffect(() => {
    console.log('useMonthlySpending - fetchData effect triggered');
    fetchData();
  }, [fetchData]);

  // Save entire doc (used for adding or overwriting)
  const saveData = async (newData) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    
    try {
      // Update local state immediately for better UX
      setData(newData);
      
      // Always save to offline cache
      const offlineCacheKey = `offline_${year}_${month}_${user.uid}`;
      localStorage.setItem(offlineCacheKey, JSON.stringify(newData));
      
      // Try to save to backend if online
      if (!isOffline) {
        await setMonthlySpending(user.uid, year, month, newData);
        console.log('Data saved to backend and cached offline');
      } else {
        console.log('Offline - data saved to cache only');
      }
    } catch (e) {
      console.error('Error saving data:', e);
      setError(e);
      // Even if backend save fails, we have the offline cache
    } finally {
      setLoading(false);
    }
  };

  // Update a single item in items array, or doc-level fields
  const updateData = async (id, fields) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    
    try {
      // Get current data (from cache if offline)
      let res = data;
      if (!res && !isOffline) {
        res = await fetchMonthlySpending(user.uid, year, month);
      } else if (!res && isOffline) {
        // Try to get from offline cache
        const offlineCacheKey = `offline_${year}_${month}_${user.uid}`;
        const cached = localStorage.getItem(offlineCacheKey);
        if (cached) {
          res = JSON.parse(cached);
        }
      }
      
      let items = res?.items ? [...res.items] : [];

      // If editing or deleting an item
      if (id !== null && id !== undefined) {
        if (fields._delete) {
          // Delete item by id
          items = items.filter((item) => item.id !== id);
        } else {
          // Edit item by id
          items = items.map((item) =>
            item.id === id ? { ...item, ...fields } : item
          );
        }
      }

      // If just updating doc-level fields (like status)
      let updateFields = {};
      if ((id === null || id === undefined) && fields) {
        updateFields = { ...fields };
      }

      // Recalculate total, paid, and status
      const total = items.reduce((sum, s) => sum + s.amount, 0);
      const paid = items
        .filter((s) => s.paid)
        .reduce((sum, s) => sum + s.amount, 0);
      let status = updateFields.status || 'unpaid';
      if (!updateFields.status) {
        if (paid === total && total > 0) status = 'paid';
        else if (paid > 0) status = 'partial';
        else status = 'unpaid';
      }

      // Compose updated doc
      const updatedDoc = {
        ...res,
        items,
        total,
        paid,
        status,
        ...updateFields, // doc-level fields (if any)
      };

      // Update local state immediately
      setData(updatedDoc);
      
      // Always save to offline cache
      const offlineCacheKey = `offline_${year}_${month}_${user.uid}`;
      localStorage.setItem(offlineCacheKey, JSON.stringify(updatedDoc));
      
      // Try to save to backend if online
      if (!isOffline) {
        await setMonthlySpending(user.uid, year, month, updatedDoc);
        console.log('Data updated in backend and cached offline');
      } else {
        console.log('Offline - data updated in cache only');
      }
    } catch (e) {
      console.error('Error updating data:', e);
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, saveData, updateData, refetch: fetchData, isOffline };
}
