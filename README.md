# IFC 3D Model Viewer

A web-based IFC model viewer built with TypeScript and [@thatopen/components](https://github.com/ThatOpen/engine_components) library. This viewer allows you to load, view, and interact with IFC (Industry Foundation Classes) models in a web browser.

## Features

- Load and view IFC models
- Export and import model fragments for faster loading
- Interactive model exploration
- Element selection and highlighting
- Toggle element visibility
- Element isolation
- View element properties
- Model classification system
- Configurable world settings
- Responsive design with floating toolbar

## Project Structure

```
ifcBrowser/
├── index.html          # Main entry point
├── src/
│   ├── viewer/         # TypeScript files for the IFC viewer
│   │   └── index.ts    # Main viewer implementation
│   └── styles/         # CSS styles
│       └── main.css    # Main stylesheet
```

## Usage

The viewer provides a floating toolbar with the following functionality:

### World Settings
- Configure scene, camera, and renderer settings

### Import/Export
- Load IFC files
- Import fragment files (.frag)
- Export fragment files
- Dispose/reset the scene

### Selection Tools
- Toggle element visibility
- Isolate selected elements
- Show all elements
- View element properties

### Properties and Classification
- View detailed element properties
- Access model classification system
- Search and filter properties

## Development

1. The main viewer implementation is in `src/viewer/index.ts`
2. Add any additional styles in `src/styles/main.css`
3. The viewer container is available with ID `viewer-container`

## Dependencies

- [@thatopen/components](https://github.com/ThatOpen/engine_components) - Core BIM engine components
- [@thatopen/ui](https://github.com/ThatOpen/engine_components) - UI components
- [@thatopen/components-front](https://github.com/ThatOpen/engine_components) - Frontend components
