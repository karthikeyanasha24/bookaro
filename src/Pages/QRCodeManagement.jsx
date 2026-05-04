
import React, { useMemo, useEffect, useState } from 'react';
import { FiDownload, FiTrash } from 'react-icons/fi';
import PageLayout from '../components/global/PageLayout';
import Table from '../components/Table';
const QRCodeManagement = () => {
  // Modale viewer
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerImg, setViewerImg] = useState(null);

  // Synchronise la hauteur de Chill avec celle du flyer sans déformation
  useEffect(() => {
    const flyer = document.getElementById('flyer-demo-img');
    const chill = document.getElementById('chill-img');
    if (flyer && chill) {
      chill.style.maxHeight = flyer.clientHeight + 'px';
    }
  }, []);
  // Demo data for table
  const data = useMemo(() => [
    {
      id: 1,
      property: {
        title: 'Maison familiale',
        status: 'À vendre',
        rooms: 5,
        surface: 110,
        location: '75018 Paris',
        imageUrl: '/assets/img/dashboard/attractivity/attractivity-1.jpg',
      },
      flyer: '/assets/img/flyer-demo2.jpeg',
      scanCount: 12,
      lastScan: '2024-04-10',
    },
    {
      id: 2,
      property: {
        title: 'Appartement lumineux',
        status: 'Off-market',
        rooms: 3,
        surface: 64,
        location: '69003 Lyon',
        imageUrl: '/assets/img/dashboard/attractivity/attractivity-2.jpg',
      },
      flyer: '/assets/img/flyer-demo2.jpeg',
      scanCount: 7,
      lastScan: '2024-04-09',
    },
  ], []);

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
      ),
    },
    {
      key: 'scanCount',
      name: 'Scan Count',
      render: (row) => row.scanCount,
    },
    {
      key: 'lastScan',
      name: 'Dernier scan',
      render: (row) => row.lastScan,
    },
    {
      key: 'actions',
      name: 'Actions',
      render: (row) => (
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
      ),
    },
  ];

  return (
    <PageLayout>
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

            <div style={{ display: 'flex', gap: 32, background: '#f8f9fb', borderRadius: 16, padding: '32px 32px', justifyContent: 'space-between', flexWrap: 'wrap', overflow: 'hidden', boxSizing: 'border-box' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0, maxWidth: 420, width: '100%', boxSizing: 'border-box', padding: 0 }}>
                <div style={{ width: 32, height: 32, background: '#976dd0', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', marginBottom: 12 }}>1</div>
                <div>
                  <div style={{ fontWeight: 600, color: '#976dd0', marginBottom: 6, fontSize: '1.1rem' }}>Create your QR Code</div>
                  <div style={{ color: '#555', fontSize: '1rem', marginBottom: 12 }}>Generate a QR Code for your property. The poster will include your property cover image and the QR Code.</div>
                  <img
                    id="flyer-demo-img"
                    style={{ width: 500, borderRadius: 8, maxWidth: '100%', height: 'auto', border: '2px solid #976dd0', cursor: 'pointer' }}
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
                  <div style={{ fontWeight: 600, color: '#976dd0', marginBottom: 6, fontSize: '1.1rem' }}>Share on platforms</div>
                  <div style={{ color: '#555', fontSize: '1rem', marginBottom: 12 }}>Add your poster and property profile URL to other platforms. Leads can scan and visit your Bookaroo profile.</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, rowGap: 12, justifyContent: 'flex-start', maxWidth: 260 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 10, boxShadow: '0 1px 4px #0001', padding: 4, height: 44, width: 70 }}>
                      <img src="/assets/img/leboncoin.png" alt="Leboncoin" style={{ height: 36, width: 'auto', maxWidth: 62, display: 'block' }} />
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 10, boxShadow: '0 1px 4px #0001', padding: 4, height: 44, width: 70 }}>
                      <img src="/assets/img/seloger.png" alt="SeLoger" style={{ height: 36, width: 'auto', maxWidth: 62, display: 'block' }} />
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 10, boxShadow: '0 1px 4px #0001', padding: 4, height: 44, width: 70 }}>
                      <img src="/assets/img/pap.png" alt="PAP" style={{ height: 36, width: 'auto', maxWidth: 62, display: 'block' }} />
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 10, boxShadow: '0 1px 4px #0001', padding: 4, height: 44, width: 70 }}>
                      <img src="/assets/img/linkedin.png" alt="LinkedIn" style={{ height: 36, width: 'auto', maxWidth: 62, display: 'block' }} />
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 10, boxShadow: '0 1px 4px #0001', padding: 4, height: 44, width: 70 }}>
                      <img src="/assets/img/facebook.png" alt="Facebook" style={{ height: 36, width: 'auto', maxWidth: 62, display: 'block' }} />
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 10, boxShadow: '0 1px 4px #0001', padding: 4, height: 44, width: 70 }}>
                      <img src="/assets/img/instagram.png" alt="Instagram" style={{ height: 36, width: 'auto', maxWidth: 62, display: 'block' }} />
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0, maxWidth: 420, width: '100%', boxSizing: 'border-box' }}>
                <div style={{ width: 32, height: 32, background: '#976dd0', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', marginBottom: 12 }}>3</div>
                <div>
                  <div style={{ fontWeight: 600, color: '#976dd0', marginBottom: 6, fontSize: '1.1rem' }}>Track your leads</div>
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
                  <div style={{ width: 'auto', maxWidth: '100%', minWidth: 0, marginTop: 12, position: 'relative', padding: 0, marginLeft: 0, display: 'block', alignSelf: 'flex-start' }}>
                    <img 
                      src="/assets/img/Chill.jpeg"
                      alt="Chill"
                      id="chill-img"
                      style={{ width: 266, height: 'auto', borderRadius: 10.56, objectFit: 'contain', display: 'block', marginLeft: 0, padding: 0, alignSelf: 'flex-start' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Table
              data={data}
              columns={columns}
              total={data.length}
              nodata="No properties found"
              className="overflow-x-auto"
            />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export default QRCodeManagement;
