import React from 'react';
import { FaLayerGroup } from 'react-icons/fa';
import './LayerToggle.css';

/**
 * Component to render a switch-like toggle for map layer visibility.
 *
 * Props:
 *  - layerId (string): Unique identifier for the layer.
 *  - label (string): Text label to display next to the toggle.
 *  - description (string): Text for the tooltip.
 *  - isVisible (boolean): Whether the layer is currently visible.
 *  - onToggle (function): Callback function invoked with the new visibility state (boolean) when toggled.
 */
function LayerToggle({ layerId, label, description, isVisible, onToggle }) {
  const handleToggle = () => {
    onToggle(!isVisible);
  };

  const switchClasses = `layer-toggle-switch ${isVisible ? 'active' : ''}`;

  return (
    <div className="layer-toggle" title={description}>
      <FaLayerGroup className="layer-toggle-icon" />
      <label className="layer-toggle-label">{label}</label>
      <button 
        id={`layer-toggle-${layerId}`}
        className={switchClasses}
        onClick={handleToggle}
        aria-pressed={isVisible}
      >
        <span className="layer-toggle-handle"></span>
      </button>
    </div>
  );
}

export default LayerToggle;

/*
Integration steps:
- Pass description prop from parent (e.g., MapFilterPanel).
- Ensure LayerToggle.css provides styles for:
  - .layer-toggle (layout: flex, align-items)
  - .layer-toggle-icon (margin, size)
  - .layer-toggle-label (flex-grow, margin)
  - .layer-toggle-switch (appearance: background, border-radius, width, height, position: relative, cursor: pointer)
  - .layer-toggle-switch.active (different background color)
  - .layer-toggle-handle (appearance: background, border-radius, size, position: absolute, transition)
  - .layer-toggle-switch.active .layer-toggle-handle (different position: left/right)
*/ 