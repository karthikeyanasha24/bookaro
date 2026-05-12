
import axios from 'axios';

const BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:6089';

const client = axios.create({
  baseURL: BASE,
  timeout: 30_000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

class ApiClient {
  static async get(endpoint, params = {}) {
    try {
      const res = await client.get(endpoint, { params });
      return res.data;
    } catch (e) {
      return { success: false, message: e?.message || 'Network error', error: e }; 
    }
  }

  static async post(endpoint, payload = {}) {
    try {
      const res = await client.post(endpoint, payload);
      return res.data;
    } catch (e) {
      return { success: false, message: e?.message || 'Network error', error: e };
    }
  }

  static async put(endpoint, payload = {}) {
    try {
      const res = await client.put(endpoint, payload);
      return res.data;
    } catch (e) {
      return { success: false, message: e?.message || 'Network error', error: e };
    }
  }

  static async patch(endpoint, payload = {}) {
    try {
      const res = await client.patch(endpoint, payload);
      return res.data;
    } catch (e) {
      return { success: false, message: e?.message || 'Network error', error: e };
    }
  }

  static async delete(endpoint, params = {}) {
    try {
      const res = await client.delete(endpoint, { params });
      return res.data;
    } catch (e) {
      return { success: false, message: e?.message || 'Network error', error: e };
    }
  }

  // Generic method used in code: ApiClient.allApi(url, value, method)
  static async allApi(endpoint, payload = {}, method = 'post') {
    try {
      const cfg = { url: endpoint, method: method.toLowerCase(), data: payload };
      const res = await client.request(cfg);
      return res.data;
    } catch (e) {
      return { success: false, message: e?.message || 'Network error', error: e };
    }
  }

  static async postFormData(endpoint, formData) {
    try {
      const res = await client.post(endpoint, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return res.data;
    } catch (e) {
      return { success: false, message: e?.message || 'Network error', error: e };
    }
  }

  static async postFormFileData(endpoint, formData) {
    return ApiClient.postFormData(endpoint, formData);
  }

  static async multiImageUpload(endpoint, formData) {
    return ApiClient.postFormData(endpoint, formData);
  }
}

export default ApiClient;
