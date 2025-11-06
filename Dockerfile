# Use official PHP + Apache image
FROM php:8.2-apache

# Enable PDO MySQL extension
RUN docker-php-ext-install pdo pdo_mysql

# Set the working directory inside the container
WORKDIR /var/www/html

# Copy backend code into container
COPY backend/ /var/www/html/

# Change Apache DocumentRoot to /public
RUN sed -ri -e 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf

# Enable Apache rewrite module (optional, but good for clean URLs)
RUN a2enmod rewrite

