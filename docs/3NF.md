# Database Schema - Third Normal Form (3NF)

## 1. Overview
This document outlines the database schema for the IFC Annotation Web Application, designed in Third Normal Form (3NF) to ensure data integrity and minimize redundancy. The schema currently focuses on user management, while model and annotation data are stored client-side in JSON files.

## 2. Tables

### 2.1 `users`
Stores user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email address |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password using bcrypt |
| first_name | VARCHAR(100) | NOT NULL | User's first name |
| last_name | VARCHAR(100) | NOT NULL | User's last name |
| company | VARCHAR(255) | NULL | User's company (optional) |
| role | ENUM('admin', 'annotator', 'viewer') | NOT NULL | User's role |
| is_active | BOOLEAN | DEFAULT TRUE | Whether the account is active |
| last_login | DATETIME | NULL | Timestamp of last login |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

### 2.2 `user_sessions`
Manages user login sessions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Session identifier |
| user_id | INT | FOREIGN KEY (users.id), NOT NULL | Reference to user |
| session_token | VARCHAR(255) | UNIQUE, NOT NULL | JWT session token |
| ip_address | VARCHAR(45) | NULL | IP address of the client |
| user_agent | TEXT | NULL | Browser/device information |
| expires_at | TIMESTAMP | NOT NULL | Expiration timestamp |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| last_activity | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last activity timestamp |

### 2.3 `password_reset_tokens`
Manages password reset requests.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Token identifier |
| user_id | INT | FOREIGN KEY (users.id), NOT NULL | Reference to user |
| token | VARCHAR(255) | UNIQUE, NOT NULL | Secure random token |
| expires_at | TIMESTAMP | NOT NULL | Expiration timestamp |
| used | BOOLEAN | DEFAULT FALSE | Whether the token has been used |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

## 3. Client-Side Data Storage

### 3.1 Model Data (JSON Format)
Stored in the browser's IndexedDB or localStorage.

```json
{
  "version": "1.0",
  "model": {
    "ifc_guid": "string (22-char Base64)",
    "file_name": "string",
    "file_size": "number",
    "last_modified": "ISO8601 date string",
    "metadata": {
      "author": "string",
      "organization": "string",
      "timestamp": "ISO8601 date string"
    }
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
        "id": "number (user ID from database)",
        "name": "string",
        "email": "string"
      },
      "element": {
        "guid": "string (IFC element GUID)",
        "type": "string (IFC type)",
        "name": "string"
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

## 4. Indexes

### 4.1 Users Table
- `idx_users_email` ON `users` (`email`)
- `idx_users_role` ON `users` (`role`, `is_active`)
- `idx_users_created` ON `users` (`created_at`)

### 4.2 User Sessions Table
- `idx_sessions_user` ON `user_sessions` (`user_id`)
- `idx_sessions_token` ON `user_sessions` (`session_token`)
- `idx_sessions_expiry` ON `user_sessions` (`expires_at`)

### 4.3 Password Reset Tokens
- `idx_pwreset_user` ON `password_reset_tokens` (`user_id`)
- `idx_pwreset_token` ON `password_reset_tokens` (`token`)
- `idx_pwreset_expiry` ON `password_reset_tokens` (`expires_at`, `used`)

## 5. Foreign Key Relationships

1. `user_sessions.user_id` → `users.id`
   - ON DELETE: CASCADE
   - ON UPDATE: CASCADE
   - Description: User sessions are deleted when a user is deleted

2. `password_reset_tokens.user_id` → `users.id`
   - ON DELETE: CASCADE
   - ON UPDATE: CASCADE
   - Description: Password reset tokens are deleted when a user is deleted

## 6. SQL Creation Script

```sql
-- Users table
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `company` VARCHAR(255) DEFAULT NULL,
  `role` ENUM('admin', 'annotator', 'viewer') NOT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `last_login` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_users_email` (`email`),
  KEY `idx_users_role` (`role`, `is_active`),
  KEY `idx_users_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User sessions table
CREATE TABLE `user_sessions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `session_token` VARCHAR(255) NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` TEXT DEFAULT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `last_activity` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_sessions_token` (`session_token`),
  KEY `idx_sessions_user` (`user_id`),
  KEY `idx_sessions_expiry` (`expires_at`),
  CONSTRAINT `fk_sessions_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Password reset tokens table
CREATE TABLE `password_reset_tokens` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `used` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_pwreset_token` (`token`),
  KEY `idx_pwreset_user` (`user_id`),
  KEY `idx_pwreset_expiry` (`expires_at`, `used`),
  CONSTRAINT `fk_pwreset_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 7. 3NF Compliance

### 7.1 First Normal Form (1NF)
- All tables have a primary key
- All attributes contain atomic values
- No repeating groups or arrays

### 7.2 Second Normal Form (2NF)
- All non-key attributes are fully functionally dependent on the primary key
- No partial dependencies exist
- All tables are in 1NF

### 7.3 Third Normal Form (3NF)
- No transitive dependencies exist
- All non-key attributes are non-transitively dependent on the primary key
- Derived data is not stored
- All tables are in 2NF

## 8. Notes

1. **Character Set**: UTF-8 (utf8mb4) is used to support full Unicode, including emoji characters.
2. **Storage Engines**: InnoDB is used for all tables to support transactions and foreign key constraints.
3. **Timestamps**: All tables include created_at and updated_at timestamps for auditing.
4. **Security**:
   - Passwords are hashed using bcrypt
   - Session tokens are securely generated and validated
   - Password reset tokens are single-use and expire
5. **Scalability**: The schema is designed to handle a large number of users with efficient indexing.

## 9. Future Considerations

1. **Audit Logging**: Add triggers or application logic to log all changes to critical tables.
2. **Rate Limiting**: Implement rate limiting for authentication endpoints.
3. **Two-Factor Authentication**: Add support for 2FA for enhanced security.
4. **User Preferences**: Add a table for storing user-specific application settings.
5. **API Keys**: Add support for API key authentication for programmatic access.
6. **Model and Annotation Storage**: When ready to move to server-side storage, the JSON schema provided can be mapped to database tables.
