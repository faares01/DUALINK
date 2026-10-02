<?php
declare(strict_types=1);
$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) { http_response_code(500); echo json_encode(['error'=>'Server configuration is missing. Copy config.example.php to config.php.']); exit; }
$config = require $configFile;
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . $config['app_url']);
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;
try { $pdo = new PDO("mysql:host={$config['db']['host']};dbname={$config['db']['name']};charset=utf8mb4", $config['db']['user'], $config['db']['pass'], [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]); } catch (PDOException $e) { http_response_code(500); echo json_encode(['error'=>'Database connection failed.']); exit; }
function body(): array { return json_decode(file_get_contents('php://input'), true) ?: []; }
function respond(array $data, int $status=200): never { http_response_code($status); echo json_encode($data); exit; }
function sessionToken(): ?string { $header=$_SERVER['HTTP_AUTHORIZATION']??''; if(preg_match('/^Bearer (.+)$/',$header,$m)) return $m[1]; return $_COOKIE['dualink_session'] ?? null; }
function userId(): int { $token=sessionToken(); if(!$token)respond(['error'=>'Sign in required'],401); global $pdo; $q=$pdo->prepare('SELECT user_id FROM sessions WHERE token_hash = ? AND expires_at > NOW()');$q->execute([hash('sha256',$token)]);$user=$q->fetch();if(!$user)respond(['error'=>'Invalid or expired session'],401);return (int)$user['user_id']; }
