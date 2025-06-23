# IFC Annotation Web Application - Functional Requirements

## 1. Introduction

### 1.1 Purpose
This document outlines the functional requirements for the IFC Annotation Web Application, a client-side tool designed to allow non-technical users to view IFC models, create annotations, and share feedback without requiring specialized 3D modeling software.

### 1.2 Scope
The application provides a web-based interface for viewing IFC models and creating/managing annotations. All model and annotation data is stored client-side using JSON files that users can save and load. The system supports user authentication with different permission levels, while model and annotation data remains local to the user's session.

## 2. User Roles

### 2.1 Administrator
- Create, view, edit, and deactivate user accounts
- Assign user roles (admin/annotator/viewer)
- Configure system settings

### 2.2 Annotator
- Load IFC models from local storage
- Create, edit, and delete annotations
- Export/import annotations as JSON files
- View and navigate 3D models
- View model properties

### 2.3 Viewer
- Load IFC models from local storage
- View existing annotations from imported JSON files
- Navigate through the 3D model
- View model properties

## 3. Functional Requirements

### 3.1 Authentication & User Management (FR-001 to FR-010)

#### FR-001: User Login
- Users can log in with email and password
- Session management with appropriate timeouts
- Secure password reset functionality

#### FR-002: User Management (Admin only)
- Create new user accounts
- Edit existing user details
- Deactivate/reactivate accounts
- Assign/change user roles

### 3.2 Model Viewing (FR-011 to FR-017)

#### FR-011: Model Loading
- Load IFC files from local storage
- Display loading progress
- Validate file type and size
- Extract and store model metadata (name, GUID, etc.)

#### FR-012: 3D Navigation
- Rotate, pan, and zoom the model
- Reset view to default position
- Toggle between different view modes (top, front, side, isometric)

#### FR-013: Model Inspection
- Display model hierarchy
- Toggle visibility of model components
- Select components to view properties
- Highlight selected elements in the 3D view

### 3.3 Annotation System (FR-021 to FR-027)

#### FR-021: Create Annotation
- Add text notes to specific model elements
- Include measurements
- Add markups (arrows, circles, etc.)
- Assign priority levels (High/Medium/Low)
- Link annotations to specific model elements using GUIDs

#### FR-022: View Annotations
- Display annotations in a side panel
- Filter annotations by priority or status
- Highlight associated model elements when selecting an annotation
- Display annotation details on selection

#### FR-023: Edit/Delete Annotations
- Modify existing annotations
- Delete annotations with confirmation
- Track modification timestamps

#### FR-024: Annotation Status
- Mark annotations as Open/In Progress/Resolved
- Filter by status
- Update status with timestamps

### 3.4 Data Management (FR-036 to FR-042)

#### FR-036: Export Annotations
- Export annotations to JSON file
- Include model identification (IFC GUID) in export
- Include all annotation details (text, position, status, etc.)
- Option to include model snapshot (current view)

#### FR-037: Import Annotations
- Import annotations from JSON file
- Validate IFC GUID matches the currently loaded model
- Provide clear warning if importing annotations for a different model
- Option to proceed or cancel import when model mismatch is detected
- Merge with existing annotations or replace all

#### FR-038: Session Management
- Warn before leaving page with unsaved changes
- Auto-save annotations to browser storage (optional)
- Clear all annotations and reset viewer
- Export session data for backup

#### FR-039: Model Validation
- Validate IFC file integrity on load
- Extract and display model metadata (GUID, author, etc.)
- Handle unsupported IFC versions gracefully
- Provide meaningful error messages for corrupted files

### 3.5 User Interface (FR-041 to FR-045)

#### FR-041: Responsive Design
- Work on desktop and tablet devices
- Adapt to different screen sizes
- Touch support for tablet devices

#### FR-042: Model Properties
- Display properties of selected elements
- Search within properties
- Copy property values to clipboard

## 4. User Stories

### 4.1 Authentication
- **US-001**: As an administrator, I want to create user accounts so that team members can access the application.
- **US-002**: As a user, I want to reset my password so that I can regain access if I forget it.
- **US-003**: As an administrator, I want to manage user roles so that I can control access to features.

### 4.2 Model Interaction
- **US-010**: As a user, I want to load an IFC model from my computer so that I can view it in the browser.
- **US-011**: As a user, I want to navigate the 3D model using intuitive controls so that I can examine it from different angles.
- **US-012**: As a user, I want to view model properties when I select elements so that I can understand the model better.

### 4.3 Annotation
- **US-020**: As an annotator, I want to add notes to specific parts of the model so that I can document issues.
- **US-021**: As a user, I want to see all annotations on the model so that I can understand the feedback.
- **US-022**: As an annotator, I want to update the status of annotations so that I can track progress.

### 4.4 Data Management
- **US-030**: As a user, I want to export my annotations to a JSON file so that I can save my work.
- **US-031**: As a user, I want to import annotations from a JSON file so that I can continue working on a previous session.
- **US-032**: As a user, I want to be warned if I try to import annotations for a different model than the one currently loaded.
- **US-033**: As a user, I want to clear all annotations so that I can start fresh with a clean model.


## 5. Non-Functional Requirements

