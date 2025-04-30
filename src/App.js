import * as React from 'react';
import { useState, useRef } from 'react';
import Map, {NavigationControl, Source, Layer} from 'react-map-gl';
import Navbar from './components/navbar.js';
import MapFilterPanel from './components/MapFilterPanel';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';
import { LayerProvider, useLayers } from './contexts/LayerContext.js';
import DynamicLegend from './components/DynamicLegend';

// Define Geoff's required map style URL
const GEOFF_MAP_STYLE_URL = 'https://api.maptiler.com/maps/019684ce-bf99-76e5-a986-319c7bdeb2ab/style.json?key=2aydo59FoTATDd9gbc2J';

// Removed dynamic availableMapStyles and related constants

function AppContent() {
  // State for search and map view control
  const [searchText, setSearchText] = useState('');
  const [mapCoords, setMapCoords] = useState({
    longitude: -119.5, // Keep desired initial CA longitude
    latitude: 37.0,    // Keep desired initial CA latitude
    zoom: 5            // Keep desired initial zoom
  });

  // Removed mapStyleUrl state

  // Map ref
  const mapRef = useRef();

  // Get layer state from context
  const { allLayers, activeLayerIds } = useLayers();

  // Filter to get only the active layer configurations
  const activeLayers = allLayers.filter(layer => activeLayerIds.includes(layer.id));

  return (
    <div className="App">
      <Navbar />
      <MapFilterPanel
        // Props for SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        setMapCoords={setMapCoords}
        mapRef={mapRef}
        // Removed props for Map Style Toggle
      />
      <Map
        ref={mapRef}
        mapLib={maplibregl}
        padding={{ left: 370 }} // Keep padding if MapFilterPanel is visible on left
        initialViewState={{
          longitude: mapCoords.longitude,
          latitude: mapCoords.latitude,
          zoom: mapCoords.zoom
        }}
        pitchWithRotate={0}
        onMove={evt => setMapCoords(evt.viewState)}
        style={{width: "100%", height: " calc(100vh - 77px)"}}
        mapStyle={GEOFF_MAP_STYLE_URL} // Use Geoff's hardcoded style URL
      >
        <NavigationControl position="top-right" />

        {/* Dynamically render Sources and Layers for active layers */}
        {activeLayers.map(layer => {
          let sourceData;
          if (layer.source.type === 'geojson_url') {
            sourceData = layer.source.location;
          } else if (layer.source.type === 'geojson_file') {
            console.warn(`Loading local geojson_file (${layer.source.location}) is not fully implemented yet.`);
            sourceData = null; // Prevent rendering for now
          } else {
             console.warn(`Unsupported source type: ${layer.source.type} for layer ${layer.id}`);
             sourceData = null;
          }

          if (!sourceData) return null;

          const sourceId = `${layer.id}-source`;
          const layerId = layer.id;
          const layerStyle = {
            id: layerId,
            type: layer.layerConfig.type,
            source: sourceId,
            layout: layer.layerConfig.layout || {},
            paint: layer.layerConfig.paint || {},
            ...(layer.layerConfig.filter && { filter: layer.layerConfig.filter }),
            ...(layer.layerConfig['source-layer'] && { 'source-layer': layer.layerConfig['source-layer'] })
          };

          return (
            <Source key={sourceId} id={sourceId} type="geojson" data={sourceData}>
              <Layer {...layerStyle} />
            </Source>
          );
        })}
      </Map>
      <DynamicLegend />
    </div>
  );
}

// Main App component now just sets up the Provider
function App() {
  return (
    <LayerProvider>
      <AppContent />
    </LayerProvider>
  );
}

export default App;