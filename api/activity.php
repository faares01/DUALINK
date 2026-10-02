<?php
require __DIR__ . '/bootstrap.php';
$uid=userId();
$q=$pdo->prepare('SELECT id,file_name,source_path,target_path,size_bytes,status,created_at,completed_at FROM transfers WHERE user_id=? ORDER BY created_at DESC LIMIT 30');
$q->execute([$uid]); respond(['activity'=>$q->fetchAll()]);
