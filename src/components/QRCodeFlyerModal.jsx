import React, { useState, useEffect } from 'react';
import ApiClient from '../methods/api/apiClient';
import './QRCodeFlyerModal.local.css';

// Mock data for photos and social ratings
const mockPhotos = [
  '/assets/img/dashboard/attractivity/attractivity-1.jpg',
  '/assets/img/dashboard/attractivity/attractivity-2.jpg',
  '/assets/img/dashboard/attractivity/attractivity-3.jpg',
];
const mockRatings = [
  { type: 'Airbnb', value: 4.8 },
  { type: 'Booking', value: 4.6 },
];

const socialOptions = [
  { key: 'likes', label: 'Likes' },
  { key: 'views', label: 'Vues du profil' },
  { key: 'shares', label: 'Partage du profil' },
  { key: 'followers', label: 'Followers' },
  { key: 'sollicitations', label: 'Sollicitations reçues' },
  { key: 'p2p', label: 'Estimations P2P' },
  { key: 'renov', label: 'Rénovation réalisées' },
  { key: 'rent', label: 'Revenu locatif annuel' },
];

export default function QRCodeFlyerModal({ open, onClose, selectedProperty, onSuccess }) {
  // Empêche le scroll du body quand la modale est ouverte
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [checked, setChecked] = useState({});
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleCheck = (key) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const handleRatingToggle = (type) => {
    setSelectedRatings((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const selectedMetrics = Object.keys(checked).filter((key) => checked[key]);
  const photoList = selectedProperty?.availablePhotos?.length ? selectedProperty.availablePhotos : mockPhotos.map((url, idx) => ({ id: url, url }));
  const canGenerate = !!selectedPhoto && !!selectedProperty;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);
    try {
      const payload = {
        propertyId: selectedProperty.propertyId,
        selectedPhotoId: selectedPhoto,
        selectedMetrics,
      };
      const response = await ApiClient.post('/property/qr-code/flyers', payload);
      if (response.success) {
        setSuccessMessage('Flyer généré avec succès.');
        if (typeof onSuccess === 'function') {
          onSuccess(response.data);
        }
      } else {
        setErrorMessage(response.message || 'Erreur lors de la génération');
      }
    } catch (err) {
      setErrorMessage(err?.message || 'Erreur réseau');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  // Overlay click handler (close if click outside modal)
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('qrflyer-modal-overlay')) {
      onClose();
    }
  };

  return (
    <div className="qrflyer-modal-overlay" onClick={handleOverlayClick}>
      <div className="qrflyer-modal-container">
        {/* Close (X) button */}
        <button
          className="qrflyer-modal-close"
          aria-label="Fermer"
          onClick={onClose}
        >
          ×
        </button>
        {/* Left: Params */}
        <div className="qrflyer-modal-left" style={{display: 'flex', flexDirection: 'column', height: '100%', position: 'relative'}}>
          <h2 className="qrflyer-modal-title">Créer un QR Code / Flyer</h2>
          {/* Carousel */}
          <div className="qrflyer-carousel-caption">Sélectionnez une photo pour le flyer</div>
          <div className="qrflyer-carousel">
            {photoList.map((photo, idx) => {
              const photoId = typeof photo === 'string' ? photo : photo.id || photo.url || String(idx);
              const photoUrl = typeof photo === 'string' ? photo : photo.url;
              return (
                <div
                  key={photoId}
                  className={`qrflyer-carousel-imgwrap${selectedPhoto === photoId ? ' selected' : ''}`}
                  onClick={() => setSelectedPhoto(photoId)}
                >
                  <img src={photoUrl} alt={`photo-${idx + 1}`} />
                </div>
              );
            })}
          </div>
          {/* Social data checkboxes */}
          <div className="qrflyer-checkboxes qrflyer-checkboxes-2col">
            <div className="qrflyer-checkboxes-title">Données à afficher :</div>
            <div className="qrflyer-checkboxes-cols">
              {(() => {
                const mockValues = {
                  likes: 123,
                  views: 4567,
                  shares: 89,
                  followers: 321,
                  sollicitations: 12,
                  p2p: 7,
                  renov: '15 000 €',
                  rent: '12 000 €',
                };
                const col1 = socialOptions.slice(0, 4);
                const col2 = socialOptions.slice(4, 8);
                return [col1, col2].map((col, idx) => (
                  <div className="qrflyer-checkbox-col" key={idx}>
                    {col.map(opt => (
                      <label key={opt.key} className="qrflyer-checkbox-label">
                        <input
                          type="checkbox"
                          checked={!!checked[opt.key]}
                          onChange={() => handleCheck(opt.key)}
                          style={{marginRight: 8}}
                        />
                        <span className="qrflyer-checkbox-label-text">{opt.label}</span>
                        <span className="qrflyer-checkbox-value">
                          {mockValues[opt.key] !== undefined ? mockValues[opt.key] : ''}
                        </span>
                      </label>
                    ))}
                  </div>
                ));
              })()}
            </div>
          </div>
          {/* Social ratings */}
          <div className="qrflyer-ratings">
            <div className="qrflyer-checkboxes-title">Social rating :</div>
            {mockRatings.map(r => (
              <label key={r.type} className="qrflyer-checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedRatings.includes(r.type)}
                  onChange={() => handleRatingToggle(r.type)}
                />
                {r.type} ({r.value})
              </label>
            ))}
          </div>
        </div>
        {/* Sticky action bar en dehors de la colonne scrollable */}
        <div className="qrflyer-modal-actions-fixed">
          <button
            className="qrflyer-btn qrflyer-btn-cancel"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="qrflyer-btn qrflyer-btn-generate"
            disabled={!canGenerate || isSubmitting}
            onClick={handleGenerate}
            style={{
              opacity: canGenerate ? 1 : 0.5,
              cursor: canGenerate ? 'pointer' : 'not-allowed',
            }}
          >
            {isSubmitting ? 'Génération...' : 'Générer le flyer'}
          </button>
        </div>
        {errorMessage && <div className="qrflyer-error-message">{errorMessage}</div>}
        {successMessage && <div className="qrflyer-success-message">{successMessage}</div>}
      </div>
    </div>
  );
}
