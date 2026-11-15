import apiClient from './client.js'

export const careersApi = {
  // Public jobs
  getAll: (params = {}) => apiClient.get('/careers', { params }),
  getAllAdmin: () => apiClient.get('/careers/all'),
  getById: (id) => apiClient.get(`/careers/${id}`),
  create: (data) => apiClient.post('/careers', data),
  update: (id, data) => apiClient.put(`/careers/${id}`, data),
  delete: (id) => apiClient.delete(`/careers/${id}`),

  // Candidate applications (Zero-Storage resume handling)
  apply: (data) => apiClient.post('/careers/apply', data),
  trackApplications: (email, oauthSub = '') =>
    apiClient.get('/careers/track/my-applications', {
      params: { email, oauth_sub: oauthSub },
    }),

  // HR applicant management
  getApplications: (params = {}) => apiClient.get('/careers/admin/applications', { params }),
  updateApplicationStatus: (id, data) =>
    apiClient.put(`/careers/admin/applications/${id}/status`, data),
}

export default careersApi
