import apiClient from './client.js'

export const mediaApi = {
  /**
   * Upload an image file to Cloudinary via backend.
   * Only the returned HTTPS Cloudinary URL is saved in the database.
   */
  upload: (file, folder = 'openmnc_cms') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)
    return apiClient.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

export default mediaApi
