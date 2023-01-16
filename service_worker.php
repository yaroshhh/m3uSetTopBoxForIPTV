<?PHP 
header('Content-Type: text/javascript; charset=utf-8');
define('SKIP_HEADERS', true);
require_once 'config.php';
$filesToCache = [];

/**
 * list all CSS files directories for cache
 */
$css_dirs = [
  'css',
  'vendor/twbs/bootstrap/dist/css/'
];

foreach($css_dirs as $dir){
  foreach(glob(__DIR__.'/'.$dir.'/*.css') as $file){
    $filesToCache[] = "/$dir/".basename($file);
  }
}

/**
 * list all javascript files directories for cache
 */
$js_dirs = [
  'js',
  'vendor/components/jquery/',
  'vendor/popper.js/popper-core/',
  'vendor/twbs/bootstrap/dist/js/'
];

foreach($js_dirs as $dir){
  foreach(glob(__DIR__.'/'.$dir.'/*.js') as $file){
    $filesToCache[] = "/$dir/".basename($file);
  }
}

/**
 * list all image files directories for cache
 */
$img_dirs = [
  'images'
];

foreach($img_dirs as $dir){
  foreach(glob(__DIR__.'/'.$dir.'/*.*') as $file){
    $filesToCache[] = "/$dir/".basename($file);
  }
}

/**
 * list all manifest for each language
 */
foreach(glob(__DIR__.'/db/*.json') as $file){
  $filesToCache[] = "/db/".basename($file);
}

$other_files = [
  "/js/?js=all.js",
  "/css/?css=all.css"
];

$filesToCache = array_merge($filesToCache, $other_files);
?>
const filesToCache = <?=json_encode($filesToCache, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)?>;
var version = 'iptv1.0';
<?PHP include "sw.js" ?>