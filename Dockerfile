# Use official PHP + Apache image
FROM php:8.2-apache

# Enable PDO MySQL extension
RUN docker-php-ext-install pdo pdo_mysql

# Set working directory inside the container
WORKDIR /var/www/html

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy backend code into container
COPY backend/ /var/www/html/

# Run composer install to get vendor folder
RUN composer install --no-interaction --no-dev --optimize-autoloader

# Change Apache DocumentRoot to /public
RUN sed -ri -e 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf

# Enable Apache rewrite module (optional, good for clean URLs)
RUN a2enmod rewrite

# Expose port 80
EXPOSE 80
