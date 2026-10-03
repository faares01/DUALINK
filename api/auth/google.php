<?php
// Google-only OAuth entry point. Register this exact redirect URI in Google Cloud Console.
session_start(); $config=require __DIR__.'/../config.php';
$state=bin2hex(random_bytes(24)); $_SESSION['google_oauth_state']=$state;
$_SESSION['google_oauth_desktop'] = ($_GET['desktop'] ?? '') === '1';
$params=['client_id'=>$config['google']['client_id'],'redirect_uri'=>$config['google']['redirect_uri'],'response_type'=>'code','scope'=>'openid email profile','state'=>$state,'access_type'=>'online','prompt'=>'select_account'];
header('Location: https://accounts.google.com/o/oauth2/v2/auth?'.http_build_query($params)); exit;