### 5.1 Performance
- The application should load the initial view in under 3 seconds on a standard broadband connection.
- Model loading should provide progress feedback to the user.
- The interface should remain responsive during model processing.
- The application should handle large IFC files efficiently (100MB+).

### 5.2 Security
- All authentication must use secure, encrypted connections (HTTPS).
- User passwords must be hashed using bcrypt.
- Session tokens must be securely generated and validated.
- Client-side storage should be used appropriately for sensitive data.

### 5.3 Usability
- The interface should be intuitive for non-technical users.
- Common tasks should be achievable within 3 clicks/taps.
- The application should provide appropriate feedback for user actions.
- Keyboard shortcuts should be available for power users.
- The interface should be fully accessible (WCAG 2.1 AA compliance).

## 6. Data Model

### 6.1 User (Database Table)
- `id` (PK, INT, AUTO_INCREMENT)
- `email` (VARCHAR(255), UNIQUE, NOT NULL)
- `password_hash` (VARCHAR(255), NOT NULL)
- `first_name` (VARCHAR(100), NOT NULL)
- `last_name` (VARCHAR(100), NOT NULL)
- `company` (VARCHAR(255), NULL)
- `role` (ENUM('admin', 'annotator', 'viewer'), NOT NULL)
- `is_active` (BOOLEAN, DEFAULT TRUE)
- `last_login` (DATETIME, NULL)
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)

### 6.2 Annotation (JSON Structure)
```json
{
  "version": "1.0",
  "model": {
    "ifc_guid": "string",
    "file_name": "string",
    "file_size": "number",
    "last_modified": "ISO8601 date string"
  },
  "annotations": [
    {
      "id": "string (UUID)",
      "title": "string",
      "description": "string",
      "status": "open|in_progress|resolved",
      "priority": "low|medium|high",
      "created_at": "ISO8601 date string",
      "updated_at": "ISO8601 date string",
      "created_by": {
        "id": "number (user ID)",
        "name": "string",
        "email": "string"
      },
      "element": {
        "guid": "string (IFC element GUID)",
        "type": "string (IFC type)",
        "name": "string (element name if available)"
      },
      "position": {
        "x": "number",
        "y": "number",
        "z": "number"
      },
      "view_state": {
        "camera_position": {"x": "number", "y": "number", "z": "number"},
        "camera_target": {"x": "number", "y": "number", "z": "number"},
        "zoom_level": "number"
      },
      "attachments": [
        {
          "type": "image|document|link",
          "url": "string",
          "name": "string",
          "size": "number (bytes)",
          "created_at": "ISO8601 date string"
        }
      ]
    }
  ]
}
```

## 7. Integration Requirements

### 7.1 ThatOpen Engine
- Client-side integration with ThatOpen Engine for IFC model processing
- Support for all major IFC versions
- Efficient model rendering and manipulation in the browser
- Extraction of IFC GUIDs and model metadata
- Validation of model integrity
- Support for model element selection and property inspection

## 8. Future Considerations

### 8.1 Potential Enhancements
- Server-side storage of models and annotations
- Real-time collaboration features
- Advanced measurement tools
- Integration with document management systems
- Version control for annotations
- Advanced search capabilities
- Offline support with synchronization

## 9. Acceptance Criteria

### 9.1 User Authentication
- [ ] Users can log in with valid credentials
- [ ] Invalid login attempts are rejected
- [ ] Password reset functionality works as expected
- [ ] User roles are enforced correctly

### 9.2 Model Viewing
- [ ] IFC models load from local storage
- [ ] 3D navigation works smoothly
- [ ] Model hierarchy is displayed accurately
- [ ] Element properties are viewable

### 9.3 Annotation System
- [ ] Annotations can be created, edited, and deleted
- [ ] Annotations are correctly associated with model elements
- [ ] Annotation status and priority can be updated
- [ ] Annotations include reference to model IFC GUID
- [ ] Users are warned when loading annotations for a different model

### 9.4 Data Management
- [ ] Annotations can be exported to JSON
- [ ] JSON files can be imported back into the system
- [ ] Users are warned before losing unsaved changes
- [ ] Model metadata is correctly extracted and displayed

## 10. Appendix

### 10.1 Glossary
- **IFC**: Industry Foundation Classes, an open file format for BIM data
- **IFC GUID**: A globally unique identifier assigned to IFC elements (22-character Base64 encoded string)
- **BIM**: Building Information Modeling
- **Annotation**: A note or markup added to a specific part of the model
- **Client-side Storage**: Data stored in the user's browser (e.g., IndexedDB, localStorage)

### 10.2 IFC GUID Implementation
- IFC files contain globally unique identifiers (GUIDs) for model elements
- The root element (typically IfcProject) has a GlobalId attribute that serves as the model identifier
- GUIDs are stored in a compressed 22-character Base64 format
- The application extracts and validates these GUIDs to ensure annotation-model consistency
- When exporting annotations, the model's GUID is included in the JSON file
- When importing annotations, the system verifies the GUID matches the currently loaded model

### 10.3 JSON Schema
A JSON Schema is provided to validate annotation files. This ensures compatibility and data integrity when sharing annotation files between users.

### 10.4 References
- ThatOpen Engine Documentation: https://docs.thatopen.com/
- IFC Format Specification: https://technical.buildingsmart.org/standards/ifc/
- JSON Schema: https://json-schema.org/
