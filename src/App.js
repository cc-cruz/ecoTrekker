import * as React from 'react';
import Map, {NavigationControl, Source, Layer} from 'react-map-gl';
import Navbar from './components/navbar.js';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';

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
  return (
    <div className="App">
      <Navbar/>
      <Map mapLib={maplibregl} 
        initialViewState={{
          longitude: -119.5, // Central California longitude
          latitude: 37.0,    // Central California latitude
          zoom: 5            // Zoomed out to see most of California
        }}
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
