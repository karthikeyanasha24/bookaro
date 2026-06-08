import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import environment from '../../../environment';

let googleMapsPromise = null;
function loadGoogleMaps(apiKey) {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.google && window.google.maps && window.google.maps.places) {
    return Promise.resolve(window.google);
  }
  if (googleMapsPromise) return googleMapsPromise;
  if (!apiKey) return Promise.resolve(null);
  googleMapsPromise = new Promise((resolve) => {
    const existing = document.querySelector('script[data-google-maps]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google));
      existing.addEventListener('error', () => resolve(null));
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=fr`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = 'true';
    script.onload = () => resolve(window.google);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
  return googleMapsPromise;
}

export default function CityAutocomplete({ value = '', onChange, onSelect, placeholder = 'Ville ou code postal', className = '', id, disabled = false }) {
  const inputRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const sessionTokenRef = useRef(null);
  const serviceRef = useRef(null);
  const placesServiceRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    loadGoogleMaps(environment?.map_api_key).then((g) => {
      if (!mounted || !g) return;
      try {
        serviceRef.current = new g.maps.places.AutocompleteService();
        placesServiceRef.current = new g.maps.places.PlacesService(document.createElement('div'));
        sessionTokenRef.current = new g.maps.places.AutocompleteSessionToken();
        setReady(true);
      } catch { /* ignore */ }
    });
    return () => { mounted = false; };
  }, []);

  const updateDropdownStyle = () => {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    setDropdownStyle({
      left: rect.left,
      top: rect.bottom,
      width: rect.width,
      maxHeight: 220,
    });
  };

  const handleInput = (e) => {
    const text = e.target.value;
    if (typeof onChange === 'function') onChange(text);
    if (!ready || !serviceRef.current || !text) {
      setPredictions([]); setOpen(false); return;
    }
    updateDropdownStyle();
    serviceRef.current.getPlacePredictions(
      {
        input: text,
        sessionToken: sessionTokenRef.current,
        componentRestrictions: { country: ['fr'] },
      },
      (preds) => {
        setPredictions(preds || []);
        setOpen(Boolean(preds && preds.length));
      }
    );
  };

  const handlePick = (pred) => {
    setOpen(false);
    if (typeof onChange === 'function') onChange(pred.description || pred.structured_formatting?.main_text || '');
    if (!placesServiceRef.current) {
      if (typeof onSelect === 'function') onSelect({ city: pred.description, postalCode: '', formatted: pred.description });
      return;
    }
    placesServiceRef.current.getDetails(
      { placeId: pred.place_id, fields: ['address_components', 'geometry', 'formatted_address'], sessionToken: sessionTokenRef.current },
      (place) => {
        if (typeof onSelect === 'function') {
          let city = '';
          let postalCode = '';
          (place?.address_components || []).forEach(c => {
            if (c.types.includes('locality')) city = c.long_name;
            if (c.types.includes('postal_code')) postalCode = c.long_name;
          });
          onSelect({
            city: city || pred.structured_formatting?.main_text || pred.description,
            postalCode,
            formatted: place?.formatted_address || pred.description,
            lat: place?.geometry?.location?.lat?.(),
            lng: place?.geometry?.location?.lng?.(),            rawPlace: place,          });
        }
      }
    );
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        id={id}
        type="text"
        autoComplete="off"
        value={value}
        onChange={handleInput}
        onFocus={() => {
          updateDropdownStyle();
          predictions.length && setOpen(true);
        }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
      />
      {open && predictions.length > 0 && createPortal(
        <div
          style={{
            position: 'fixed',
            left: dropdownStyle.left,
            top: dropdownStyle.top,
            width: dropdownStyle.width,
            maxHeight: dropdownStyle.maxHeight,
            zIndex: 10000,
          }}
          className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-y-auto"
        >
          {predictions.map(p => (
            <button
              key={p.place_id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handlePick(p)}
              className="w-full text-left px-3 py-2 text-[13px] text-[#47525E] hover:bg-[#f3f5f9] hover:text-[#976DD0] transition-colors border-b border-gray-50 last:border-b-0"
            >
              <div className="font-medium">{p.structured_formatting?.main_text || p.description}</div>
              {p.structured_formatting?.secondary_text && (
                <div className="text-[11px] text-gray-400">{p.structured_formatting.secondary_text}</div>
              )}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}
