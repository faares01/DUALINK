<?php
require __DIR__ . '/../bootstrap.php';
$uid=userId();
$q=$pdo->prepare('SELECT id,email,display_name,avatar_url,created_at FROM users WHERE id=?'); $q->execute([$uid]);
respond(['user'=>$q->fetch()]);
