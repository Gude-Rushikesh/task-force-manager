import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getTasks = () =>
  axios.get(`${BASE_URL}/tasks`);

export const createTask = (data) =>
  axios.post(`${BASE_URL}/tasks`, data);

export const updateTask = (id, data) =>
  axios.put(`${BASE_URL}/tasks/${id}`, data);

export const deleteTask = (id) =>
  axios.delete(`${BASE_URL}/tasks/${id}`);

export const getTaskById = (id) =>
  axios.get(`${BASE_URL}/tasks/${id}`);
