import React from 'react';
import Map, { NavigationControl } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

function MapView({ mapCoords }) {
  return (
    <Map
      mapLib={maplibregl}
      initialViewState={{
        longitude: mapCoords.longitude,
        latitude: mapCoords.latitude,
        zoom: 14,
      }}
      style={{ width: '100%', height: 'calc(100vh - 77px)' }}
      mapStyle="https://api.maptiler.com/maps/streets/style.json?key=YOUR_MAPTILER_API_KEY"
    >
      <NavigationControl position="top-left" />
    </Map>
  );
}

export default MapView;
