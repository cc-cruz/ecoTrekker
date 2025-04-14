import * as React from 'react';
import { useState } from 'react';
import Map, { NavigationControl } from 'react-map-gl';
import Navbar from './components/navbar.js';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';
import SearchBar from './SearchBar';

function App() {
  const [searchText, setSearchText] = useState('');
  const [mapCoords, setMapCoords] = useState({
    longitude: 16.62662018,
    latitude: 49.2125578,
  });

  const mapRef = React.useRef();

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
          zoom: 14,
        }}
        onMove={evt => setMapCoords(evt.viewState)}
        style={{ width: '100%', height: 'calc(100vh - 77px)' }}
        mapStyle="https://api.maptiler.com/maps/streets/style.json?key=75moNiurc2CUnRkxHPZJ"
      >
        <NavigationControl position="top-left" />
      </Map>
    </div>
  );
}

export default App;