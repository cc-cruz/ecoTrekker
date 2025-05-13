import React from 'react';
// import MapStyleToggle from './toggles/MapStyleToggle'; // Removed MapStyleToggle import
import SearchBar from '../SearchBar'; // Import SearchBar (adjust path if needed)
import TogglePanel from './TogglePanel'; // Import the new TogglePanel
import './MapFilterPanel.css'; // Import the CSS

/**
 * Panel component to hold map filter/toggle controls and search.
 *
 * Props:
 *  // SearchBar Props
 *  - searchText, setSearchText, setMapCoords, mapRef
 *  // Map Style Toggle Props - REMOVED
 */
function MapFilterPanel({ 
  // SearchBar Props
  searchText, 
  setSearchText, 
  setMapCoords, 
  mapRef,
  // New prop for TogglePanel
  setCategoryForOnMapToggles 
}) {
  return (
    <div className="map-filter-panel">
      {/* Render SearchBar at the top */}
      <SearchBar 
        searchText={searchText}
        setSearchText={setSearchText}
        setMapCoords={setMapCoords}
        mapRef={mapRef}
      />
      
      {/* Render the new TogglePanel for data layers */}
      <TogglePanel setCategoryForOnMapToggles={setCategoryForOnMapToggles} />

      {/* Removed the Map Style Toggle section */}

      {/* Add more filter sections (e.g., categories) here later */}
    </div>
  );
}

export default MapFilterPanel; 