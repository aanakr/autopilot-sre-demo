import { useState } from 'react';

/**
 * useTimeoutFallback Hook
 *
 * Wraps async operations with a 3-second timeout guarantee.
 * Prevents infinite loading spinners by forcing resolution.
 *
 * Usage:
 *   const { execute, loading, error, data } = useTimeoutFallback();
 *
 *   const handleAction = async () => {
 *     const result = await execute(async () => {
 *       return await someAsyncOperation();
 *     });
 *   };
 */
export const useTimeoutFallback = (timeoutMs = 3000) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = async (asyncFn) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await Promise.race([
        asyncFn(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
        ),
      ]);

      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return { execute, loading, error, data };
};
