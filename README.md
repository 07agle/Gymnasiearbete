## Docker-compose LEMP
### Inkluderar
- nginx -> localhost:80
- php   
- mariadb -> mariadb
- phpmyadmin -> localhost:8080

### HowTo

##### Webbroten
    www/public
##### Starta servern (containern) med
    docker compose up -d
##### Stoppa servern (containern) med
    docker compose down
##### Serverns url
    localhost
##### phpmyadmin
    localhost:8080
##### Anslut till MariaDB med php

````php
<?php
    // Definierar konstanter med användarinformation.
    define ('DB_USER', 'userName'); // Användare i MariaDB
    define ('DB_PASSWORD', '12345');
    define ('DB_HOST', 'mariadb'); // Se docker-compose under mariadb och container_name:
    define ('DB_NAME', 'dbName');   // Databasen som anslutning skall ske till

    // Skapar en anslutning till MariaDB och databasen dbName
    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8';
    $db = new PDO($dsn, DB_USER, DB_PASSWORD);
?> // Ej nödvändigt att avslut "ren" php med ?>
````
### ToDo
    
Kontrollera versioner xxxx