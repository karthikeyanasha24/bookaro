import React, { useMemo } from 'react';
import { FiDownload, FiTrash } from 'react-icons/fi';
import PageLayout from '../components/global/PageLayout';
import Table from '../components/Table';
import './QRCodeManagement.css';

const QRCodeManagement = () => {
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
      flyer: '/assets/img/flyer-demo2.jpg',
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
      flyer: '/assets/img/flyer-demo2.jpg',
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
              className="followed-news-property-image"
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
      render: (row) => <img src={row.flyer} alt="Flyer" style={{ width: 60, borderRadius: 6 }} />, 
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
      <section className="dashboard-page">
        <div className="dashboard-container">
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: 8, color: '#222' }}>QR Code management</h1>
          <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: 32 }}>
            QR Code let you bring easily potential buyers or renters from other platforms, into your Bookaroo transaction pipeline to ease your transaction process.
          </p>

          <div style={{ display: 'flex', gap: 32, background: '#f8f9fb', borderRadius: 16, padding: '32px 24px', marginBottom: 40, justifyContent: 'space-between' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
              <div style={{ width: 32, height: 32, background: '#976dd0', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', marginBottom: 12 }}>1</div>
              <div>
                <div style={{ fontWeight: 600, color: '#976dd0', marginBottom: 6, fontSize: '1.1rem' }}>Create your QR Code</div>
                <div style={{ color: '#555', fontSize: '1rem', marginBottom: 12 }}>Generate a QR Code for your property. The poster will include your property cover image and the QR Code.</div>
                <img style={{ width: 80, borderRadius: 8 }} src="/assets/img/flyer-demo2.jpg" alt="QR flyer demo" />
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
              <div style={{ width: 32, height: 32, background: '#976dd0', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', marginBottom: 12 }}>2</div>
              <div>
                <div style={{ fontWeight: 600, color: '#976dd0', marginBottom: 6, fontSize: '1.1rem' }}>Share on platforms</div>
                <div style={{ color: '#555', fontSize: '1rem', marginBottom: 12 }}>Add your poster and property profile URL to other platforms. Leads can scan and visit your Bookaroo profile.</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <img src="/assets/leboncoin.png" alt="Leboncoin" style={{ width: 28 }} />
                  <img src="/assets/seloger.png" alt="SeLoger" style={{ width: 28 }} />
                  <img src="/assets/pap.png" alt="PAP" style={{ width: 28 }} />
                  <img src="/assets/linkedin.png" alt="LinkedIn" style={{ width: 28 }} />
                  <img src="/assets/facebook.png" alt="Facebook" style={{ width: 28 }} />
                  <img src="/assets/instagram.png" alt="Instagram" style={{ width: 28 }} />
                </div>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
              <div style={{ width: 32, height: 32, background: '#976dd0', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', marginBottom: 12 }}>3</div>
              <div>
                <div style={{ fontWeight: 600, color: '#976dd0', marginBottom: 6, fontSize: '1.1rem' }}>Track your leads</div>
                <div style={{ color: '#555', fontSize: '1rem', marginBottom: 12 }}>Monitor scans and engagement from your dashboard. All leads are centralized for easy follow-up.</div>
              </div>
            </div>
          </div>

          <Table
            data={data}
            columns={columns}
            total={data.length}
            nodata="No properties found"
            className="overflow-x-auto"
          />
        </div>
      </section>
    </PageLayout>
  );
};

export default QRCodeManagement;
