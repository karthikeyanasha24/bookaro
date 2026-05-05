import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useState } from 'react';
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

// Default icon setup for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const containerStyle = {
  width: '100%',
  height: '700px',
};

const createCustomIcon = (iconUrl, isHovered) => L.divIcon({
  html: `
    <div class="custom-marker ${isHovered ? 'hovered' : ''}">
      <img src="${iconUrl}" alt="marker" />
    </div>
  `,
  className: 'custom-marker',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function FitBounds({ locations }) {
  const map = useMap();
  
  useEffect(() => {
    if (map && locations?.length > 0) {
      const bounds = L.latLngBounds(locations.map((loc) => [loc.lat, loc.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
      
      // Add a small delay to ensure the map is fully rendered
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, [locations, map]);

  return null;
}

function CustomMap({ locations, focusLoc, hoveredLocation, radius }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    setSelectedLocation(null);
  }, [hoveredLocation]);

  // Handle map initialization and resizing
  useEffect(() => {
    if (mapRef.current) {
      const handleResize = () => {
        mapRef.current.invalidateSize();
      };

      // Initial invalidation after a short delay
      const timer = setTimeout(() => {
        handleResize();
        setMapReady(true);
      }, 300);

      // Add resize listener
      window.addEventListener('resize', handleResize);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return (
    <div style={containerStyle}>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={6}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={true}
        maxZoom={18}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {mapReady && locations?.map((location, index) => (
          location.exactLocation ? (
            <Marker
              key={index}
              position={[location.lat, location.lng]}
              icon={createCustomIcon(
                location.icon,
                hoveredLocation?.lat === location.lat && 
                hoveredLocation?.lng === location.lng
              )}
              eventHandlers={{
                click: () => setSelectedLocation(location),
              }}
            />
          ) : (
            <Circle
              key={index}
              center={[location.lat, location.lng]}
              radius={radius || (locations.length > 1 ? 500 : 120)}
              color="blue"
              fillColor="blue"
              fillOpacity={0.3}
              weight={3}
              eventHandlers={{
                click: () => setSelectedLocation(location),
              }}
            />
          )
        ))}

        {selectedLocation && (
          <Popup
            position={[selectedLocation.lat, selectedLocation.lng]}
            onClose={() => setSelectedLocation(null)}
          >
            <div>
              <h2>Location Info:</h2>
              <p>{selectedLocation.info}</p>
            </div>
          </Popup>
        )}

        {locations && locations.length > 0 && <FitBounds locations={locations} />}
      </MapContainer>
    </div>
  );
}

export default React.memo(CustomMap);