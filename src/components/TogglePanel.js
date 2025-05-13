import React, { useState } from 'react';
import { useLayers } from '../contexts/LayerContext.js';
import './TogglePanel.css'; // Assuming we'll create this for styling

// Helper function to group layers by category
const groupLayersByCategory = (layers) => {
  return layers.reduce((groups, layer) => {
    const category = layer.category || 'Uncategorized'; // Default category
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(layer);
    return groups;
  }, {});
};

const TogglePanel = ({ setCategoryForOnMapToggles }) => {
  const { allLayers, activeLayerIds, toggleLayerVisibility } = useLayers();
  const [expandedCategories, setExpandedCategories] = useState({});

  const groupedLayers = groupLayersByCategory(allLayers);

  const handleCategoryToggle = (categoryName) => {
    const isCurrentlyExpanded = !!expandedCategories[categoryName];
    
    // For the accordion behavior itself (multiple can be open)
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !isCurrentlyExpanded
    }));

    // For the on-map toggles (only one category at a time, or none)
    if (!isCurrentlyExpanded) { // If we are expanding this category
      setCategoryForOnMapToggles(categoryName);
    } else { // If we are collapsing this category
      // If the category being collapsed was the one for on-map toggles, clear it.
      // This logic assumes we might eventually want to decouple accordion state from on-map toggle state slightly
      // For now, if we collapse it, it is no longer the active one for on-map toggles.
      setCategoryForOnMapToggles(null); 
      // A more sophisticated approach might check if `categoryForOnMapToggles === categoryName` before setting to null
      // but for a POC where expanding one shows its toggles, this is simpler.
    }
  };

  return (
    <div className="eco-filter-frame-outer"> 
      <div className="eco-filter-frame-inner"> 
        <h2 className="eco-map-filter-title">Map Filter</h2>
        {/* Category accordions will go here in later steps */}
        {Object.entries(groupedLayers).map(([category, layers]) => (
          <div key={category} className="eco-category-accordion-section">
            <button
              type="button"
              className="eco-category-header"
              onClick={() => handleCategoryToggle(category)}
              aria-expanded={!!expandedCategories[category]}
              aria-controls={`category-content-${category.replace(/\s+/g, '-')}`}
            >
              <span className="eco-category-name">{category}</span>
              <span className="eco-info-icon eco-category-info-icon">
                {/* Placeholder for info icon, e.g., using react-icons or an SVG */}
                {/* Example: <FaInfoCircle /> */}
                i
              </span>
            </button>
            {/* Layer indicators will be conditionally rendered here in Phase 3 */}
            {expandedCategories[category] && (
              <div
                id={`category-content-${category.replace(/\s+/g, '-')}`}
                className="eco-indicator-list"
              >
                {layers.map((layer) => (
                  <div key={layer.id} className="eco-indicator-item">
                    {/* Layer Icon (from layers.json 'icon' field) */}
                    {layer.icon && (
                      <img src={process.env.PUBLIC_URL + layer.icon} alt="" className="eco-indicator-layer-icon" />
                    )}
                    <span className="eco-indicator-name">{layer.name}</span>
                    
                    <span className="eco-info-icon eco-indicator-info-icon">
                      {/* Placeholder for info icon */}
                      i
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TogglePanel; 