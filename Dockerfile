FROM php:7.2-apache

RUN apt-get update \
        && docker-php-ext-install mysqli pdo pdo_mysql \
        && docker-php-ext-enable pdo_mysql \
        && service apache2 restart 
EXPOSE 80 
