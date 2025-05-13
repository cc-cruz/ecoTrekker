import React from 'react';
import { useLayers } from '../contexts/LayerContext.js'; // To get toggleLayerVisibility and activeLayerIds
import './OnMapLayerToggles.css';

const OnMapLayerToggles = ({ allLayers, targetCategory }) => {
  const { activeLayerIds, toggleLayerVisibility } = useLayers();

  if (!targetCategory) {
    return null; // Don't render anything if no category is selected
  }

  const layersToShow = allLayers.filter(layer => layer.category === targetCategory);

  if (layersToShow.length === 0) {
    return (
      <div className="on-map-layer-toggles-panel">
        <p>No layers in "{targetCategory}" or category not found.</p>
      </div>
    );
  }

  return (
    <div className="on-map-layer-toggles-panel">
      <h4>{targetCategory} Toggles</h4>
      {layersToShow.map(layer => (
        <div key={layer.id} className="on-map-toggle-item">
          <span className="on-map-toggle-name">{layer.name}</span>
          <label className="eco-custom-toggle-switch">
            <input
              type="checkbox"
              checked={activeLayerIds.includes(layer.id)}
              onChange={() => toggleLayerVisibility(layer.id)}
            />
            <span className="eco-custom-toggle-slider"></span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default OnMapLayerToggles; 