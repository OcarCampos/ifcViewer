# IFC Annotation Web Application - Technical Specification

## 1. Technology Stack

### 1.1 Frontend
- **Core**:
  - HTML5, CSS3, TypeScript
  - HTMX 2.0.4 for dynamic UI updates
  - Tailwind CSS 4.0.0 for styling
  - ThatOpen Engine for IFC processing
  - Vite 6.0+ for development and building

- **Key Dependencies**:
  - `@thatopen/components`: ^2.4.3
  - `@thatopen/components-front`: ^2.4.2
  - `@thatopen/fragments`: ^2.4.0
  - `@thatopen/ui`: ^2.4.1
  - `@thatopen/ui-obc`: ^2.4.1
  - `htmx.org`: 2.0.4
  - `three`: ^0.160.1
  - `web-ifc`: ^0.0.66

### 1.2 Backend
- **Server**:
  - XAMPP with PHP 8.2+ (with `strict_types=1`)
  - Apache/2.4+
  - MySQL 8.0+

- **Key Dependencies**:
  - Manual JWT implementation (no Composer)
  - Custom configuration management
  - Native PHP sessions for state management

### 1.3 Development Tools
- **Version Control**: Git
- **Build Tool**: Vite 6.0+
- **Code Quality**:
  - PHP_CodeSniffer
  - PHPStan (static analysis)
  - ESLint (TypeScript/JavaScript)
  - Stylelint (CSS)

## 2. Architecture

### 2.1 Frontend Architecture
- **HTMX + TypeScript**:
  - HTMX for server-side rendered components
  - TypeScript for type safety and better developer experience
  - Custom elements for reusable UI components
  - Event-driven architecture using HTMX's event system

- **Session Management**
  - Secure session configuration
  - Session timeout handling
  - Session fixation protection
  - CSRF protection for 3D viewer using TypeScript classes
  - SessionStorage for temporary client-side state persistence

### 2.2 Backend Architecture
- **MVC Pattern**:
  - Controllers for request handling
  - Models for database interactions
  - Views as HTMX partials

- **API Endpoints**:
  - RESTful endpoints for data operations
  - HTMX-specific endpoints for partial updates
  - Session-based authentication

### 2.3 Data Flow
1. User actions trigger HTMX requests
2. Server processes requests and returns HTML fragments
3. HTMX swaps the DOM elements
4. 3D viewer updates via TypeScript event listeners
5. Annotations sync between server and client via HTMX

## 3. Development Setup

### 3.1 Prerequisites
- XAMPP with PHP 8.2+
- Node.js 18+ (for frontend development)
- MySQL 8.0+ (included in XAMPP)
- Git

### 3.2 Project Structure
```
ifc-viewer/
├── assets/              # Compiled assets
├── docs/                # Documentation
├── public/              # Publicly accessible files
│   ├── css/            # Compiled CSS
│   ├── js/             # Compiled JavaScript
│   └── index.php       # Entry point
├── src/
│   ├── backend/        # PHP backend code
│   │   ├── config/     # Configuration
│   │   ├── controllers/# Request handlers
│   │   ├── models/     # Database models
│   │   └── views/      # HTMX partials
│   └── frontend/       # Frontend source
│       ├── js/         # TypeScript files
│       │   └── viewer/ # IFC viewer components
│       └── styles/     # Tailwind CSS
├── tests/              # Test files

├── .env                # Environment variables
├── .htaccess          # Apache configuration

├── package.json        # Node.js dependencies
├── tailwind.config.js  # Tailwind config
└── vite.config.js     # Vite configuration
```

### 3.3 Development Workflow
1. Clone the repository into XAMPP's `htdocs` folder
2. Run `npm install` for frontend dependencies
3. Import database schema to MySQL
4. Configure database connection in `api/config/db.php`
5. Run `npm run dev` for Vite development server
6. Access at `http://localhost/your-project-folder`

## 4. Integration with ThatOpen Engine

### 4.1 Initialization
```typescript
// Example TypeScript module for viewer initialization
import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
import { FragmentsGroup } from "@thatopen/fragments";

class IFCEditor {
  private components = new OBC.Components();
  
  constructor() {
    this.initializeComponents();
    this.setupUI();
  }
  
  private initializeComponents() {
    // Initialize required components
    this.components.add(new OBC.FragmentsManager());
    // Add other required components
  }
  
  private setupUI() {
    // Setup UI components using HTMX and Tailwind
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new IFCEditor();
});
```

### 4.2 HTMX Integration
```html
<!-- Example HTMX button for model actions -->
<button 
  hx-post="/api/annotations"
  hx-target="#annotations-container"
  hx-swap="beforeend"
  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
>
  Add Annotation
</button>
```

## 5. Security Considerations

### 5.1 Authentication & Authorization
- PHP session-based authentication
- Secure, HTTP-only cookies with SameSite=Lax
- Role-based access control (Admin, Annotator, Viewer)
- Secure password hashing (bcrypt using PHP's password_hash)

### 5.2 Input Validation
- Server-side validation of all inputs
- Prepared statements for all database queries
- Content Security Policy (CSP) headers

### 5.3 Session Management
- Secure, HTTP-only cookies
- Session timeout handling
- Session fixation protection

## 6. Performance Optimization

### 6.1 Frontend
- Code splitting with Vite
- Lazy loading for non-critical components
- Optimized asset loading

### 6.2 Backend
- Opcache for PHP
- Database query optimization
- Caching strategies for frequently accessed data

## 7. Deployment

### 7.1 Requirements
- PHP 8.2+
- MySQL 8.0+
- Apache 2.4+ or Nginx 1.18+
- Node.js 18+ (for build process)

### 7.2 Deployment Steps
1. Clone the repository
2. Run `composer install --no-dev`
3. Run `npm install && npm run build`
4. Configure web server (Apache/Nginx)
5. Set up database
6. Configure `.env` file
7. Set proper file permissions

## 8. Testing Strategy

### 8.1 Unit Tests
- PHPUnit for backend tests
- Jest for frontend tests

### 8.2 Integration Tests
- End-to-end tests with Playwright
- API tests with Postman/Newman

## 9. Monitoring and Maintenance

### 9.1 Error Tracking
- Error logging with Monolog
- Client-side error reporting

### 9.2 Performance Monitoring
- Server resource monitoring
- Database query profiling

## 10. Future Considerations

### 10.1 Scalability
- Database sharding
- Load balancing
- CDN integration

### 10.2 Feature Enhancements
- Real-time collaboration
- Advanced annotation tools
- Integration with document management system

---

This technical specification provides a foundation for the IFC Annotation Web Application using the preferred technology stack. The architecture is designed to be maintainable, scalable, and secure while leveraging the strengths of HTMX, PHP, and the ThatOpen Engine.
