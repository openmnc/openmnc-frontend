import apiClient from './client.js'

export const settingsApi = {
  getAll: () => apiClient.get('/settings'),
  update: (key, value) => apiClient.put(`/settings/${key}`, { value }),
}

export default settingsApi
