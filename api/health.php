<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) { http_response_code(503); echo json_encode(['ok'=>false, 'database'=>false]); exit; }
$config = require $configFile;
try {
  $pdo = new PDO("mysql:host={$config['db']['host']};dbname={$config['db']['name']};charset=utf8mb4", $config['db']['user'], $config['db']['pass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
  $pdo->query('SELECT 1');
  echo json_encode(['ok'=>true, 'database'=>true, 'time'=>gmdate('c')]);
} catch (Throwable $e) {
  http_response_code(503);
  echo json_encode(['ok'=>false, 'database'=>false]);
}
