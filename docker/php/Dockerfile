FROM php:8.5.2-fpm-alpine3.23

WORKDIR /var/www

RUN apk add --no-cache \
    icu-libs \
    freetype \
    libjpeg-turbo \
    libpng \
    libzip \
    oniguruma\
&& apk add --no-cache --virtual .build-deps \
    $PHPIZE_DEPS \
    icu-dev \
    freetype-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    libzip-dev \
    linux-headers \
    oniguruma-dev \
&& docker-php-ext-configure gd --with-freetype --with-jpeg \
&& docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    gd \
    intl \
    zip \
    sockets \
    mbstring \
&& apk del .build-deps \
&& rm -rf /var/cache/apk/* /tmp/*

ARG UID=1000
ARG GID=1000

RUN addgroup -g ${GID} -S www \
 && adduser -u ${UID} -S -D -G www www

COPY --chown=www:www . /var/www

USER www