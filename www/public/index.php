<h1>Webbservern fungerar!</h1>
<p><strong>Denna sida (index.php) skall bytas ut.</strong></p>

<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Testar att mariaDB fungerar
$myPDO = new PDO('mysql:host=mariadb;port=3306;dbname=mysql', 'root', '12345');
$result = $myPDO->query("SELECT * FROM db");
foreach ($result as $row) {
   echo $row['Db'] . '<hr>';
}

phpinfo();

define('DB_USER', 'root');
define('DB_PASSWORD', '12345');
define('DB_HOST', 'mariadb'); // Byt till localhost om inte docker
define('DB_NAME', 'mysql');

// Byt?
$dbConnection = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD) or die("Could not connect.");

// http://php.net/manual/en/function.mysql-set-charset.php
mysqli_set_charset($dbConnection, 'utf8');

mysqli_select_db($dbConnection, DB_NAME);

$sql = "SELECT * FROM db";
$rs = mysqli_execute_query($dbConnection, $sql);

while ($row = mysqli_fetch_array($rs)) {
   echo $row['Db'] . '<hr>';
}
?>