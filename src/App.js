import * as React from 'react';
import { useState, useRef } from 'react';
import Map, {NavigationControl, Source, Layer} from 'react-map-gl';
import Navbar from './components/navbar.js';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';
import SearchBar from './SearchBar';

// Import the local FEMA California GeoJSON data
import femaDataFl from './data/fema_ca_local_data.geojson'; // Using the renamed CA file

// Define a style for the GeoJSON layer
const femaLayerStyle = {
  id: 'fema-disaster-areas-fl', // Unique ID for Florida layer
  type: 'fill',
  paint: {
    'fill-color': '#088',
    'fill-opacity': 0.5,
    'fill-outline-color': '#000'
  }
};

// Removed test URL
// const testDataSourceUrl = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';

function App() {
  // State from Paula for search and map view control
  const [searchText, setSearchText] = useState('');
  const [mapCoords, setMapCoords] = useState({
    longitude: -119.5, // Your initial CA longitude
    latitude: 37.0,    // Your initial CA latitude
    zoom: 5            // Your initial zoom
  });

  // Map ref from Paula
  const mapRef = useRef();

  /*
   * MERGE NOTE (carson & paula): 
   * A merge conflict occurred here between carson (FEMA layer) and origin/paula (search bar).
   * Resolution:
   * - Kept Paula's state management approach for map view (mapCoords, setMapCoords via onMove, mapRef).
   * - Initialized mapCoords state to Carson's desired California view.
   * - Added Paula's SearchBar component.
   * - Updated Map component props to use mapRef, mapCoords state, and onMove callback.
   * - Ensured MapTiler API key uses process.env.REACT_APP_MAPTILER_API_KEY (from Carson) instead of hardcoded key.
   * - Kept Carson's FEMA Source/Layer components.
  */

  return (
    <div className="App">
      <Navbar />
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        setMapCoords={setMapCoords}
        mapRef={mapRef}
      />
      <Map
        ref={mapRef}
        mapLib={maplibregl}
        initialViewState={{
          longitude: mapCoords.longitude,
          latitude: mapCoords.latitude,
          zoom: mapCoords.zoom
        }}
        onMove={evt => setMapCoords(evt.viewState)}
        style={{width: "100%", height: " calc(100vh - 77px)"}}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.REACT_APP_MAPTILER_API_KEY}`}
      >
        <NavigationControl position="top-left" />
        {/* Removed Test Source/Layer */}

        {/* Add Source and Layer for local FEMA FL data (which contains CA coords) */}
        <Source id="fema-fl-pa-source" type="geojson" data={femaDataFl}>
          <Layer {...femaLayerStyle} /> 
        </Source>
      </Map>
    </div>
  );
}

export default App;