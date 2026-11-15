import apiClient from './client.js'

export const blogsApi = {
  getAll: (params = {}) => apiClient.get('/blogs', { params }),
  getBySlug: (slug) => apiClient.get(`/blogs/${slug}`),
  getAllAdmin: () => apiClient.get('/blogs/admin/all'),
  create: (data) => apiClient.post('/blogs', data),
  update: (slug, data) => apiClient.put(`/blogs/${slug}`, data),
  delete: (slug) => apiClient.delete(`/blogs/${slug}`),
}

export default blogsApi
