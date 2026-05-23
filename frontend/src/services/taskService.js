import api from "./api";

export const getTasks = () =>
  api.get("/tasks");

export const createTask = (data) =>
  api.post("/tasks", data);

export const updateTask = (id, data) =>
  api.put(`/tasks/${id}`, data);

export const deleteTask = (id) =>
  api.delete(`/tasks/${id}`);

export const getTaskById = (id) =>
  api.get(`/tasks/${id}`);

export const addTaskComment = (id, data) =>
  api.post(`/tasks/${id}/comments`, data);
