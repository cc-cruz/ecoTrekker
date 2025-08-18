# Project: UI Refactor for Data Layer Toggle Panel

**Objective:**
Transform the existing data layer toggle panel (`src/components/TogglePanel.js`) into an accordion-style interface as specified by the provided Figma design and CSS. The new panel will group layers by category, allowing each category to be expanded or collapsed to show its constituent layer toggles (indicators).

**References:**
*   Figma Design Image (provided by user)
*   Figma CSS Snippets (provided by user)
*   Existing codebase structure, particularly `src/components/TogglePanel.js`, `src/contexts/LayerContext.js`, and `src/config/layers.json`.

---

## Implementation Steps:

### Phase 1: Setup and Initial Structure

1.  **Verify Font:**
    *   The Figma design specifies the \'Inter\' font. Ensure this font is available globally in the project. If not, add it, typically via a link in `public/index.html` or imported in a global CSS file (e.g., `src/index.css`).
    *   Example (if adding to `public/index.html`):
        ```html
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
        ```

2.  **CSS File Preparation:**
    *   Locate or create the CSS file for the `TogglePanel` component. Assume it is `src/components/TogglePanel.css`. If it doesn\'t exist, create it.
    *   Ensure this CSS file is imported into `src/components/TogglePanel.js`:
        ```javascript
        // At the top of src/components/TogglePanel.js
        import \'./TogglePanel.css\';
        ```

3.  **`TogglePanel.js` - Basic Structure and State:**
    *   Open `src/components/TogglePanel.js`.
    *   Import `useState` from React.
    *   The component already uses `useLayers` to get `allLayers`, `activeLayerIds`, and `toggleLayerVisibility`. It also uses `groupLayersByCategory`. These will continue to be used.
    *   Add a new state variable to manage the expanded/collapsed state of categories:
        ```javascript
        // Inside the TogglePanel component function
        const [expandedCategories, setExpandedCategories] = useState({}); // Stores category names as keys, boolean as value
        ```
    *   Define a handler function to toggle category expansion:
        ```javascript
        const handleCategoryToggle = (categoryName) => {
          setExpandedCategories(prev => ({
            ...prev,
            [categoryName]: !prev[categoryName]
          }));
        };
        ```

4.  **`TogglePanel.js` - Top-Level JSX Structure:**
    *   Modify the `return` statement of `TogglePanel.js` to reflect the new outer structure based on Figma\'s "Filter Frame" concept.
    ```javascript
    // New structure:
    return (
      <div className="eco-filter-frame-outer"> {/* Corresponds to the semi-transparent 'Filter Frame' */}
        <div className="eco-filter-frame-inner"> {/* Corresponds to the white panel 'Filter Frame' */}
          <h2 className="eco-map-filter-title">Map Filter</h2>
          {/* Category accordions will go here */}
          {Object.entries(groupedLayers).map(([category, layers]) => (
            // ... category and layer rendering logic ...
          ))}
        </div>
      </div>
    );
    ```

### Phase 2: Implementing Category Accordions

