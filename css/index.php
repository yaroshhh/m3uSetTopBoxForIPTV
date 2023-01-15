<?PHP
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../lib/dependencies.php';

//set content type
@header('Content-Type: text/css');
@header('Content-Encoding: gzip'); 
define('SKIP_HEADERS',true);

$data = '';

$dependencies = $vendor['css'];

$local = isset($_GET['css']) ? explode(',',$_GET['css']) : [];

// load dependencies files
foreach($dependencies as $css_file){
    if(file_exists(__DIR__.'/'.$css_file)){
        $data .= file_get_contents(__DIR__.'/'.$css_file).PHP_EOL;
    }
}

// load vendor files
foreach($local as $css_file){
    if(file_exists(__DIR__.'/'.$css_file.'.css')){
        $data .= file_get_contents(__DIR__.'/'.$css_file.'.css').PHP_EOL;
    }
}

// remove unused characters like tab and new-line
//$data = str_replace(["\n","\r","\t"],'',$data);
//$data = preg_replace('/\s{2,}/',' ',$data);
$data = preg_replace('/\/\*.*\*\//',' ',$data);
$data = trim($data);

// print compressed data
$output = gzencode($data);     
die($output);
?>