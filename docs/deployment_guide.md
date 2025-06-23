# IFC Annotation Web App - Deployment Guide

## 1. Prerequisites

### 1.1 Development Environment
- XAMPP (Apache, MySQL, PHP 8.2+)
- Node.js 18+ and npm
- Git
- Composer (for dependency management)

### 1.2 Production Server
- Linux/Windows Server
- Apache 2.4+ or Nginx
- PHP 8.2+
- MySQL 8.0+
- SSL Certificate (Let's Encrypt recommended)

## 2. Local Development Setup

### 2.1 Clone the Repository
```bash
git clone https://github.com/your-org/ifc-annotation-app.git
cd ifc-annotation-app
```

### 2.2 Install Dependencies
```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install

# Build frontend assets
npm run build
```

### 2.3 Configure Environment
1. Copy `.env.example` to `.env`
2. Update database credentials:
```env
DB_HOST=localhost
DB_DATABASE=ifc_annotation
DB_USERNAME=root
DB_PASSWORD=
```

### 2.4 Database Setup
1. Create a new MySQL database
2. Run migrations:
```bash
php database/migrate.php
```
3. Seed initial data (optional):
```bash
php database/seed.php
```

### 2.5 Start Development Server
```bash
# Start Vite dev server
npm run dev

# In a separate terminal, start PHP server
php -S localhost:8000 -t public
```

## 3. Production Deployment

### 3.1 Server Requirements
- 2+ CPU cores
- 4GB+ RAM
- 20GB+ disk space
- Ubuntu 22.04 LTS / CentOS 8 / Windows Server 2022

### 3.2 Installation Steps

#### 3.2.1 Server Setup
1. Update system packages:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. Install required packages:
   ```bash
   # For Ubuntu/Debian
   sudo apt install -y apache2 mysql-server php8.2 php8.2-mysql php8.2-mbstring php8.2-xml php8.2-curl
   ```

3. Configure Apache:
   ```apache
   <VirtualHost *:80>
       ServerName yourdomain.com
       DocumentRoot /var/www/ifc-annotation-app/public

       <Directory /var/www/ifc-annotation-app/public>
           AllowOverride All
           Require all granted
       </Directory>

       ErrorLog ${APACHE_LOG_DIR}/error.log
       CustomLog ${APACHE_LOG_DIR}/access.log combined
   </VirtualHost>
   ```

4. Enable mod_rewrite:
   ```bash
   sudo a2enmod rewrite
   sudo systemctl restart apache2
   ```

#### 3.2.2 Application Deployment
1. Clone the repository:
   ```bash
   cd /var/www
   sudo git clone https://github.com/your-org/ifc-annotation-app.git
   sudo chown -R www-data:www-data ifc-annotation-app/
   cd ifc-annotation-app
   ```

2. Install dependencies:
   ```bash
   composer install --optimize-autoloader --no-dev
   npm install --production
   npm run build
   ```

3. Set up environment:
   ```bash
   cp .env.example .env
   php artisan key:generate
   # Edit .env with production settings
   ```

4. Set file permissions:
   ```bash
   sudo chown -R www-data:www-data /var/www/ifc-annotation-app
   sudo chmod -R 755 /var/www/ifc-annotation-app/storage
   sudo chmod -R 755 /var/www/ifc-annotation-app/bootstrap/cache
   ```

5. Set up the database:
   ```bash
   mysql -u root -p
   CREATE DATABASE ifc_annotation;
   GRANT ALL ON ifc_annotation.* TO 'ifc_user'@'localhost' IDENTIFIED BY 'secure_password';
   FLUSH PRIVILEGES;
   EXIT
   ```

6. Run migrations:
   ```bash
   php database/migrate.php --env=production
   ```

#### 3.2.3 SSL Setup with Let's Encrypt
1. Install Certbot:
   ```bash
   sudo apt install -y certbot python3-certbot-apache
   ```

2. Obtain SSL certificate:
   ```bash
   sudo certbot --apache -d yourdomain.com
   ```

3. Set up auto-renewal:
   ```bash
   sudo certbot renew --dry-run
   ```

## 4. Configuration

### 4.1 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| APP_ENV | Application environment | production |
| APP_DEBUG | Debug mode | false |
| APP_URL | Application URL | https://yourdomain.com |
| DB_* | Database configuration | - |
| JWT_SECRET | JWT secret key | - |
| SESSION_DRIVER | Session driver | file |
| SESSION_LIFETIME | Session lifetime in minutes | 120 |

### 4.2 File Permissions

```bash
# Set proper ownership
sudo chown -R www-data:www-data /var/www/ifc-annotation-app

# Set directory permissions
find /var/www/ifc-annotation-app -type d -exec chmod 755 {} \;

# Set file permissions
find /var/www/ifc-annotation-app -type f -exec chmod 644 {} \;

# Set storage and bootstrap/cache permissions
chmod -R 775 /var/www/ifc-annotation-app/storage
chmod -R 775 /var/www/ifc-annotation-app/bootstrap/cache
```

## 5. Maintenance

### 5.1 Updating the Application

1. Pull the latest changes:
   ```bash
   cd /var/www/ifc-annotation-app
   git pull origin main
   ```

2. Update dependencies:
   ```bash
   composer install --optimize-autoloader --no-dev
   npm install --production
   npm run build
   ```

3. Run migrations if needed:
   ```bash
   php database/migrate.php
   ```

4. Clear caches:
   ```bash
   php cache:clear
   php view:clear
   ```

5. Restart the web server:
   ```bash
   sudo systemctl restart apache2
   ```

### 5.2 Backups

1. Database backup script (`/scripts/backup.sh`):
   ```bash
   #!/bin/bash
   DATE=$(date +%Y%m%d%H%M%S)
   BACKUP_DIR="/var/backups/ifc-annotation"
   DB_USER="ifc_user"
   DB_PASS="secure_password"
   DB_NAME="ifc_annotation"
   
   mkdir -p $BACKUP_DIR
   mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql
   gzip $BACKUP_DIR/db_backup_$DATE.sql
   
   # Keep last 7 backups
   ls -t $BACKUP_DIR/db_backup_*.sql.gz | tail -n +8 | xargs rm --
   ```

2. Set up a cron job for daily backups:
   ```
   0 2 * * * /var/www/ifc-annotation-app/scripts/backup.sh
   ```

## 6. Monitoring

### 6.1 Logs
- Apache error log: `/var/log/apache2/error.log`
- Application log: `/var/www/ifc-annotation-app/storage/logs/laravel.log`

### 6.2 Monitoring Tools
- **Server**: htop, nmon
- **Application**: Laravel Telescope (for debugging)
- **Uptime**: UptimeRobot
- **Performance**: New Relic, Blackfire

## 7. Troubleshooting

### 7.1 Common Issues

#### Application Not Loading
- Check Apache error logs
- Verify file permissions
- Check if .htaccess is working

#### Database Connection Issues
- Verify database credentials in .env
- Check if MySQL is running
- Verify database user permissions

#### Permission Issues
```bash
sudo chown -R www-data:www-data /var/www/ifc-annotation-app
sudo chmod -R 755 /var/www/ifc-annotation-app
```

### 7.2 Getting Help
- Check the [GitHub Issues](https://github.com/your-org/ifc-annotation-app/issues)
- Consult the [documentation](https://docs.ifc-annotation-app.com)
- Contact support@yourdomain.com

## 8. Security Considerations

### 8.1 Server Hardening
- Keep the system updated
- Configure a firewall (UFW)
- Disable root login over SSH
- Use SSH keys for authentication

### 8.2 Application Security
- Keep dependencies updated
- Regular security audits
- Implement rate limiting
- Enable HTTPS with HSTS

## 9. Scaling

### 9.1 Vertical Scaling
- Upgrade server resources (CPU, RAM)
- Configure PHP-FPM and opcache
- Use Redis/Memcached for caching

### 9.2 Horizontal Scaling
- Set up load balancing
- Use a CDN for static assets
- Implement database replication

## 10. Appendix

### 10.1 Directory Structure

```
ifc-annotation-app/
├── api/                 # PHP backend
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Middleware
│   └── models/         # Database models
├── public/             # Publicly accessible files
│   ├── assets/        # Compiled assets
│   └── index.php      # Entry point
├── src/                # Frontend source
│   ├── components/    # UI components
│   ├── lib/           # Third-party libraries
│   └── styles/        # CSS/Tailwind
├── tests/             # Test files
└── vendor/            # Composer dependencies
```

### 10.2 Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `php database/migrate.php` | Run database migrations |
| `php cache:clear` | Clear application cache |

### 10.3 Additional Resources
- [Apache Documentation](https://httpd.apache.org/docs/)
- [PHP Documentation](https://www.php.net/docs.php)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

---
Last Updated: June 2025
