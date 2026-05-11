/**
 * Client API pour le marketplace de services
 * Appels directs vers http://localhost:6090
 */

const BASE_URL = process.env.REACT_APP_MARKETPLACE_API_URL || 'http://localhost:8089';

const getToken = () => localStorage.getItem('token');

const request = async (method, path, body = null, lang = 'fr') => {
  const url = `${BASE_URL}${path}${path.includes('?') ? '&' : '?'}lang=${lang}`;
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(url, options);
  const data = await res.json();
  return data;
};

// ─── Public ────────────────────────────────────────────────────────────────

export const getServices = (params = {}, lang = 'fr') => {
  const qs = new URLSearchParams(params).toString();
  return request('GET', `/marketplace/services${qs ? '?' + qs : ''}`, null, lang);
};

export const getServiceById = (id, lang = 'fr') =>
  request('GET', `/marketplace/services/${id}`, null, lang);

export const getCategories = (lang = 'fr') =>
  request('GET', '/marketplace/categories', null, lang);

// ─── Buyer (auth requise) ───────────────────────────────────────────────────

export const createOrder = (payload, lang = 'fr') =>
  request('POST', '/marketplace/orders', payload, lang);

export const getOrder = (id, lang = 'fr') =>
  request('GET', `/marketplace/orders/${id}`, null, lang);

export const getMyOrders = (lang = 'fr') =>
  request('GET', '/marketplace/orders', null, lang);

export const confirmDelivery = (orderId, lang = 'fr') =>
  request('POST', `/marketplace/orders/${orderId}/confirm`, null, lang);

export const openLitigation = (orderId, reason, lang = 'fr') =>
  request('POST', `/marketplace/orders/${orderId}/litigation`, { reason }, lang);

export const postReview = (payload, lang = 'fr') =>
  request('POST', '/marketplace/reviews', payload, lang);

// ─── Cancellation flow (buyer requests, pro accepts/rejects) ──────────────
export const requestCancellation = (orderId, payload = {}, lang = 'fr') =>
  request('POST', `/marketplace/orders/${orderId}/cancellation-request`, payload, lang);

export const acceptCancellation = (orderId, lang = 'fr') =>
  request('POST', `/pro/marketplace/orders/${orderId}/cancellation/accept`, null, lang);

export const rejectCancellation = (orderId, lang = 'fr') =>
  request('POST', `/pro/marketplace/orders/${orderId}/cancellation/reject`, null, lang);

// ─── Pro (auth requise) ────────────────────────────────────────────────────

export const getProDashboard = (lang = 'fr') =>
  request('GET', '/pro/marketplace/dashboard', null, lang);

export const getProServices = (lang = 'fr') =>
  request('GET', '/pro/marketplace/services', null, lang);

export const getProOrders = (lang = 'fr') =>
  request('GET', '/pro/marketplace/orders', null, lang);

export const acceptOrder = (orderId, lang = 'fr') =>
  request('POST', `/pro/marketplace/orders/${orderId}/accept`, null, lang);

export const deliverOrder = (orderId, lang = 'fr') =>
  request('POST', `/pro/marketplace/orders/${orderId}/deliver`, null, lang);

// ─── Service requests ("Faire une demande") ────────────────────────────────

export const createServiceRequest = (payload, lang = 'fr') =>
  request('POST', '/marketplace/requests', payload, lang);

export const getMyServiceRequests = (lang = 'fr') =>
  request('GET', '/marketplace/requests/mine', null, lang);

export const getStripeStatus = (lang = 'fr') =>
  request('GET', '/pro/marketplace/stripe/status', null, lang);

export const startStripeOnboard = (lang = 'fr') =>
  request('POST', '/pro/marketplace/stripe/onboard', null, lang);

export const searchProviders = (query, lang = 'fr') =>
  request('GET', `/marketplace/services?provider_name=${encodeURIComponent(query)}`, null, lang);
