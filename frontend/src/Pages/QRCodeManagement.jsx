
import React, { useMemo, useEffect, useState } from 'react';
import QRCodeFlyerModal from '../components/QRCodeFlyerModal';
import ApiClient from '../methods/api/apiClient';
import { useTranslation } from 'react-i18next';
import { FiX } from 'react-icons/fi';
import { FiDownload, FiTrash } from 'react-icons/fi';
import PageLayout from '../components/global/PageLayout';
import Table from '../components/Table';
import './Dashboard/dashboard.css';
import './QRCodeManagement.local.css';

const QRCodeManagement = () => {
  // Pagination front
    // Modale QR Code Flyer
    const [flyerModalOpen, setFlyerModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // Modale viewer
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerImg, setViewerImg] = useState(null);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Synchronise la hauteur de Chill avec celle du flyer sans déformation, après chargement
  // Synchronise la hauteur de Chill avec celle du flyer, sans déformer l'image
  const syncChillHeight = () => {
    const flyer = document.getElementById('flyer-demo-img');
    const chill = document.getElementById('chill-img');
    if (flyer && chill) {
      chill.style.height = flyer.clientHeight + 'px';
      chill.style.maxHeight = '';
      chill.style.width = 'auto'; // préserve le ratio
    }
  };

  useEffect(() => {
    syncChillHeight();
    window.addEventListener('resize', syncChillHeight);
    return () => window.removeEventListener('resize', syncChillHeight);
  }, []);

  const loadProperties = async () => {
    setIsLoading(true);
    const response = await ApiClient.get('/property/qr-code/properties', { page, limit: pageSize, search });
    if (response.success) {
      setProperties(response.data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadProperties();
  }, [page, pageSize, search]);
  // i18n
  const { t, i18n } = useTranslation();

  // Demo data for table
  const data = useMemo(() => {
    if (properties.length === 0) {
      return [];
    }
    return properties.map((row) => ({
      id: row.propertyId,
      property: {
        title: row.title,
        status: row.summary || '',
        rooms: null,
        surface: null,
        location: '',
        imageUrl: row.coverUrl || '/assets/img/placeholder.png',
      },
      flyer: row.latestFlyer?.previewImageUrl || null,
      scanCount: row.latestFlyer?.scansCount ?? null,
      lastScan: row.latestFlyer?.lastScan || null,
      latestFlyer: row.latestFlyer || null,
      availablePhotos: row.availablePhotos || [],
      propertyId: row.propertyId,
      noQr: !row.latestFlyer,
    }));
  }, [properties]);

  // Filtrage local (utilise les données réelles)
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const lower = search.toLowerCase();
    return data.filter(row =>
      row.property?.title?.toLowerCase().includes(lower) ||
      row.property?.location?.toLowerCase().includes(lower)
    );
  }, [data, search]);

  // Pagination locale
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // Callback pour la Table
  const handleTableChange = ({ event, value }) => {
    if (event === 'page') setPage(value);
    if (event === 'count') {
      setPageSize(value);
      setPage(1);
    }
  };

  const columns = [
    {
      key: 'property',
      name: 'Bien',
      render: (row) => (
        <div className="followed-news-property-wrap">
          <div className="followed-news-property-image-link" aria-hidden="true">
            <img
              src={row.property?.imageUrl || "/assets/img/placeholder.png"}
              alt={row.property?.title || "property"}
              style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
            />
          </div>
          <div className="followed-news-property-meta">
            <p className="followed-news-property-title" style={{margin: 0}}>{row.property?.title || "-"}</p>
            <p className="followed-news-property-features" style={{margin: '4px 0 0', fontSize: 12}}>
              {`${row.property?.status || "-"} • ${row.property?.rooms || 0} pièces • ${row.property?.surface || 0} m² • ${row.property?.location || "-"}`}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'flyer',
      name: 'Flyer',
      render: (row) => (
        row.flyer ? (
          <img
            src={row.flyer}
            alt="Flyer"
            style={{ width: 60, borderRadius: 6, cursor: 'pointer' }}
            onClick={e => {
              e.stopPropagation();
              setViewerImg(row.flyer);
              setViewerOpen(true);
            }}
          />
        ) : null
      ),
    },
    {
      key: 'scanCount',
      name: 'Scan Count',
      render: (row) => row.scanCount ?? null,
    },
    {
      key: 'lastScan',
      name: 'Dernier scan',
      render: (row) => row.lastScan ?? null,
    },
    {
      key: 'actions',
      name: 'Actions',
      render: (row) => (
        row.noQr ? (
          <button
            className="btn btn-primary"
            style={{
              background: '#976dd0',
              color: '#fff',
              border: 'none',
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 14,
              padding: '8px 18px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px #976dd033',
              transition: 'background 0.2s',
            }}
            onClick={e => {
              e.stopPropagation();
              setSelectedProperty(row);
              setFlyerModalOpen(true);
            }}
          >
            Generate QR Code
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              title="Télécharger"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#986dcd', padding: 4 }}
              onClick={e => { e.stopPropagation(); /* TODO: implement download logic */ }}
            >
              <FiDownload size={20} />
            </button>
            <button
              title="Supprimer"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e57373', padding: 4 }}
              onClick={e => { e.stopPropagation(); /* TODO: implement delete logic */ }}
            >
              <FiTrash size={20} />
            </button>
          </div>
        )
      ),
    },
  ];

  // Persistance de l'état de l'explainer
  const [showExplainer, setShowExplainer] = useState(() => {
    const stored = localStorage.getItem('showExplainer');
    return stored === null ? true : stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem('showExplainer', showExplainer);
  }, [showExplainer]);

  return (
    <PageLayout>
      {/* Modale QR Code Flyer */}
      <QRCodeFlyerModal
        open={flyerModalOpen}
        selectedProperty={selectedProperty}
        onClose={() => {
          setFlyerModalOpen(false);
          setSelectedProperty(null);
        }}
        onSuccess={() => {
          setFlyerModalOpen(false);
          setSelectedProperty(null);
          loadProperties();
        }}
      />
      {/* Image Viewer Modal */}
      {viewerOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.8)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
          onClick={() => setViewerOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={e => { e.stopPropagation(); setViewerOpen(false); }}
            style={{
              position: 'absolute',
              top: 24,
              right: 32,
              background: 'rgba(0,0,0,0.7)',
              color: '#fff',
              border: 'none',
              borderRadius: 24,
              width: 40,
              height: 40,
              fontSize: 28,
              cursor: 'pointer',
              zIndex: 10001,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1
            }}
            aria-label="Fermer"
          >
            ×
          </button>
          {/* Large image */}
          <img
            src={viewerImg}
            alt="Agrandissement flyer"
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              borderRadius: 8,
              boxShadow: '0 4px 32px #000a',
              background: '#fff',
              display: 'block',
            }}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
       <section className="dashboard-page">
        <div className="dashboard-container">
          <div style={{marginBottom: 40}}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: 8, color: '#222' }}>QR Code management</h1>
            <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: 32 }}>
              QR Code let you bring easily potential buyers or renters from other platforms, into your Bookaroo transaction pipeline to ease your transaction process.
            </p>

            {showExplainer && (
              <div style={{ position: 'relative', display: 'flex', gap: 32, background: '#fff', borderRadius: 16, padding: '32px 32px', justifyContent: 'space-between', flexWrap: 'wrap', overflow: 'visible', boxSizing: 'border-box', marginBottom: 40 }}>
                {/* Bouton croix pour fermer l'explainer, positionné sur le coin de la forme blanche */}
                <button
                  onClick={() => setShowExplainer(false)}
                  style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    background: '#fff',
                    color: '#976dd0',
                    border: '2px solid #f8f9fb',
                    boxShadow: '0 2px 8px #0002',
                    borderRadius: 24,
                    width: 40,
                    height: 40,
                    fontSize: 24,
                    cursor: 'pointer',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                    padding: 0
                  }}
                  aria-label="Fermer l'explication"
                >
                  ×
                </button>
                {/* ...existing explainer content... */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0, maxWidth: 420, width: '100%', boxSizing: 'border-box', padding: 0 }}>
                  <div style={{ width: 32, height: 32, background: '#976dd0', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', marginBottom: 12 }}>1</div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#976dd0', marginBottom: 6, fontSize: '1.1rem' }}>Create your QR Code</div>
                    <div style={{ color: '#555', fontSize: '1rem', marginBottom: 12 }}>Generate a QR Code for your property. The poster will include your property cover image and the QR Code.</div>
                    <img
                      id="flyer-demo-img"
                      style={{ width: 500, borderRadius: 8, maxWidth: '100%', height: 'auto', border: '1px solid #bbb', cursor: 'pointer' }}
                      src="/assets/img/flyer-demo2.jpeg"
                      alt="QR flyer demo"
                      onClick={e => {
                        e.stopPropagation();
                        setViewerImg('/assets/img/flyer-demo2.jpeg');
                        setViewerOpen(true);
                      }}
                    />
                  </div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0, maxWidth: 420, width: '100%', boxSizing: 'border-box' }}>
                  <div style={{ width: 32, height: 32, background: '#976dd0', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', marginBottom: 12 }}>2</div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#976dd0', marginBottom: 6, fontSize: '1.1rem' }}>Share it on other platforms</div>
                    <div style={{ color: '#555', fontSize: '1rem', marginBottom: 12 }}>Add your poster and property profile URL to other platforms. Leads can scan and visit your Bookaroo profile.</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, rowGap: 12, justifyContent: 'flex-start', maxWidth: 260 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: 4, height: 44, width: 70 }}>
                        <img src="/assets/img/leboncoin.png" alt="Leboncoin" style={{ height: 36, width: 'auto', maxWidth: 62, display: 'block' }} />
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: 4, height: 44, width: 70 }}>
                        <img src="/assets/img/seloger.png" alt="SeLoger" style={{ height: 36, width: 'auto', maxWidth: 62, display: 'block' }} />
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: 4, height: 44, width: 70 }}>
                        <img src="/assets/img/pap.png" alt="PAP" style={{ height: 36, width: 'auto', maxWidth: 62, display: 'block' }} />
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: 4, height: 44, width: 70 }}>
                        <img src="/assets/img/linkedin.png" alt="LinkedIn" style={{ height: 36, width: 'auto', maxWidth: 62, display: 'block' }} />
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: 4, height: 44, width: 70 }}>
                        <img src="/assets/img/facebook.png" alt="Facebook" style={{ height: 36, width: 'auto', maxWidth: 62, display: 'block' }} />
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: 4, height: 44, width: 70 }}>
                        <img src="/assets/img/instagram.png" alt="Instagram" style={{ height: 36, width: 'auto', maxWidth: 62, display: 'block' }} />
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0, maxWidth: 420, width: '100%', boxSizing: 'border-box' }}>
                  <div style={{ width: 32, height: 32, background: '#976dd0', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', marginBottom: 12 }}>3</div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#976dd0', marginBottom: 6, fontSize: '1.1rem' }}>Sale or rent with ease on AnyHomes</div>
                    <div style={{
                      color: '#555',
                      fontSize: '1rem',
                      marginBottom: 12,
                      maxWidth: '100%',
                      width: '100%',
                      minWidth: 0,
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      overflowWrap: 'break-word',
                      boxSizing: 'border-box',
                      padding: 0,
                      margin: 0
                    }}>
                      Monitor scans and engagement from your dashboard. All leads are centralized for easy follow-up.
                    </div>
                    <div style={{ width: 'auto', maxWidth: '100%', minWidth: 0, marginTop: 12, position: 'relative', padding: 0, marginLeft: 0, display: 'block' }}>
                      <img 
                        src="/assets/img/Chill.jpeg"
                        alt="Chill"
                        id="chill-img"
                        style={{ width: 'auto', height: 'auto', objectFit: 'contain', display: 'block', marginLeft: 0, padding: 0, borderRadius: '8px !important' }}
                        onLoad={syncChillHeight}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Espace réservé même si explainer masqué */}
            {!showExplainer && <div style={{marginBottom: 40}} />}
            {/* Titre au-dessus du tableau */}
            <div style={{ margin: '40px 0 16px 0' }}>
              <span style={{ fontWeight: 700, color: '#111', fontSize: '1.5rem', display: 'block' }}>
                {t('manageQRCodes', 'Gérer mes QR Codes')}
              </span>
            </div>
            {/* Zone de recherche juste au-dessus du tableau */}
            <div style={{ marginBottom: 24, maxWidth: 420 }}>
              <label htmlFor="search-property" style={{ display: 'block', fontWeight: 500, color: '#444', marginBottom: 8 }}>
                {t('searchProperty', 'Rechercher un bien')}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="search-property"
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={t('searchPlaceholder', 'Entrez un nom de bien ou une localisation')}
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 14px',
                    borderRadius: 10,
                    border: '1px solid #bbb',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                {search && (
                  <button
                    type="button"
                    aria-label={t('clear', 'Effacer')}
                    onClick={() => setSearch("")}
                    style={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      margin: 0,
                      cursor: 'pointer',
                      color: '#aaa',
                      fontSize: 22,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FiX />
                  </button>
                )}
              </div>
            </div>
            <div>
              <Table
                data={paginatedData}
                columns={columns}
                total={filteredData.length}
                page={page}
                count={pageSize}
                result={handleTableChange}
                nodata={t('common.noResults', 'Aucun résultat trouvé')}
                className="overflow-x-auto"
              />
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export default QRCodeManagement;
