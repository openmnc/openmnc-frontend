import apiClient from './client.js'

export const servicesApi = {
  getAll: (includeAll = false) => apiClient.get('/services', { params: { all: includeAll } }),
  getBySlug: (slug) => apiClient.get(`/services/${slug}`),
  create: (data) => apiClient.post('/services', data),
  update: (slug, data) => apiClient.put(`/services/${slug}`, data),
  delete: (slug) => apiClient.delete(`/services/${slug}`),
  seedDefaults: () => apiClient.post('/services/seed-defaults'),
}

export default servicesApi
