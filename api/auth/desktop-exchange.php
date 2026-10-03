<?php
declare(strict_types=1);
require __DIR__ . '/../bootstrap.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(['error'=>'Method not allowed'],405);
$code = (string)(body()['code'] ?? '');
if (!preg_match('/^[a-f0-9]{64}$/', $code)) respond(['error'=>'Invalid desktop sign-in code'],422);
$q=$pdo->prepare('SELECT id,user_id FROM desktop_login_tokens WHERE token_hash=? AND expires_at > NOW()');
$q->execute([hash('sha256',$code)]); $login=$q->fetch();
if (!$login) respond(['error'=>'This desktop sign-in link has expired. Start again from DUALINK.'],401);
$pdo->prepare('DELETE FROM desktop_login_tokens WHERE id=?')->execute([$login['id']]);
$token=bin2hex(random_bytes(32));
$pdo->prepare('INSERT INTO sessions(user_id,token_hash,expires_at) VALUES(?,?,DATE_ADD(NOW(), INTERVAL 30 DAY))')->execute([(int)$login['user_id'],hash('sha256',$token)]);
respond(['token'=>$token,'expires_in'=>2592000]);
