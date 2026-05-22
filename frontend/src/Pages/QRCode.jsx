import React from 'react';


const QRCodeManagement = () => {
  // TODO: intégration API et logique
  return (
    <div className="qr-page-container">
      {/* Header */}
      <div className="qr-header">
        <h1>QR Code management</h1>
        <p className="qr-desc">
          QR Code let you bring easily potential buyers or renters from other platforms, into your Bookaroo transaction pipeline to ease your transaction process.
        </p>
      </div>

      {/* How it works */}
      <div className="qr-how-it-works">
        <div className="qr-step">
          <div className="qr-step-number">1</div>
          <div>
            <div className="qr-step-title">Create your QR Code</div>
            <div className="qr-step-desc">Hit the button Generate a QR Code next to the property. It will generate a JPG poster including your property cover image. The poster will include the QR Code.</div>
            <img className="qr-step-img" src="/assets/img/qr-flyer-demo.jpg" alt="QR flyer demo" />
          </div>
        </div>
        <div className="qr-step">
          <div className="qr-step-number">2</div>
          <div>
            <div className="qr-step-title">Add your poster in other platforms</div>
            <div className="qr-step-desc">Enrich your property ad in other platforms by adding your JPG poster and your property profile URL. Potential leads will then see it in your ad, and will be able to visit your property profile on Bookaroo and engage conversation in your transaction monitoring tool.</div>
            <div className="qr-platforms">
              <img src="/assets/leboncoin.png" alt="Leboncoin" />
              <img src="/assets/seloger.png" alt="SeLoger" />
              <img src="/assets/pap.png" alt="PAP" />
              <img src="/assets/linkedin.png" alt="LinkedIn" />
              <img src="/assets/facebook.png" alt="Facebook" />
              <img src="/assets/instagram.png" alt="Instagram" />
            </div>
          </div>
        </div>
      </div>

      {/* Table placeholder */}
      <div className="qr-table-section">
        {/* Table and CTA logic to be implemented */}
        <div className="qr-table-placeholder">[Table of properties with QR Code actions will appear here]</div>
      </div>
    </div>
  );
};

export default QRCodeManagement;
