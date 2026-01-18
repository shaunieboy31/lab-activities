import axios from 'axios'

const API_URL = 'http://localhost:3003'

export const getProducts = async () => {
  const response = await axios.get(`${API_URL}/products`)
  return response.data
}

export const createOrder = async (orderData) => {
  const response = await axios.post(`${API_URL}/orders`, orderData)
  return response.data
}

export const getOrder = async (id) => {
  const response = await axios.get(`${API_URL}/orders/${id}`)
  return response.data
}
