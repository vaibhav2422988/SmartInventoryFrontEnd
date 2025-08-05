// src/apiService.js
import axios from 'axios';

const API_BASE_URL = 'https://localhost:7068/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const apiService = {
  
  // Auth APIs
  async register(data) {
    const response = await axiosInstance.post('/Auth/register', data);
    return response.data;
  },

  async login(data) {
    const response = await axiosInstance.post('/Auth/login', data);
    return response.data;
  },

  async addCoworker(data) {
    const response = await axiosInstance.post('/Auth/add-coworker', data);
    return response.data;
  },

  async getCoworkers() {
    const response = await axiosInstance.get('/Auth/coworkers');
    return response.data;
  },

  async deleteCoworker(id) {
    const response = await axiosInstance.delete(`/Auth/delete-coworker/${id}`);
    return response.data;
  },

  // Category APIs
  async getCategories() {
    const response = await axiosInstance.get('/Category');
    return response.data;
  },

  async addCategory(data) {
    const response = await axiosInstance.post('/Category', data);
    return response.data;
  },

  async getCategoryItemCounts() {
    const response = await axiosInstance.get('/Category/item-counts');
    return response.data;
  },

  async getCategoryCount() {
    const response = await axiosInstance.get('/Category/count');
    return response.data;
  },

  async getCategoryById(id) {
    const response = await axiosInstance.get(`/Category/${id}`);
    return response.data;
  },

  async updateCategory(id, data) {
    const response = await axiosInstance.put(`/Category/${id}`, data);
    return response.data;
  },

  async deleteCategory(id) {
    const response = await axiosInstance.delete(`/Category/${id}`);
    return response.data;
  },

  // Item APIs
  async getItems() {
    const response = await axiosInstance.get('/Item');
    return response.data;
  },

  async addItem(data) {
    const response = await axiosInstance.post('/Item', data);
    return response.data;
  },

  async getRestockItems() {
    const response = await axiosInstance.get('/Item/restock');
    return response.data;
  },

  async getItemCount() {
    const response = await axiosInstance.get('/Item/count');
    return response.data;
  },

  async getItemById(id) {
    const response = await axiosInstance.get(`/Item/${id}`);
    return response.data;
  },

  async updateItem(id, data) {
    const response = await axiosInstance.put(`/Item/${id}`, data);
    return response.data;
  },

  async deleteItem(id) {
    const response = await axiosInstance.delete(`/Item/${id}`);
    return response.data;
  },

  // Stock APIs
  async getTotalStock() {
    const response = await axiosInstance.get('/Stock/total');
    return response.data;
  },

  async adjustStock(data) {
    const response = await axiosInstance.post('/Stock/adjust', data);
    return response.data;
  },

  async updateStock(data) {
    const response = await axiosInstance.post('/Stock/update', data);
    return response.data;
  },

  async getStocks() {
    const response = await axiosInstance.get('/Stock');
    return response.data;
  },

  async getStockByItemId(itemId) {
    const response = await axiosInstance.get(`/Stock/${itemId}`);
    return response.data;
  }
};

export default apiService;
