import ApiClient from "./apiClient";

const MarketplaceApi = {
  listServices: (params = {}) => ApiClient.get("admin/marketplace/services", params),
  getServiceDetail: (id, params = {}) => ApiClient.get("admin/marketplace/services", { id, ...params }),
  listCategories: () => ApiClient.get("admin/marketplace/categories"),
  createCategory: (payload) => ApiClient.post("admin/marketplace/categories", payload),
  updateCategory: (id, payload) => ApiClient.put(`admin/marketplace/categories/${id}`, payload),
  deleteCategory: (id) => ApiClient.delete(`admin/marketplace/categories/${id}`),
  listProUsers: (params = {}) => ApiClient.get("user/pro/listing", params),
  getUserDetail: (id) => ApiClient.get("user/detail", { id }),
  updatePartnerFlags: (payload) => ApiClient.put("user/admin/update-profile", payload),

  // Partenaires marketplace (nouveau)
  listPartners: (params = {}) => ApiClient.get("admin/marketplace/partners", params),
  getPartnerDetail: (id, params = {}) => ApiClient.get(`admin/marketplace/partners/${id}`, params),
  getPartnerTransactions: (id, params = {}) => ApiClient.get(`admin/marketplace/partners/${id}/transactions`, params),
  getPartnerServices: (id, params = {}) => ApiClient.get(`admin/marketplace/partners/${id}/services`, params),
  getPartnerProperties: (id, params = {}) => ApiClient.get(`admin/marketplace/partners/${id}/properties`, params),
  getPartnerReviews: (id, params = {}) => ApiClient.get(`admin/marketplace/partners/${id}/reviews`, params),
  updatePartnerFlagsV2: (id, payload) => ApiClient.put(`admin/marketplace/partners/${id}/flags`, payload),
  updatePartnerBio: (id, payload) => ApiClient.put(`admin/marketplace/partners/${id}/bio`, payload),

  // Admin service actions
  validateService: (id) => ApiClient.post(`admin/marketplace/services/${id}/validate`),
  rejectService: (id) => ApiClient.post(`admin/marketplace/services/${id}/reject`),
  bulkValidateServices: (ids) => ApiClient.post('admin/marketplace/services/bulk-validate', { ids }),
  bulkRejectServices: (ids) => ApiClient.post('admin/marketplace/services/bulk-reject', { ids }),
  updateService: (id, payload) => ApiClient.put(`admin/marketplace/services/${id}`, payload),
  deleteService: (id) => ApiClient.delete(`admin/marketplace/services/${id}`),

  // Litiges marketplace
  listLitigations: (params = {}) => ApiClient.get("admin/marketplace/litigations", params),
  getLitigationDetail: (id, params = {}) => ApiClient.get(`admin/marketplace/litigations/${id}`, params),
  resolveLitigation: (id, payload = {}) => ApiClient.post(`admin/marketplace/orders/${id}/resolve-litigation`, payload),

  // Demandes de service marketplace (admin)
  listRequests: (params = {}) => ApiClient.get("admin/marketplace/requests", params),
  getRequestDetail: (id, params = {}) => ApiClient.get(`admin/marketplace/requests/${id}`, params),
  updateRequestStatus: (id, payload = {}) => ApiClient.patch(`admin/marketplace/requests/${id}/status`, payload),
  deleteRequest: (id) => ApiClient.delete(`admin/marketplace/requests/${id}`),

  // Transactions marketplace
  listTransactions: (params = {}) => ApiClient.get("admin/marketplace/orders", params),
  getTransactionDetail: (id, params = {}) => ApiClient.get(`admin/marketplace/orders/${id}`, params),

  // Marketplace settings
  getMarketplaceSettings: () => ApiClient.get("admin/marketplace/settings"),
  updateMarketplaceSettings: (payload) => ApiClient.put("admin/marketplace/settings", payload),

  // Commission AnyHomes par user pro (vu depuis la fiche admin du pro)
  getCompanyCommission: (id) => ApiClient.get(`user/admin/company-detail/${id}`),
  updateCompanyCommission: (id, payload) => ApiClient.put(`user/admin/company-detail/${id}/commission`, payload),
};

export default MarketplaceApi;
