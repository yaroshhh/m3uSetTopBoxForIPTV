<?PHP
  header_remove("X-Powered-By");
  require_once __DIR__ . '/config.php';
  //set content type
  @header('Content-Type: text/xml');
  @header('Content-Encoding: gzip'); 
  ob_start();
?>
<?='<?xml version="1.0" encoding="UTF-8"?>' ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://<?=$_SERVER['HTTP_HOST']?>/</loc>
    <changefreq>monthly</changefreq>
    <lastmod><?=date('Y-m-d', strtotime('-2 day')) ?></lastmod>
  </url>
</urlset>
<?php
$xml = trim(ob_get_clean());
$output = gzencode($xml);     
die($output);
?>