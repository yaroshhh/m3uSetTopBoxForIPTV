# m3uSetTopBoxForIPTV
This project lets you build an IP-TV set-top box with a simple web page that can parse the m3u file supplyed by your tv provider and serve both live-tv and video on-demand via HTML5 HLS video player

## Requirements
- [PHP 7.4](https://www.php.net/releases/7_4_0.php)
- [Composer](https://getcomposer.org/) for PHP
- [JWPlayer](https://www.jwplayer.com/) account (temp. requirement)

## Installation Instructions
- create a copy of db/config.def.json and name it db/config.json
- change the values inside the config.json for your needs
- run `composer install`

## Debugging
- use a cookie parameter named 'debug' in your browser with a positive value to enable debugging for PHP

### You can find a live [demo](https://iptv.yaronhelfer.com/) in Yaron Helfer's website.

for any metter feel free to reach me out at webmaster@yaronhelfer.com
