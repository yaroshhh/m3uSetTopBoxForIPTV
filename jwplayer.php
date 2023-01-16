<?PHP
  header_remove("X-Powered-By");
  require_once __DIR__ . '/config.php';
  //set content type
  @header('Content-Type: text/html');
  @header('Content-Encoding: gzip'); 
  ob_start();
?>
<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<link rel=”preload” href=”css/styles.css” as=”style” />
<link rel="preload" href="/vendor/components/jquery/jquery.min.js" as="script" />
<link rel="preload" href="<?=$CFG->jwplayer_cdn_url?>" as="script" />
<link rel="preload" href="/js/jwplayer.js" as="script" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=EDGE" />
<meta name="robots" content="noindex">
<title></title>

<!-- internal use only -->
<script>if(window.top == window.self){location='/'}</script>

<script src="/vendor/components/jquery/jquery.min.js"></script>

<link rel="stylesheet" type="text/css" href="css/styles.css" />
</head>
<body bgcolor="Transparent" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
<div id="stb"></div>
<div id="shelf-widget"></div>
<script type="text/javascript" src="<?=$CFG->jwplayer_cdn_url?>" ></script>
<script type="text/javascript" src="js/jwplayer.js"></script>
</body>
</html>
<?php
  $html = ob_get_clean();
  $output = gzencode($html);     
  die($output);
?>