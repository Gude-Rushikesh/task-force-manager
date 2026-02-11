import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getEmployees = () =>
  axios.get(`${BASE_URL}/employees`);

export const createEmployee = (data) =>
  axios.post(`${BASE_URL}/employees`, data);

export const updateEmployee = (id, data) =>
  axios.put(`${BASE_URL}/employees/${id}`, data);

export const deleteEmployee = (id) =>
  axios.delete(`${BASE_URL}/employees/${id}`);

export const getEmployeeById = (id) =>
  axios.get(`${BASE_URL}/employees/${id}`);
