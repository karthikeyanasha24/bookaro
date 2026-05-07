import React, { useEffect, useState, useCallback } from 'react';
import PageLayout from '../../components/global/PageLayout';
import { ServiceCard, ServiceModal, BuyModal, MOCK_SERVICES, T } from './index';

const TITLES = {
  fr: {
    pageTitle: "Retrouvez les services que vous avez enregistré",
    pageSub: "Vos services favoris en un clic.",
    empty: "Ici se trouveront les services que vous enregistrerez. Cliquez sur le cœur en haut à droite d'une carte de service pour l'ajouter à vos favoris.",
  },
  en: {
    pageTitle: "Find the services you have saved",
    pageSub: "Your favourite services at a glance.",
    empty: "Here you will find the services you save. Click the heart at the top right of a service card to add it to your favourites.",
  },
};

function readFavoriteIds() {
  try {
    const raw = localStorage.getItem('marketplace.favorites');
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

function readFavoriteData() {
  try {
    const raw = localStorage.getItem('marketplace.favorites.data');
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export default function MarketplaceFavorites() {
  const [lang, setLang] = useState('fr');
  const [services, setServices] = useState([]);
  const [viewModal, setViewModal] = useState(null);
  const [buyModal, setBuyModal] = useState(null);
  const tx = TITLES[lang];

  const refresh = useCallback(() => {
    const ids = readFavoriteIds();
    const data = readFavoriteData();
    const list = ids
      .map(id => data[id] || MOCK_SERVICES.find(s => (s._id || s.id) === id))
      .filter(Boolean);
    setServices(list);
  }, []);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener('marketplace-favorites-changed', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('marketplace-favorites-changed', handler);
      window.removeEventListener('storage', handler);
    };
  }, [refresh]);

  return (
    <PageLayout>
      <div className="bg-[#f3f5f9] min-h-full py-[22px] px-[22px] pb-24">
        <div className="max-w-[1120px] mx-auto">
          <div className="flex items-center justify-between mb-1">
            <h1 className="font-bold text-black text-[24px]">{tx.pageTitle}</h1>
            <button
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              className="text-[12px] border border-gray-300 rounded-full px-3 py-1 text-gray-600 hover:bg-white"
            >
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>
          </div>
          <p className="text-[13px] text-gray-400 mb-4">{tx.pageSub}</p>

          {services.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center">
              <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#9CA3AF" strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round">
                  <path d="M12 21s-7.5-4.5-9.5-9.2C1.1 7.6 4 4 7.5 4c2 0 3.4 1 4.5 2.5C13.1 5 14.5 4 16.5 4 20 4 22.9 7.6 21.5 11.8 19.5 16.5 12 21 12 21z" />
                </svg>
              </div>
              <p className="text-[14px] text-gray-600 max-w-md mx-auto">{tx.empty}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {services.map(svc => (
                <ServiceCard
                  key={svc._id || svc.id}
                  svc={svc}
                  lang={lang}
                  onView={setViewModal}
                  onBuy={setBuyModal}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {viewModal && (
        <ServiceModal
          svc={viewModal}
          lang={lang}
          onClose={() => setViewModal(null)}
          onBuy={(svc) => { setViewModal(null); setBuyModal(svc); }}
        />
      )}
      {buyModal && (
        <BuyModal
          svc={buyModal}
          lang={lang}
          onClose={() => setBuyModal(null)}
          onDone={() => { setBuyModal(null); window.location.href = '/marketplace/orders'; }}
        />
      )}
    </PageLayout>
  );
}
