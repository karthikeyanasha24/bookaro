import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendarDays } from 'react-icons/fa6';
import { getServiceById, createOrder } from '../../../methods/api/marketplaceApi';
import { saveOrderId } from '../../MarketplaceOrders';

const TEXTS = {
  fr: {
    loading: 'Chargement du service…',
    notFound: 'Service introuvable.',
    back: '← Retour',
    order: 'Commander ce service',
    qty: 'Quantité',
    msg: 'Message au prestataire (optionnel)',
    msgPlaceholder: 'Décrivez votre besoin…',
    price: 'Prix unitaire TTC',
    total: 'Total estimé TTC',
    confirm: 'Confirmer la commande',
    ordering: 'Envoi en cours…',
    success: 'Commande créée ! Redirection…',
    error: 'Erreur lors de la commande.',
    available: 'Disponible',
    inactive: 'Indisponible',
    switchLang: 'EN',
    deliveryTime: 'Délai de livraison',
    city: 'Ville',
    provider: 'Prestataire',
    days: 'jours',
  },
  en: {
    loading: 'Loading service…',
    notFound: 'Service not found.',
    back: '← Back',
    order: 'Book this service',
    qty: 'Quantity',
    msg: 'Message to provider (optional)',
    msgPlaceholder: 'Describe your need…',
    price: 'Unit price (incl. tax)',
    total: 'Estimated total (incl. tax)',
    confirm: 'Confirm order',
    ordering: 'Sending…',
    success: 'Order created! Redirecting…',
    error: 'Error placing order.',
    available: 'Available',
    inactive: 'Unavailable',
    switchLang: 'FR',
    deliveryTime: 'Delivery time',
    city: 'City',
    provider: 'Provider',
    days: 'days',
  },
};

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lang, setLang] = useState('fr');
  const t = TEXTS[lang];

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', text }

  useEffect(() => {
    setLoading(true);
    getServiceById(id, lang)
      .then(res => setService(res?.service || res?.data || res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, lang]);

  const handleOrder = async () => {
    if (!service) return;
    setOrdering(true);
    setFeedback(null);
    try {
      const res = await createOrder(
        { service_id: service._id, quantity: qty, message: message || undefined },
        lang
      );
      const orderId = res?.order?._id || res?._id;
      if (orderId) {
        saveOrderId(orderId);
        setFeedback({ type: 'success', text: t.success });
        setTimeout(() => navigate('/marketplace/orders'), 1500);
      } else {
        setFeedback({ type: 'error', text: res?.message || t.error });
      }
    } catch (e) {
      setFeedback({ type: 'error', text: t.error });
    } finally {
      setOrdering(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">{t.loading}</div>;
  if (!service) return <div className="min-h-screen flex items-center justify-center text-gray-400">{t.notFound}</div>;

  const title = lang === 'fr' ? (service.title_fr || service.title) : (service.title_en || service.title);
  const description = lang === 'fr' ? (service.description_fr || service.description) : (service.description_en || service.description);
  const totalTTC = ((service.price_ttc || service.price || 0) * qty).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/marketplace')}
            className="text-blue-600 hover:underline font-medium text-sm"
          >
            {t.back}
          </button>
          <button
            onClick={() => setLang(l => l === 'fr' ? 'en' : 'fr')}
            className="text-sm font-semibold px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
          >
            {t.switchLang}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Détail du service (2/3) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Image hero */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl h-48 flex items-center justify-center text-7xl">
            {service.category?.icon || '🛠️'}
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${service.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {service.status === 'active' ? t.available : t.inactive}
              </span>
              <span className="text-xs text-gray-400">
                {service.category?.name_fr || service.category?.name || ''}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{description}</p>

            {/* Métadonnées */}
            <div className="mt-5 grid grid-cols-3 gap-4 pt-5 border-t border-gray-100">
              {service.city && (
                <div>
                  <div className="text-xs text-gray-400 font-medium">{t.city}</div>
                  <div className="text-sm font-semibold text-gray-700">{service.city}</div>
                </div>
              )}
              {service.delivery_time && (
                <div>
                  <div className="text-xs text-gray-400 font-medium">{t.deliveryTime}</div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FaCalendarDays className="text-gray-400" />
                    {service.delivery_time} {t.days}
                  </div>
                </div>
              )}
              {service.provider && (
                <div>
                  <div className="text-xs text-gray-400 font-medium">{t.provider}</div>
                  <div className="text-sm font-semibold text-gray-700">
                    {service.provider.name || service.provider.email || '—'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Formulaire de commande (1/3) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{t.order}</h2>

            {/* Prix */}
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">{t.price}</span>
              {service.price_ttc === 0 || service.is_free ? (
                <span className="font-semibold text-blue-600 line-through">{service.price_ttc || service.price || 0}€</span>
              ) : (
                <span className="font-semibold text-blue-600">{service.price_ttc || service.price || 0}€</span>
              )}
            </div>
            {service.price_ttc === 0 || service.is_free ? (
              <div className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#976DD0]">
                <span className="bg-[#F2ECF8] px-2 py-1 rounded-full">Service offert</span>
              </div>
            ) : null}

            {/* Quantité */}
            <div className="mb-4">
              <label className="text-sm text-gray-500 block mb-1 font-medium">{t.qty}</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 text-lg font-bold flex items-center justify-center hover:bg-gray-100"
                >−</button>
                <span className="text-lg font-bold w-8 text-center">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 text-lg font-bold flex items-center justify-center hover:bg-gray-100"
                >+</button>
              </div>
            </div>

            {/* Message */}
            <div className="mb-4">
              <label className="text-sm text-gray-500 block mb-1 font-medium">{t.msg}</label>
              <textarea
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                rows={3}
                placeholder={t.msgPlaceholder}
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>

            {/* Total */}
            <div className="flex justify-between py-3 border-t border-gray-100 mb-4">
              <span className="font-semibold text-gray-700">{t.total}</span>
              <span className="text-2xl font-bold text-blue-600">{totalTTC}€</span>
            </div>

            {/* Feedback */}
            {feedback && (
              <div className={`text-sm px-3 py-2 rounded-lg mb-3 ${feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                {feedback.text}
              </div>
            )}

            <button
              onClick={handleOrder}
              disabled={ordering || service.status !== 'active'}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {ordering ? t.ordering : t.confirm}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
