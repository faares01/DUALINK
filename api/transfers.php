<?php
require __DIR__ . '/bootstrap.php';
$uid=userId();
function storageRoot(int $uid): string { $root=__DIR__.'/../storage/'.$uid; if(!is_dir($root)&&!mkdir($root,0700,true))respond(['error'=>'Storage is unavailable'],503); return $root; }
function ownedDevice(int $uid,int $id): array { global $pdo; $q=$pdo->prepare('SELECT id FROM devices WHERE id=? AND user_id=?');$q->execute([$id,$uid]);$d=$q->fetch();if(!$d)respond(['error'=>'Unknown device'],404);return $d; }
if($_SERVER['REQUEST_METHOD']==='POST'){
  $target=(int)($_POST['target_device_id']??0);$targetPath=trim($_POST['target_path']??'');$sourcePath=trim($_POST['source_path']??'');$source=(int)($_POST['source_device_id']??0);$upload=$_FILES['file']??null;
  if(!$target||!$targetPath||!$upload||$upload['error']!==UPLOAD_ERR_OK)respond(['error'=>'A target device, target path, and file are required'],422);ownedDevice($uid,$target);if($source)ownedDevice($uid,$source);
  if($upload['size']>1024*1024*1024)respond(['error'=>'Files larger than 1 GB are not supported yet'],413);
  $key=bin2hex(random_bytes(24));$destination=storageRoot($uid).'/'.$key;if(!move_uploaded_file($upload['tmp_name'],$destination))respond(['error'=>'Could not store upload'],500);chmod($destination,0600);
  $q=$pdo->prepare('INSERT INTO transfers(user_id,source_device_id,target_device_id,source_path,target_path,storage_key,file_name,size_bytes,status) VALUES(?,?,?,?,?,?,?,?,"queued")');$q->execute([$uid,$source?:null,$target,$sourcePath,$targetPath,$key,basename($upload['name']),$upload['size']]);respond(['transfer_id'=>$pdo->lastInsertId(),'status'=>'queued'],201);
}
if($_SERVER['REQUEST_METHOD']==='GET'){
  $device=(int)($_GET['device_id']??0);ownedDevice($uid,$device);$id=(int)($_GET['id']??0);
  if($id&&isset($_GET['download'])){$q=$pdo->prepare('SELECT * FROM transfers WHERE id=? AND user_id=? AND target_device_id=? AND status="queued"');$q->execute([$id,$uid,$device]);$t=$q->fetch();if(!$t)respond(['error'=>'Transfer not available'],404);$file=storageRoot($uid).'/'.$t['storage_key'];if(!is_file($file))respond(['error'=>'Transfer file missing'],404);header_remove('Content-Type');header('Content-Type: application/octet-stream');header('Content-Length: '.filesize($file));header('Content-Disposition: attachment; filename="'.rawurlencode($t['file_name']).'"');readfile($file);exit;}
  $q=$pdo->prepare('SELECT id,file_name,target_path,size_bytes,status,created_at FROM transfers WHERE user_id=? AND target_device_id=? AND status="queued" ORDER BY created_at ASC');$q->execute([$uid,$device]);respond(['transfers'=>$q->fetchAll()]);
}
if($_SERVER['REQUEST_METHOD']==='PATCH'){$d=body();$device=(int)($d['device_id']??0);$id=(int)($d['id']??0);ownedDevice($uid,$device);$q=$pdo->prepare('UPDATE transfers SET status="completed",completed_at=NOW() WHERE id=? AND user_id=? AND target_device_id=? AND status="queued"');$q->execute([$id,$uid,$device]);respond(['ok'=>true]);}
respond(['error'=>'Method not allowed'],405);
