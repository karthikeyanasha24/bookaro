
// ApiClient mock: toutes les méthodes renvoient une promesse résolue avec un objet vide ou un mock local
class ApiClient {
  static post() { return Promise.resolve({}); }
  static postWithouterror() { return Promise.resolve({}); }
  static put() { return Promise.resolve({}); }
  static patch() { return Promise.resolve({}); }
  static get() { return Promise.resolve({}); }
  static delete() { return Promise.resolve({}); }
  static allApi() { return Promise.resolve({}); }
  static postFormData() { return Promise.resolve({}); }
  static postFormFileData() { return Promise.resolve({}); }
  static multiImageUpload() { return Promise.resolve({}); }
}

export default ApiClient;
