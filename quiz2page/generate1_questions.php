<?php
/**
 * generate1_questions.php
 *
 * Supports:
 *   - GET:  generate1_questions.php?role=Java
 *   - POST: { "topic": "Cloud Computing" }
 *
 * Returns JSON: { "success": true, "questions": [ { "id": 1, "question": "..." }, ... ] }
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

// --- Read topic/role ---
$role = isset($_GET['role']) ? trim($_GET['role']) : null;

if (!$role) {
  $input = json_decode(file_get_contents('php://input'), true);
  $role = isset($input['topic']) ? trim($input['topic']) : '';
}

if ($role === '') {
  http_response_code(400);
  echo json_encode([ 'success' => false, 'error' => 'Missing role/topic.' ]);
  exit;
}

/* ============================== */
/* >>> YOUR API KEY IS HERE <<< */
/* ============================== */

$endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' . urlencode($API_KEY);

// Prompt
$prompt = <<<TXT
You are generating interview-style questions.

TASK:
- Create exactly 10 concise, clear, single-sentence questions for the role/topic: "$role".
- Questions should be moderate level difficulty and to the point.
- Keep simple angles (simple definitions, MCQs, true/false, error spotting).
- Do NOT include answers.
- IMPORTANT: Respond with STRICT JSON ONLY, no markdown, no explanations.

EXPECTED JSON FORMAT:
[
  {"id":1,"question":"..."},
  {"id":2,"question":"..."},
  ...
  {"id":10,"question":"..."}
]
TXT;

$payload = [
  'contents' => [[
    'role' => 'user',
    'parts' => [['text' => $prompt]]
  ]],
  'generationConfig' => [
    'temperature' => 0.7,
    'maxOutputTokens' => 800,
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
  curl_close($ch);
  exit;
}
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode < 200 || $httpCode >= 300) {
  echo json_encode([ 'success' => false, 'error' => 'Gemini API HTTP ' . $httpCode, 'raw' => $response ]);
  exit;
}

$data = json_decode($response, true);

// Extract Gemini text
$jsonText = null;
if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
  $jsonText = $data['candidates'][0]['content']['parts'][0]['text'];
} elseif (isset($data['candidates'][0]['content']['parts'][0]['inline_data']['data'])) {
  $jsonText = base64_decode($data['candidates'][0]['content']['parts'][0]['inline_data']['data']);
}

if (!$jsonText) {
  echo json_encode([ 'success' => false, 'error' => 'No text content from Gemini.', 'raw' => $data ]);
  exit;
}

// Parse JSON
$questions = json_decode($jsonText, true);
if (!is_array($questions)) {
  $jsonText = preg_replace('/^```json|```$/m', '', $jsonText);
  $jsonText = trim($jsonText);
  $questions = json_decode($jsonText, true);
}

if (!is_array($questions)) {
  echo json_encode([ 'success' => false, 'error' => 'Model did not return valid JSON.', 'rawText' => $jsonText ]);
  exit;
}

// Clean & enforce 10 questions
$clean = [];
$id = 1;
foreach ($questions as $q) {
  if (!isset($q['question'])) continue;
  $text = trim((string)$q['question']);
  if ($text === '') continue;
  $clean[] = [
    'id' => $id++,
    'question' => $text
  ];
  if (count($clean) === 10) break;
}

while (count($clean) < 10) {
  $n = count($clean) + 1;
  $clean[] = ['id' => $n, 'question' => "Provide a brief point about $role (question $n)."];
}

echo json_encode([
  'success' => true,
  'questions' => $clean
]);
