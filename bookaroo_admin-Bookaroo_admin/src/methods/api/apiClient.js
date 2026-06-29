import axios from "axios";
import { setAuthorizationToken } from "../auth";
import { toast } from "react-toastify";
import loader from "../loader";
import environment from "../../environment";
import methodModel from "../methods";

const config = {
  headers: { "Content-Type": "application/json" },
};
const imageConfig = {
  headers: { "Content-Type": 'multipart/form-data' }
}

const baseUrl = environment.api;

const handleError = (err, hideError) => {
  let message = "";
  if (err) {
    if (err && err.error && err.error.code === 401) {
      hideError = true;
      localStorage.removeItem("persist:admin-app");
      localStorage.removeItem("token");
      methodModel.route("/");
      document?.getElementById('logoutBtn')?.click()
    }
    message = err && err.error && err.error.message;
    if (!message) message = err.message;
    if (!message) message = "Server Error";
  }
  if (!hideError) toast.error(message);
};

class ApiClient {
  static post(url1, payload, params = {}, base = "", hideError = false) {
    const url = base ? base + url1 : baseUrl + url1;

    setAuthorizationToken(axios);
    return new Promise((fulfill, reject) => {
      axios
        .post(url, JSON.stringify(payload), { ...config, params })
        .then(response => fulfill(response?.data))
        .catch(error => {
          loader(false);
          if (error?.response) {
            const eres = error.response;
            handleError(eres.data, hideError);
            fulfill({ ...eres.data, success: false });
          } else {
            toast.error("Network Error");
            reject(error);
          }
        });
    });
  }

  static put(url1, payload, base = "") {
    const url = base ? base + url1 : baseUrl + url1;

    setAuthorizationToken(axios);
    return new Promise((fulfill, reject) => {
      axios
        .put(url, JSON.stringify(payload), config)
        .then(response => fulfill(response?.data))
        .catch(error => {
          loader(false);
          if (error?.response) {
            const eres = error.response;
            handleError(eres.data);
            fulfill(eres.data);
          } else {
            toast.error("Network Error");
            reject(error);
          }
        });
    });
  }

  static patch(url1, payload, base = "", hideError = false) {
    const url = base ? base + url1 : baseUrl + url1;

    setAuthorizationToken(axios);
    return new Promise((fulfill, reject) => {
      axios
        .patch(url, JSON.stringify(payload), config)
        .then(response => fulfill(response?.data))
        .catch(error => {
          loader(false);
          if (error?.response) {
            const eres = error.response;
            handleError(eres.data, hideError);
            fulfill({ ...eres.data, success: false });
          } else {
            toast.error("Network Error");
            reject(error);
          }
        });
    });
  }

  static get(url1, params = {}, base = "", hideError = "") {
    const url = base ? base + url1 : baseUrl + url1;

    setAuthorizationToken(axios);
    return new Promise((fulfill, reject) => {
      axios
        .get(url, { ...config, params })
        .then(response => fulfill(response?.data))
        .catch(error => {
          loader(false);
          if (error?.response) {
            const eres = error.response;
            handleError(eres.data, hideError);
            fulfill({ ...eres.data, success: false });
          } else {
            toast.error("Network Error");
            reject(error);
          }
        });
    });
  }

  static delete(url1, params = {}, base = "") {
    const url = base ? base + url1 : baseUrl + url1;

    setAuthorizationToken(axios);
    return new Promise((fulfill, reject) => {
      axios
        .delete(url, { ...config, params })
        .then(response => fulfill(response?.data))
        .catch(error => {
          loader(false);
          if (error?.response) {
            const eres = error.response;
            handleError(eres.data);
            fulfill(eres.data);
          } else {
            toast.error("Network Error");
            reject(error);
          }
        });
    });
  }

  static allApi(url, params, method = "get") {
    switch (method) {
      case "get":
        return this.get(url, params);
      case "put":
        return this.put(url, params);
      case "post":
        return this.post(url, params);
      default:
        throw new Error("Unsupported method");
    }
  }

  /*************** Form-Data Method ***********/
  static postFormData(url, params) {
    const fullUrl = baseUrl + url;

    setAuthorizationToken(axios);
    return new Promise((fulfill, reject) => {
      const body = new FormData();
      Object.keys(params).forEach(itm => body.append(itm, params[itm]));

      axios
        .post(fullUrl, body, imageConfig)
        .then(response => fulfill(response?.data))
        .catch(error => {
          loader(false);
          if (error?.response) {
            const eres = error.response;
            handleError(eres.data);
            fulfill(eres.data);
          } else {
            toast.error("Network Error");
            reject(error);
          }
        });
    });
  }

  static postFormFileData(url, params) {
    const fullUrl = baseUrl + url;

    setAuthorizationToken(axios);
    return new Promise((fulfill, reject) => {
      const body = new FormData();
      Object.keys(params).forEach(itm => body.append(itm, params[itm]));

      axios
        .post(fullUrl, body, imageConfig)
        .then(response => fulfill(response?.data))
        .catch(error => {
          loader(false);
          if (error?.response) {
            const eres = error.response;
            handleError(eres.data);
            fulfill(eres.data);
          } else {
            toast.error("Network Error");
            reject(error);
          }
        });
    });
  }

  static multiImageUpload(url, files, params = {}, key = "file") {
    const fullUrl = baseUrl + url;

    setAuthorizationToken(axios);
    const body = new FormData();

    Array.from(files).forEach((file) => {
      body.append(key, file);
    });

    return new Promise((fulfill, reject) => {
      axios
        .post(fullUrl, body, { headers: imageConfig, params })
        .then(response => fulfill(response?.data))
        .catch(error => {
          loader(false);
          if (error?.response) {
            const eres = error.response;
            handleError(eres.data);
            fulfill(eres.data);
          } else {
            toast.error("Network Error");
            reject(error);
          }
        });
    });
  }
}

export default ApiClient;
