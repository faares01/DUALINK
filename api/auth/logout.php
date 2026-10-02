<?php
require __DIR__ . '/../bootstrap.php';
$token=sessionToken(); if($token){$q=$pdo->prepare('DELETE FROM sessions WHERE token_hash=?');$q->execute([hash('sha256',$token)]);}
setcookie('dualink_session','',['expires'=>time()-3600,'path'=>'/','httponly'=>true,'samesite'=>'Lax']); respond(['ok'=>true]);
