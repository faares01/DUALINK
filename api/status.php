<?php
require __DIR__ . '/bootstrap.php';
$uid=userId();
$q=$pdo->prepare("SELECT COALESCE(SUM(CASE WHEN source_device_id IS NOT NULL THEN size_bytes ELSE 0 END),0) uploaded_bytes, COALESCE(SUM(CASE WHEN target_device_id IS NOT NULL THEN size_bytes ELSE 0 END),0) downloaded_bytes, SUM(status IN ('queued','uploading')) queued_files FROM transfers WHERE user_id=? AND created_at >= CURDATE()");
$q->execute([$uid]); respond(['status'=>$q->fetch()]);
