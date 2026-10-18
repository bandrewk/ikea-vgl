<?php
// Page-load counter for the footer. Stores a single number and nothing
// about the visitor (no IP, no User-Agent, no cookies).

header('Content-Type: application/json');
header('Cache-Control: no-store');

$file = __DIR__ . '/counter.txt';
$handle = fopen($file, 'c+');

if ($handle === false || !flock($handle, LOCK_EX)) {
    http_response_code(503);
    echo json_encode(['error' => 'unavailable']);
    exit;
}

$count = (int) stream_get_contents($handle) + 1;

rewind($handle);
ftruncate($handle, 0);
fwrite($handle, (string) $count);
fflush($handle);
flock($handle, LOCK_UN);
fclose($handle);

echo json_encode(['count' => $count]);
