<?php
/*
 * SERVER ONLY. Copy this file to api/config.php ON THE SERVER, not in this repository.
 * Better: put it outside public_html and change the $configFile paths in api/*.php.
 */
return [
  'db' => [
    'host' => '127.0.0.1',
    'name' => 'YOUR_DATABASE_NAME',
    'user' => 'YOUR_DATABASE_USER',
    'pass' => 'SERVER_ONLY_SECRET',
  ],
  'google' => [
    'client_id' => 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    'client_secret' => 'SERVER_ONLY_GOOGLE_SECRET',
    'redirect_uri' => 'https://your-domain.com/api/auth/google-callback.php',
  ],
  'app_url' => 'https://your-domain.com',
];
