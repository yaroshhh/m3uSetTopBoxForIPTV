<?PHP
  header_remove("X-Powered-By");
  require_once __DIR__ . '/config.php';
  //set content type
  @header('Content-Type: text/plain');
?>
User-agent: *
Allow: /
sitemap: https://<?=$_SERVER['HTTP_HOST']?>/site_map.xml