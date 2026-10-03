<?php
require __DIR__ . '/bootstrap.php';
$uid = userId();
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $q=$pdo->prepare('SELECT display_name,onboarding_data,onboarded_at FROM users WHERE id=?');$q->execute([$uid]);$user=$q->fetch();
  respond(['complete'=>!empty($user['onboarded_at']),'profile'=>$user]);
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data=body(); $payload=['first_device'=>$data['first_device']??null,'sync_intent'=>$data['sync_intent']??null,'completed_at'=>gmdate('c')];
  $q=$pdo->prepare('UPDATE users SET onboarding_data=?, onboarded_at=NOW() WHERE id=?');$q->execute([json_encode($payload,JSON_UNESCAPED_SLASHES),$uid]);
  respond(['ok'=>true]);
}
respond(['error'=>'Method not allowed'],405);
