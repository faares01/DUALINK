<?php
require __DIR__ . '/bootstrap.php';
$uid=userId();
if($_SERVER['REQUEST_METHOD']==='GET'){ $q=$pdo->prepare('SELECT id,name,platform,last_seen_at,created_at FROM devices WHERE user_id=? ORDER BY created_at ASC');$q->execute([$uid]);respond(['devices'=>$q->fetchAll()]); }
if($_SERVER['REQUEST_METHOD']==='POST'){ $d=body(); foreach(['device_key','name','platform'] as $key)if(empty($d[$key]))respond(['error'=>"$key is required"],422); if(!in_array($d['platform'],['linux','windows'],true))respond(['error'=>'Unsupported platform'],422);$q=$pdo->prepare('INSERT INTO devices(user_id,device_key,name,platform,last_seen_at) VALUES(?,?,?,?,NOW()) ON DUPLICATE KEY UPDATE name=VALUES(name),platform=VALUES(platform),last_seen_at=NOW()');$q->execute([$uid,hash('sha256',$d['device_key']),substr($d['name'],0,120),$d['platform']]);$q=$pdo->prepare('SELECT id,name,platform,last_seen_at FROM devices WHERE device_key=?');$q->execute([hash('sha256',$d['device_key'])]);respond(['device'=>$q->fetch()],201); }
respond(['error'=>'Method not allowed'],405);
