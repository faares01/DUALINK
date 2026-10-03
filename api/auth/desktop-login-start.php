<?php
declare(strict_types=1);
require __DIR__ . '/../bootstrap.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(['error'=>'Method not allowed'],405);
$request=bin2hex(random_bytes(32)); $poll=bin2hex(random_bytes(32));
$q=$pdo->prepare('INSERT INTO desktop_login_requests(request_hash,poll_hash,expires_at) VALUES(?,?,DATE_ADD(NOW(), INTERVAL 5 MINUTE))');
$q->execute([hash('sha256',$request),hash('sha256',$poll)]);
respond(['request'=>$request,'poll'=>$poll,'expires_in'=>300],201);
