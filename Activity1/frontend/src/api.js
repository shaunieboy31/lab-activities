import axios from 'axios';

const API_URL = 'http://localhost:3001/api/tasks'; // Backend URL

export const getTasks = () => axios.get(API_URL);
export const addTask = (task) => axios.post(API_URL, task); // Accepts { title, completed, deadline }
export const updateTask = (id, task) => axios.patch(`${API_URL}/${id}`, task); // Accepts { title, completed, deadline }
export const deleteTask = (id) => axios.delete(`${API_URL}/${id}`);