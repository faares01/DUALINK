<?php
require __DIR__.'/bootstrap.php'; $uid=userId();
if($_SERVER['REQUEST_METHOD']==='GET'){ $q=$pdo->prepare('SELECT * FROM folder_mappings WHERE user_id=? ORDER BY created_at DESC');$q->execute([$uid]);respond(['mappings'=>$q->fetchAll()]); }
if($_SERVER['REQUEST_METHOD']==='POST'){ $d=body(); foreach(['linux_path','windows_path','direction'] as $key) if(empty($d[$key]))respond(['error'=>"$key is required"],422); $q=$pdo->prepare('INSERT INTO folder_mappings(user_id,linux_path,windows_path,direction) VALUES(?,?,?,?)');$q->execute([$uid,$d['linux_path'],$d['windows_path'],$d['direction']]);respond(['id'=>$pdo->lastInsertId()],201); } respond(['error'=>'Method not allowed'],405);
