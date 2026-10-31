FROM php:8.2-cli-alpine

# Install MySQL extension, zip, nodejs, npm, and essential tools
RUN apk add --no-cache bash mysql-client libzip-dev nodejs npm \
    && docker-php-ext-install pdo pdo_mysql bcmath

# Include Composer 2 binary
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
