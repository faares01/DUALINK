<?php
declare(strict_types=1);
require __DIR__ . '/../bootstrap.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(['error'=>'Method not allowed'],405);
$data=body(); $request=(string)($data['request'] ?? ''); $poll=(string)($data['poll'] ?? '');
if (!preg_match('/^[a-f0-9]{64}$/',$request) || !preg_match('/^[a-f0-9]{64}$/',$poll)) respond(['error'=>'Invalid sign-in request'],422);
$q=$pdo->prepare('SELECT id,user_id FROM desktop_login_requests WHERE request_hash=? AND poll_hash=? AND expires_at > NOW() AND consumed_at IS NULL');
$q->execute([hash('sha256',$request),hash('sha256',$poll)]); $login=$q->fetch();
if (!$login) respond(['error'=>'This desktop sign-in request expired. Start again from DUALINK.'],401);
if (!$login['user_id']) respond(['status'=>'pending'],202);
$pdo->prepare('UPDATE desktop_login_requests SET consumed_at=NOW() WHERE id=?')->execute([$login['id']]);
$token=bin2hex(random_bytes(32)); $pdo->prepare('INSERT INTO sessions(user_id,token_hash,expires_at) VALUES(?,?,DATE_ADD(NOW(), INTERVAL 30 DAY))')->execute([(int)$login['user_id'],hash('sha256',$token)]);
respond(['token'=>$token,'expires_in'=>2592000]);
