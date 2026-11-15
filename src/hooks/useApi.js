import { useState, useEffect, useCallback } from 'react'

/**
 * Generic data-fetching hook.
 * @param {Function} apiFn - The API function to call (returns a promise).
 * @param {any[]} deps - Dependencies that trigger a re-fetch.
 */
export function useApi(apiFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiFn()
      setData(response.data)
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}

export default useApi
