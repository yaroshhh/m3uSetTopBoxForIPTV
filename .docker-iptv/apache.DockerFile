#
# More info in: https://hub.docker.com/_/php?tab=description
#
ARG PHP_VER=$PHP_VER
FROM php:$PHP_VER-apache

#RUN pecl channel-update pecl.php.net
#RUN pecl install xdebug

RUN a2enmod rewrite && a2enmod ssl && a2enmod socache_shmcb

RUN echo 'zend_extension=xdebug.so' | tee /usr/local/etc/php/conf.d/xdebug.ini \
    && echo "xdebug.client_host=host.docker.internal" | tee -a /usr/local/etc/php/conf.d/xdebug.ini \
    && echo "xdebug.mode=develop,debug" | tee -a /usr/local/etc/php/conf.d/xdebug.ini \
    && echo "xdebug.start_with_request=1" | tee -a /usr/local/etc/php/conf.d/xdebug.ini \
    && echo "xdebug.idekey=docker" | tee -a /usr/local/etc/php/conf.d/xdebug.ini \
    && echo "xdebug.log=/etc/apache2/log/xdebug.log" | tee -a /usr/local/etc/php/conf.d/xdebug.ini \
    && echo "error_log=/etc/apache2/log/php.log" | tee /usr/local/etc/php/conf.d/log.ini \
    && echo "log_errors=on" | tee -a /usr/local/etc/php/conf.d/log.ini \
    && echo "error_reporting=E_ALL" | tee -a /usr/local/etc/php/conf.d/log.ini \
    && echo "upload_max_filesize=20M" | tee /usr/local/etc/php/conf.d/upload.ini \
    && echo "post_max_size=20M" | tee -a /usr/local/etc/php/conf.d/upload.ini \
    && echo "memory_limit=512M" | tee -a /usr/local/etc/php/conf.d/upload.ini


RUN service apache2 restart