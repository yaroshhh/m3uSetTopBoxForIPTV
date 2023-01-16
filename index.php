<?PHP 
  header_remove("X-Powered-By");
  require_once "config.php";
  //set content type
  @header('Content-Type: text/html');
  @header('Content-Encoding: gzip'); 
  ob_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel=”preload” href=”css/bootstrap,styles/.css” as=”style” />
  <link rel="preload" href="/js/bootstrap,stb/.js" as="script" />
  <title>Online M3U SetTopBox</title>
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">

  <link rel="stylesheet" href="css/bootstrap,styles/.css">
  <meta name="theme-color" content="#333333">
<?php 
  if(file_exists(__DIR__.'/lib/custom_headers.php')){
    require_once __DIR__.'/lib/custom_headers.php';
  }
?>
  <script src="/js/bootstrap,stb/.js"></script>
  <script>
    window.STREAMS = {};
    window.GROUPS = {};
    window.PLAYER = '<?=$CFG->player_type?>';
  </script>
</head>
<body class="text-center bg-dark">
  <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
    <header>
      <nav class="navbar navbar-expand-md navbar-dark sticky-top bg-dark">
        <a class="navbar-brand" href="/">
          <svg class="bi bi-tv" width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M2.5 13.5A.5.5 0 0 1 3 13h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zM13.991 3H2c-.325 0-.502.078-.602.145a.758.758 0 0 0-.254.302A1.46 1.46 0 0 0 1 4.01V10c0 .325.078.502.145.602.07.105.17.188.302.254a1.464 1.464 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.758.758 0 0 0 .254-.302 1.464 1.464 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.757.757 0 0 0-.302-.254A1.46 1.46 0 0 0 13.99 3zM14 2H2C0 2 0 4 0 4v6c0 2 2 2 2 2h12c2 0 2-2 2-2V4c0-2-2-2-2-2z"/>
          </svg>
          <span>Online M3U Tester</span>
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav mr-0">
            <li class="nav-item">
              <a class="nav-link" href="https://wiki.tvip.ru/en/m3u" target="_blank">Help</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="https://yaronhelfer.com" target="_blank">About</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
    <main role="main" class="inner cover">
      <?php 
        if(file_exists(__DIR__.'/lib/custom_body_top.php')){
          require_once __DIR__.'/lib/custom_body_top.php';
        }
      ?>
      <div class="row">
        <div class="col-12">
          <h1>Online M3U Tester</h1>
          <h2>IPTV online set-top box</h2>
          <ul class="nav justify-content-center mb-2" id="m3u8List"></ul>
        </div>
      </div>
      <div class="row">
        <div class="col-md-8">
          <div class="container mb-2" id="ovc_player">
            <!-- 16:9 aspect ratio -->
            <div class="embed-responsive embed-responsive-16by9">
              <iframe class="embed-responsive-item" 
                      name="embedded_player" 
                      id="iframe_player" 
                      allowfullscreen="true" 
                      webkitallowfullscreen="true" 
                      mozallowfullscreen="true" 
                      scrolling="no" 
                      title="M3U8 Player"
                      src="seturl.html"> </iframe>
            </div> <!-- embed-responsive -->
          </div> <!-- Container -->
        </div> <!-- col-md-8 -->
        <div class="col-md-4">
          <ul class="list-unstyled mx-3 mx-md-0" id="channels"> </ul>
        </div> <!-- col-md-4 -->
      </div> <!-- Row -->
      <?php 
        if(file_exists(__DIR__.'/lib/custom_body_bootom.php')){
          require_once __DIR__.'/lib/custom_body_bootom.php';
        }
      ?>
    </main>

    <footer class="mastfoot mt-auto">
      <?php 
        if(file_exists(__DIR__.'/lib/custom_footer.php')){
          require_once __DIR__.'/lib/custom_footer.php';
        }
      ?>
      <div class="inner">
        <p class="text-center navbar-text text-light">© 2020 <a href="https://yaronhelfer.com">Yaron Helfer</a>. All Rights Reserved.</p>
      </div>
    </footer>
</div>
</body>

</html>
<?php
  $html = ob_get_clean();
  $output = gzencode($html);     
  die($output);
?>