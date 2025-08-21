const topicForm = document.getElementById('topicForm');
const topicInput = document.getElementById('topicInput');
const statusEl = document.getElementById('status');

const quizBox = document.getElementById('quizBox');
const questionText = document.getElementById('questionText');
const qBadge = document.getElementById('qBadge');
const answerInput = document.getElementById('answerInput');
const submitAnswerBtn = document.getElementById('submitAnswerBtn');
const skipBtn = document.getElementById('skipBtn');

const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

const summaryBox = document.getElementById('summaryBox');
const answersList = document.getElementById('answersList');
const restartBtn = document.getElementById('restartBtn');


let questions = [];
let currentIndex = 0;
let answers = [];

function uiBusy(on) {
  document.getElementById('startBtn').disabled = on;
  topicInput.disabled = on;
  statusEl.textContent = on ? 'Generating 10 questions from Gemini…' : '';
}

function updateProgress() {
  const total = questions.length || 10;
  const done = Math.min(currentIndex, total);
  const pct = Math.round((done / total) * 100);
  progressBar.style.width = `${pct}%`;
  progressText.textContent = `${done} / ${total}`;
}

function showQuestion(i) {
  const q = questions[i];
  qBadge.textContent = `Q${i + 1}`;
  questionText.textContent = q?.question || '…';
  answerInput.value = '';
  updateProgress();
}

function startQuiz(newQuestions) {
  questions = newQuestions;
  currentIndex = 0;
  answers = [];
  summaryBox.classList.add('hidden');
  quizBox.classList.remove('hidden');
  showQuestion(currentIndex);
}

async function generateQuestions(topic) {
  uiBusy(true);
  try {
    const res = await fetch('generate_questions.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to generate.');
    startQuiz(data.questions);
  } catch (err) {
    console.error(err);
    statusEl.textContent = `Error: ${err.message}`;
  } finally {
    uiBusy(false);
  }
}

topicForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const topic = topicInput.value.trim();
  if (!topic) return;
  generateQuestions(topic);
});

submitAnswerBtn.addEventListener('click', () => {
  const a = answerInput.value.trim();
  answers.push({
    id: questions[currentIndex].id,
    question: questions[currentIndex].question,
    answer: a
  });
  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion(currentIndex);
  } else {
    // done
    quizBox.classList.add('hidden');
    summaryBox.classList.remove('hidden');
    answersList.innerHTML = '';
    answers.forEach((item, idx) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>Q${idx + 1}:</strong> ${item.question}<br/><em>Your answer:</em> ${item.answer || '<span style="color:#94a3b8">[skipped]</span>'}`;
      answersList.appendChild(li);
    });
  }
});

skipBtn.addEventListener('click', () => {
  answers.push({
    id: questions[currentIndex].id,
    question: questions[currentIndex].question,
    answer: ''
  });
  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion(currentIndex);
  } else {
    quizBox.classList.add('hidden');
    summaryBox.classList.remove('hidden');
  }
});

restartBtn?.addEventListener('click', () => {
  summaryBox.classList.add('hidden');
  topicInput.value = '';
  questions = [];
  answers = [];
  currentIndex = 0;
  updateProgress();
});
document.getElementById("closeBtn").addEventListener("click", function () {
  window.location.href = "../mainpage/main.html"; // redirect to main page
});
const evaluateBtn = document.getElementById('evaluateBtn');
const resultsBox = document.getElementById('resultsBox');
const resultsList = document.getElementById('resultsList');
const totalScoreEl = document.getElementById('totalScore');

let currentTopic = "";  // ⚡ store topic globally

async function evaluateAnswers() {
  try {
    evaluateBtn.disabled = true;
    evaluateBtn.textContent = "Evaluating…";

    const res = await fetch('evaluate_answers.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: currentTopic, qa: answers })
    });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to evaluate.');

    // Populate evaluation results
    resultsList.innerHTML = '';
    data.results.forEach(r => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>Q${r.id}:</strong> ${r.question}<br>
                      <em>Your answer:</em> ${r.answer || '<span style="color:#94a3b8">[skipped]</span>'}<br>
                      <em>Score:</em> ${r.score}/10<br>
                      <em>Feedback:</em> ${r.feedback}`;
      resultsList.appendChild(li);
    });
    totalScoreEl.textContent = data.total || 0;
    resultsBox.classList.remove('hidden');

  } catch (err) {
    console.error(err);
    alert("Evaluation failed: " + err.message);
  } finally {
    evaluateBtn.disabled = false;
    evaluateBtn.textContent = "Check Results";
  }
}

topicForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const topic = topicInput.value.trim();
  if (!topic) return;
  currentTopic = topic;   // ⚡ save topic for evaluation step
  generateQuestions(topic);
});

evaluateBtn.addEventListener('click', evaluateAnswers); // ⚡ hook
