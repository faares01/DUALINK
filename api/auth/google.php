<?php
// Google-only OAuth entry point. Register this exact redirect URI in Google Cloud Console.
session_start(); $config=require __DIR__.'/../config.php';
$state=bin2hex(random_bytes(24)); $_SESSION['google_oauth_state']=$state;
$desktop = ($_GET['desktop'] ?? '') === '1';
$_SESSION['google_oauth_desktop'] = false;
if ($desktop) {
  $request=(string)($_GET['request'] ?? '');
  if (!preg_match('/^[a-f0-9]{64}$/', $request)) { http_response_code(400); exit('Invalid desktop sign-in request. Open DUALINK and try again.'); }
  try { $pdo=new PDO("mysql:host={$config['db']['host']};dbname={$config['db']['name']};charset=utf8mb4",$config['db']['user'],$config['db']['pass'],[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]); $q=$pdo->prepare('SELECT id FROM desktop_login_requests WHERE request_hash=? AND expires_at > NOW() AND consumed_at IS NULL'); $q->execute([hash('sha256',$request)]); if(!$q->fetch()) throw new RuntimeException(); } catch (Throwable) { http_response_code(400); exit('This desktop sign-in request expired. Return to DUALINK and start again.'); }
  $_SESSION['google_oauth_desktop'] = true; $_SESSION['google_oauth_request'] = $request;
}
$params=['client_id'=>$config['google']['client_id'],'redirect_uri'=>$config['google']['redirect_uri'],'response_type'=>'code','scope'=>'openid email profile','state'=>$state,'access_type'=>'online','prompt'=>'select_account'];
header('Location: https://accounts.google.com/o/oauth2/v2/auth?'.http_build_query($params)); exit;
