import * as React from 'react';
import Map, {NavigationControl, Source, Layer} from 'react-map-gl';
import Navbar from './components/navbar.js';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';

// Removed import for local femaData

// Define a style for the GeoJSON layer (keeping the same style for now)
const femaLayerStyle = {
  id: 'fema-disaster-areas',
  type: 'fill',
  paint: {
    'fill-color': '#088',
    'fill-opacity': 0.5,
    'fill-outline-color': '#000'
  }
};

// URL for FEMA DR-4683-CA Public Assistance Designated Areas GeoJSON
const femaDataSourceUrl = 'https://services.arcgis.com/aJ16ENn1AaqMqGPp/arcgis/rest/services/Designated_Counties_Public_Assistance_DR4683_CA_v1/FeatureServer/0/query?where=1%3D1&outFields=*&f=geojson';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Map mapLib={maplibregl} 
        initialViewState={{
          longitude: -122.4194, // San Francisco longitude
          latitude: 37.7749,  // San Francisco latitude
          zoom: 7            // Slightly zoomed out to see more of the Bay Area
        }}
        style={{width: "100%", height: " calc(100vh - 77px)"}}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.REACT_APP_MAPTILER_API_KEY}`}
      >
        <NavigationControl position="top-left" />
        {/* Updated Source to use the FEMA URL */}
        <Source id="fema-data-source" type="geojson" data={femaDataSourceUrl}>
          <Layer {...femaLayerStyle} />
        </Source>
      </Map>
    </div>
  );
}

export default App;
