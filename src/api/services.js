import apiClient from './client.js'

export const servicesApi = {
  getAll: () => apiClient.get('/services'),
  getBySlug: (slug) => apiClient.get(`/services/${slug}`),
  create: (data) => apiClient.post('/services', data),
  update: (slug, data) => apiClient.put(`/services/${slug}`, data),
  delete: (slug) => apiClient.delete(`/services/${slug}`),
}

export default servicesApi
