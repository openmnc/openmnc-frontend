import axios from 'axios'

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL
  if (!envUrl) {
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      return '/api'
    }
    // Production default: connects directly to your live Render backend API
    return 'https://openmnc-backend.onrender.com/api'
  }
  const trimmed = envUrl.replace(/\/+$/, '')
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`
}

const rawClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach JWT token if available
rawClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('openmnc_admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle 401 globally
rawClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('openmnc_admin_token')
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

// ---------------------------------------------------------------------------
// High-Speed In-Memory Client Cache & Request De-duplication Layer
// Eliminates navigation waits: 0ms instant renders on tab switching & back/forward
// ---------------------------------------------------------------------------
const CACHE_TTL_MS = 1000 * 60 * 10 // 10 minutes fresh
const STALE_REFRESH_THRESHOLD_MS = 1000 * 60 * 5 // 5 minutes stale threshold

const memoryCache = new Map()
const inFlightRequests = new Map()

const getCacheKey = (url, config = {}) => {
  const paramsStr = config.params ? JSON.stringify(config.params) : ''
  return `${url}::${paramsStr}`
}

export const clearClientCache = (prefix = '') => {
  if (!prefix) {
    memoryCache.clear()
  } else {
    for (const key of memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        memoryCache.delete(key)
      }
    }
  }
}

/**
 * Prefetch an API endpoint on link hover so data is in RAM before the click.
 */
export const prefetchApi = (url, config = {}) => {
  const key = getCacheKey(url, config)
  const cached = memoryCache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return Promise.resolve(cached.response)
  }
  return cachedGet(url, config).catch(() => {})
}

const cachedGet = async (url, config = {}) => {
  // Never cache authenticated admin list mutations
  const isAdminReq = config.headers?.Authorization || url.includes('/admin')
  if (isAdminReq) {
    return rawClient.get(url, config)
  }

  const key = getCacheKey(url, config)
  const now = Date.now()
  const cached = memoryCache.get(key)

  if (cached) {
    const age = now - cached.timestamp
    // Fresh cache: return in 0ms without touching the network
    if (age < CACHE_TTL_MS) {
      // If moderately stale (> 5 min), trigger background revalidation silently
      if (age > STALE_REFRESH_THRESHOLD_MS && !inFlightRequests.has(key)) {
        const bgPromise = rawClient
          .get(url, config)
          .then((res) => {
            memoryCache.set(key, { timestamp: Date.now(), response: res })
          })
          .catch(() => {})
          .finally(() => {
            inFlightRequests.delete(key)
          })
        inFlightRequests.set(key, bgPromise)
      }
      return Promise.resolve(cached.response)
    }
  }

  // Request De-duplication: If multiple components request the same data at once,
  // reuse the single in-flight Promise so Render only sees 1 request.
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key)
  }

  const reqPromise = rawClient
    .get(url, config)
    .then((response) => {
      memoryCache.set(key, { timestamp: Date.now(), response })
      return response
    })
    .finally(() => {
      inFlightRequests.delete(key)
    })

  inFlightRequests.set(key, reqPromise)
  return reqPromise
}

// Wrap apiClient proxy so all existing calls automatically benefit from 0ms RAM caching
const apiClient = {
  ...rawClient,
  get: cachedGet,
  post: (url, data, config) => {
    clearClientCache()
    return rawClient.post(url, data, config)
  },
  put: (url, data, config) => {
    clearClientCache()
    return rawClient.put(url, data, config)
  },
  patch: (url, data, config) => {
    clearClientCache()
    return rawClient.patch(url, data, config)
  },
  delete: (url, config) => {
    clearClientCache()
    return rawClient.delete(url, config)
  },
}

export default apiClient
