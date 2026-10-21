FROM php:8.2-cli-alpine

# Install MySQL extension and essential tools
RUN apk add --no-cache bash mysql-client libzip-dev \
    && docker-php-ext-install pdo pdo_mysql bcmath

# Include Composer 2 binary
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

CMD ["tail", "-f", "/dev/null"]
