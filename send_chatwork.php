<?php
// =======================================
// Chatwork API送信スクリプト
// =======================================
header('Content-Type: application/json; charset=utf-8');

// ======= 設定 =======
$CHATWORK_API_TOKEN = '0bbd4c34e04713c17bd88914ac440622';
$CHATWORK_ROOM_ID   = '360298518';

// ======= 受信 =======
$message = $_POST['message'] ?? '';
if (!$message) {
    http_response_code(400);
    echo json_encode(['error' => 'メッセージがありません']);
    exit;
}

// ======= Chatwork送信 =======
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => "https://api.chatwork.com/v2/rooms/{$CHATWORK_ROOM_ID}/messages",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ["X-ChatWorkToken: {$CHATWORK_API_TOKEN}"],
    CURLOPT_POSTFIELDS => http_build_query(['body' => $message])
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($httpCode);
echo $response;
