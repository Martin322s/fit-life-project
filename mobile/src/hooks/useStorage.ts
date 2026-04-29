import { useState, useEffect } from 'react';
import { storage } from '@/src/services/storage';

export function useStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    storage.get<T>(key).then(stored => {
      if (stored !== null) setValue(stored);
      setLoaded(true);
    });
  }, [key]);

  const set = async (newValue: T | ((prev: T) => T)) => {
    setValue(prev => {
      const next = typeof newValue === 'function' ? (newValue as (p: T) => T)(prev) : newValue;
      storage.set(key, next);
      return next;
    });
  };

  return { value, set, loaded };
}
