import React from 'react';

function SearchBar({ searchText, setSearchText, setMapCoords, mapRef }) {
  function handleSearch() {

    console.log('Search button clicked!');
    const apiKey = '75moNiurc2CUnRkxHPZJ'; // 🔑 Replace with your real API key!
    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(searchText)}.json?key=${apiKey}`;
    
    
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log('Geocoding result:', data); // ← ADD THIS
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          setMapCoords({ longitude: lng, latitude: lat });
          if (mapRef && mapRef.current) {
            console.log('MapRef is valid:', mapRef.current);
            mapRef.current.flyTo({
              center: [lng, lat],
              zoom: 14,
              speed: 1.2,
            });
          } else {
            console.warn('mapRef is missing or null');
          }
        } else {
          alert('Location not found.');
        }
      })
      .catch((err) => {
        console.error('Geocoding error:', err);
      });
  }
    

  return (
    <div
    style={{
      position: 'absolute',
      top: '100px',
      left: '100px',
      zIndex: 1000,
      backgroundColor: 'white',
      padding: '1rem',
      borderRadius: '8px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    }}
  >
      <input
        type="text"
        placeholder="Enter an address"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{
          padding: '0.5rem',
          width: '300px',
          fontSize: '1rem',
          marginRight: '0.5rem',
        }}
      />
      <button
        onClick={handleSearch}
        style={{ padding: '0.5rem', fontSize: '1rem' }}
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;