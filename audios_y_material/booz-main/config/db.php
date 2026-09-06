<?php

// config/db.php

$host = '127.0.0.1';
$db = 'booz_db';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // If the database does not exist, let it be caught by the setup script
    // In production, we'd handle this gracefully.
    if ($e->getCode() == 1049) {
        // Unknown database, we will handle this in pages or setup
        $pdo = null;
    } else {
        throw new \PDOException($e->getMessage(), (int) $e->getCode());
    }
}
