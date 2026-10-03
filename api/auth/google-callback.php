<?php
declare(strict_types=1);
session_start();
$config = require __DIR__ . '/../config.php';
function fail(string $message, int $status = 400): never { http_response_code($status); echo htmlspecialchars($message, ENT_QUOTES, 'UTF-8'); exit; }
if (!hash_equals($_SESSION['google_oauth_state'] ?? '', $_GET['state'] ?? '')) fail('Invalid sign-in state. Start the sign-in again.');
unset($_SESSION['google_oauth_state']);
if (empty($_GET['code'])) fail('Google did not return an authorization code.');
function curlJson(string $url, array $options = []): array {
  $curl = curl_init($url); curl_setopt_array($curl, $options + [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 15]);
  $raw = curl_exec($curl); $status = (int)curl_getinfo($curl, CURLINFO_RESPONSE_CODE); curl_close($curl);
  $data = is_string($raw) ? json_decode($raw, true) : null; if ($status < 200 || $status >= 300 || !is_array($data)) fail('Google sign-in could not be verified. Please try again.', 401); return $data;
}
$token = curlJson('https://oauth2.googleapis.com/token', [CURLOPT_POST => true, CURLOPT_POSTFIELDS => http_build_query(['code'=>$_GET['code'], 'client_id'=>$config['google']['client_id'], 'client_secret'=>$config['google']['client_secret'], 'redirect_uri'=>$config['google']['redirect_uri'], 'grant_type'=>'authorization_code']), CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded']]);
if (empty($token['id_token'])) fail('Google did not provide an identity token.', 401);
$identity = curlJson('https://oauth2.googleapis.com/tokeninfo?id_token=' . rawurlencode($token['id_token']));
if (($identity['aud'] ?? '') !== $config['google']['client_id'] || empty($identity['sub']) || empty($identity['email']) || ($identity['email_verified'] ?? 'false') !== 'true') fail('Google account verification failed.', 401);
try { $pdo = new PDO("mysql:host={$config['db']['host']};dbname={$config['db']['name']};charset=utf8mb4", $config['db']['user'], $config['db']['pass'], [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]); } catch (Throwable) { fail('The DUALINK database is unavailable.', 503); }
$upsert=$pdo->prepare('INSERT INTO users(google_sub,email,display_name,avatar_url) VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE email=VALUES(email), display_name=VALUES(display_name), avatar_url=VALUES(avatar_url)');
$upsert->execute([$identity['sub'], $identity['email'], $identity['name'] ?? $identity['email'], $identity['picture'] ?? null]);
$user=$pdo->prepare('SELECT id FROM users WHERE google_sub=?'); $user->execute([$identity['sub']]); $userId=(int)$user->fetchColumn();
$rawSession=bin2hex(random_bytes(32)); $insert=$pdo->prepare('INSERT INTO sessions(user_id,token_hash,expires_at) VALUES(?,?,DATE_ADD(NOW(), INTERVAL 30 DAY))'); $insert->execute([$userId,hash('sha256',$rawSession)]);
$secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'); setcookie('dualink_session',$rawSession,['expires'=>time()+60*60*24*30,'path'=>'/','secure'=>$secure,'httponly'=>true,'samesite'=>'Lax']);
header('Location: ' . rtrim($config['app_url'], '/') . '/app.html'); exit;
