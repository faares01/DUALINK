<?php
require __DIR__.'/bootstrap.php'; $uid=userId();
if($_SERVER['REQUEST_METHOD']==='GET'){ $q=$pdo->prepare('SELECT id,title,body,updated_at FROM notes WHERE user_id=? ORDER BY updated_at DESC');$q->execute([$uid]);respond(['notes'=>$q->fetchAll()]); }
if($_SERVER['REQUEST_METHOD']==='POST'){ $d=body();$q=$pdo->prepare('INSERT INTO notes(user_id,title,body) VALUES(?,?,?)');$q->execute([$uid,substr($d['title']??'',0,180),$d['body']??'']);respond(['id'=>$pdo->lastInsertId()],201); }
if($_SERVER['REQUEST_METHOD']==='PUT'){ $d=body(); if(empty($d['id']))respond(['error'=>'Note id is required'],422); $q=$pdo->prepare('UPDATE notes SET title=?, body=? WHERE id=? AND user_id=?');$q->execute([substr($d['title']??'',0,180),$d['body']??'',(int)$d['id'],$uid]); if($q->rowCount()===0)respond(['error'=>'Note not found'],404);respond(['ok'=>true]); }
respond(['error'=>'Method not allowed'],405);
