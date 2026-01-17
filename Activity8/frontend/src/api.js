import axios from 'axios'

const API_URL = 'http://localhost:3000'

export const chatroomApi = {
  getAll: () => axios.get(`${API_URL}/chatrooms`),
  getOne: (id) => axios.get(`${API_URL}/chatrooms/${id}`),
  create: (data) => axios.post(`${API_URL}/chatrooms`, data),
  update: (id, data) => axios.put(`${API_URL}/chatrooms/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/chatrooms/${id}`),
}

export const messageApi = {
  getByRoom: (chatroomId) => axios.get(`${API_URL}/chatrooms/${chatroomId}`),
  create: (chatroomId, data) => axios.post(`${API_URL}/chatrooms/${chatroomId}/messages`, data),
  delete: (id) => axios.delete(`${API_URL}/messages/${id}`),
}
