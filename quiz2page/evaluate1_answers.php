<?php
/**
 * evaluate_answers.php
 *
 * POST JSON: { "topic": "Cloud Computing", "qa": [ {"id":1,"question":"...","answer":"..."} ] }
 * RETURNS: { "success": true, "results": [...], "total": 82 }
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$topic = $input['topic'] ?? '';
$qa = $input['qa'] ?? [];

if ($topic === '' || !is_array($qa) || count($qa) === 0) {
  http_response_code(400);
  echo json_encode([ 'success' => false, 'error' => 'Missing topic or answers.' ]);
  exit;
}

$API_KEY = ;
$endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' . urlencode($API_KEY);

// Build prompt
$questionsAndAnswers = json_encode($qa, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

$prompt = <<<TXT
You are evaluating answers for interview-style questions on the topic "$topic".

TASK:
- Score each answer from 0 to 10.
- Give one short feedback sentence per answer.
- Return the total marks out of 100.
- Respond ONLY in valid JSON, no markdown, no extra text.

EXPECTED FORMAT:
{
  "results":[
    {"id":1,"question":"...","answer":"...","score":7,"feedback":"..."},
    ...
  ],
  "total": 82
}

DATA TO EVALUATE:
$questionsAndAnswers
TXT;

$payload = [
  'contents' => [[
    'role' => 'user',
    'parts' => [['text' => $prompt]]
  ]],
  'generationConfig' => [
    'temperature' => 0,
    'maxOutputTokens' => 1000,
    'responseMimeType' => 'application/json'
  ]
];

$ch = curl_init($endpoint);
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
  CURLOPT_POST => true,
  CURLOPT_POSTFIELDS => json_encode($payload)
]);

$response = curl_exec($ch);
if ($response === false) {
  echo json_encode([ 'success' => false, 'error' => 'cURL error: ' . curl_error($ch) ]);
  exit;
}
curl_close($ch);

$data = json_decode($response, true);
$jsonText = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;

if (!$jsonText) {
  echo json_encode([ 'success' => false, 'error' => 'No evaluation response.', 'raw' => $data ]);
  exit;
}

$result = json_decode($jsonText, true);
if (!is_array($result)) {
  echo json_encode([ 'success' => false, 'error' => 'Invalid JSON returned.', 'rawText' => $jsonText ]);
  exit;
}

echo json_encode([
  'success' => true,
  'results' => $result['results'] ?? [],
  'total' => $result['total'] ?? 0
]);
?>