5.  **`TogglePanel.js` - Rendering Category Headers:**
    *   Inside the `Object.entries(groupedLayers).map(...)` loop, replace the current category rendering with the new accordion header structure.
    ```javascript
    // Inside the .map(([category, layers]) => ( ... ))
    return (
      <div key={category} className="eco-category-accordion-section">
        <button
          type="button"
          className="eco-category-header"
          onClick={() => handleCategoryToggle(category)}
          aria-expanded={!!expandedCategories[category]}
          aria-controls={`category-content-${category.replace(/\s+/g, \'-\')}`} // For accessibility
        >
          <span className="eco-category-name">{category}</span>
          <span className="eco-info-icon eco-category-info-icon">
            {/* Placeholder for info icon, e.g., using react-icons or an SVG */}
            {/* Example: <FaInfoCircle /> */}
            i
          </span>
        </button>
        {/* Layer indicators will be conditionally rendered here */}
      </div>
    );
    ```

6.  **`TogglePanel.css` - Styling the Panel and Category Header:**
    *   Add CSS rules based on Figma specs.
    ```css
    /* src/components/TogglePanel.css */

    .eco-filter-frame-outer {
      position: relative; /* Or as per its placement in the app */
      width: 378px;
      /* height: 904px; */ /* Height might be dynamic based on content */
      background: rgba(255, 255, 255, 0.8); /* Figma: 'Filter Frame' */
      padding-top: 154px; /* To position the inner frame based on Figma's top: 154px */
      padding-left: 23px; /* To position the inner frame based on Figma's left: 23px */
      /* Add other layout styles as needed for integration */
    }

    .eco-filter-frame-inner {
      width: 332px;
      /* height: 733px; */ /* Height will be dynamic */
      background: #FFFFFF; /* Figma: 'Filter Frame' (white) */
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); /* Figma: 'Filter Frame' */
      /* padding-bottom: 10px; */ /* Allow space at the bottom if content overflows */
    }

    .eco-map-filter-title {
      /* Styles from Figma 'Map Filter' text */
      font-family: \'Inter\', sans-serif;
      font-style: normal;
      font-weight: 700;
      font-size: 24px;
      line-height: 29px;
      color: #616161;
      text-align: center; /* Figma shows it centered above the components */
      padding-top: 20px; /* Estimated from Figma (101px top of title - (154px top of inner frame - some offset)) */
      padding-bottom: 20px; /* Spacing before first category */
      margin: 0;
    }

    .eco-category-accordion-section {
      margin-bottom: -1px; /* To make borders overlap correctly like an accordion */
    }

    .eco-category-header {
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 13px 20px; /* Figma: 'Filter Component' */
      /* gap: 126px; */ /* Replaced by justify-content: space-between */
      width: 100%; /* Take full width of its container (.eco-filter-frame-inner) */
      height: 55px; /* Figma: 'Filter Component' */
      background-color: #FFFFFF; /* Assuming white background for button */
      border: 1px solid #616161; /* Figma: 'Filter Component' */
      cursor: pointer;
      text-align: left;
    }

    .eco-category-header:hover {
      background-color: #f0f0f0; /* Optional: hover effect */
    }

    .eco-category-name {
      /* Styles from Figma 'Category' text */
      /* width: 110px; */ /* Let it take available space */
      height: 29px;
      font-family: \'Inter\', sans-serif;
      font-style: normal;
      font-weight: 700;
      font-size: 24px;
      line-height: 29px;
      display: flex;
      align-items: center;
      color: #616161;
      flex-grow: 1; /* Allow name to take up space */
    }

    .eco-info-icon {
      width: 20px;
      height: 20px;
      background: #616161; /* Figma: 'Info' background (placeholder) */
      border-radius: 50%; /* Make it circular if it's a plain background */
      color: white; /* Text color for placeholder 'i' */
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: \'Inter\', sans-serif; /* For placeholder 'i' */
      font-weight: bold;
      font-size: 14px; /* For placeholder 'i' */
      /* Replace with actual icon styles if using an icon font/SVG */
    }
    ```

### Phase 3: Implementing Layer Indicators (Toggles)

7.  **`TogglePanel.js` - Rendering Layer Indicators:**
    *   Modify the category mapping to conditionally render layer items if the category is expanded.
    ```javascript
    // Inside the .map(([category, layers]) => ( ... ))
    // After the <button className="eco-category-header">...</button>
    return (
      <div key={category} className="eco-category-accordion-section">
        <button /* ... category header ... */ >
          {/* ... */}
        </button>
        {expandedCategories[category] && (
          <div
            id={`category-content-${category.replace(/\s+/g, \'-\')}`}
            className="eco-indicator-list"
          >
            {layers.map((layer) => (
              <div key={layer.id} className="eco-indicator-item">
                {/* Layer Icon (from layers.json 'icon' field) */}
                {layer.icon && (
                  <img src={process.env.PUBLIC_URL + layer.icon} alt="" className="eco-indicator-layer-icon" />
                )}
                <span className="eco-indicator-name">{layer.name}</span>
                
                {/* Custom Toggle Switch */}
                <label className="eco-custom-toggle-switch">
                  <input
                    type="checkbox"
                    checked={activeLayerIds.includes(layer.id)}
                    onChange={() => toggleLayerVisibility(layer.id)}
                  />
                  <span className="eco-custom-toggle-slider"></span>
                </label>

                <span className="eco-info-icon eco-indicator-info-icon">
                  {/* Placeholder for info icon */}
                  i
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
    ```
    *   **Note on `layer.icon` path:** The `process.env.PUBLIC_URL` prefix is often needed if icons are in the `public` folder. Adjust if your project structure is different.

8.  **`TogglePanel.css` - Styling the Indicator List and Items:**
    ```css
    /* src/components/TogglePanel.css */

    .eco-indicator-list {
      padding-left: 40px; /* Figma: 'Indicator Component' left: 60px, adjust as needed for indent. */
      background-color: #fff; 
      border-bottom: 1px solid #616161; 
    }

    .eco-indicator-list .eco-indicator-item:last-child {
       border-bottom: none; 
    }

    .eco-indicator-item {
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center; 
      padding: 9px 20px; 
      height: 38px; 
      border: 1px solid #616161; 
      border-top: none; 
      margin-right: -1px; 
      margin-left: -1px;  
    }
    
    .eco-indicator-layer-icon {
      width: 20px; 
      height: 20px; 
      margin-right: 10px;
      object-fit: contain;
    }

    .eco-indicator-name {
      height: 19px;
      font-family: \'Inter\', sans-serif;
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;
      display: flex;
      align-items: center;
      color: #616161;
      flex-grow: 1; 
    }

    .eco-indicator-info-icon {
      margin-left: 10px;
    }
    ```

9.  **`TogglePanel.css` - Styling the Custom Toggle Switch:**
    ```css
    /* src/components/TogglePanel.css */

    .eco-custom-toggle-switch {
      position: relative;
      display: inline-block;
      width: 44px;  
      height: 24px; 
      margin-left: 10px; 
    }

    .eco-custom-toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .eco-custom-toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 24px; 
    }

    .eco-custom-toggle-slider:before {
      position: absolute;
      content: "";
      height: 20px; 
      width: 20px;  
      left: 2px;   
      bottom: 2px; 
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }

    .eco-custom-toggle-switch input:checked + .eco-custom-toggle-slider {
      background-color: #2196F3; /* Active color */
    }

    .eco-custom-toggle-switch input:focus + .eco-custom-toggle-slider {
      box-shadow: 0 0 1px #2196F3; 
    }

    .eco-custom-toggle-switch input:checked + .eco-custom-toggle-slider:before {
      transform: translateX(20px); 
    }
    ```

### Phase 4: Final Touches and Testing

10. **Accessibility Considerations (Review):**
    *   Ensure `aria-expanded` and `aria-controls` are correctly implemented for category headers.
    *   Ensure toggle switches are keyboard navigable and their state is clear.
    *   Info icons should ideally have `aria-label` or be part of a described-by relationship.

11. **Icon Implementation:**
    *   Replace placeholder `"i"` in info icons with actual icons (e.g., from `react-icons`, SVGs).
        ```javascript
        // import { FaInfoCircle } from \'react-icons/fa\';
        // <span className="eco-info-icon ..."><FaInfoCircle /></span>
        ```
    *   Adjust CSS for `.eco-info-icon` to style the SVG container if needed.

12. **Testing:**
    *   **Visuals:** Compare against the Figma design.
    *   **Functionality:** Test category expansion/collapse, layer toggling, and map updates.
    *   **Responsiveness & Cross-browser:** Check for layout issues.

---

**Summary of Files to Modify/Create:**

*   **`src/components/TogglePanel.js`**: Major JSX and logic changes.
*   **`src/components/TogglePanel.css`**: Significant CSS additions and modifications.
*   **`public/index.html` or global CSS**: Potentially for font import. 