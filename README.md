# Simple IFC Viewer

A lightweight, web-based IFC model viewer that allows you to view and interact with IFC (Industry Foundation Classes) models directly in your browser. Built with [@thatopen/components](https://github.com/ThatOpen/engine_components), it provides an easy and seamless viewer for construction and BIM professionals.

## Features

- **Import/Export**
  - Load IFC files directly in your browser
  - Import fragment files (.frag)
  - Export fragment files for faster loading
  - Dispose/reset scene memory

- **Selection & Visibility**
  - Select and highlight model elements
  - Toggle element visibility
  - Isolate selected elements
  - Show/hide all elements

- **Properties & Information**
  - View detailed element properties
  - Access model classification system
  - Search and filter properties
  - Real-time property updates

- **Viewer Settings**
  - Configure viewer appearance
  - Adjust background color
  - Toggle grid visibility
  - Customize viewing experience

## Project Structure

```
ifcBrowser/
├── index.html          # Main entry point
├── vite.config.js      # Vite configuration
├── tsconfig.json       # TypeScript configuration
├── src/
│   ├── viewer/         # TypeScript files for the IFC viewer
│   │   └── index.ts    # Main viewer implementation
│   └── styles/         # CSS styles
│       └── main.css    # Main stylesheet
```

## Getting Started

### Using the built version

1. Download the files inside the `dist` folder.
2. Paste the files into your server.
3. Open the `index.html` file in your browser.
4. Click on the "Import IFC" button to load an IFC model.

### Developing Locally

#### Prerequisites
- Node.js (Latest LTS version recommended)
- npm or yarn package manager

#### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/OcarCampos/ifcBrowser.git
   cd ifcBrowser
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local development server (usually http://localhost:5173)

#### Building for Production

To create a production build:
```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage Guide

Check out our [usage tutorial video](https://www.youtube.com/embed/pC96mbuW33A) for a walkthrough of all features.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

- GitHub: [@OcarCampos](https://github.com/OcarCampos)
- Email: [ocar.campos@attitude.cl](mailto:ocar.campos@attitude.cl)

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgments

- Built with [That Open Engine](https://github.com/ThatOpen) components
- Special thanks to the ThatOpenEngine community
