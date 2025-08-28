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

// ---- Helper functions ----
function uiBusy(on) {
  // Removed topicInput/startBtn handling
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

// ---- Answering logic ----
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
    // quiz finished
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
  questions = [];
  answers = [];
  currentIndex = 0;
  updateProgress();
});

document.getElementById("closeBtn").addEventListener("click", function () {
  window.location.href = "../mainpage/main.html"; // redirect to main page
});

// ---- Timer ----
document.addEventListener("DOMContentLoaded", () => {
  const timerEl = document.getElementById("timer");
  if (!timerEl) return; // skip if missing

  let timeLeft = 20 * 60; // 20 minutes in seconds

  function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerEl.innerHTML = `<i class="fas fa-clock"></i> ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    if (timeLeft > 0) {
      timeLeft--;
    } else {
      clearInterval(timerInterval);
      timerEl.innerHTML = `<i class="fas fa-clock"></i> 0:00`;
      alert("⏰ Time's up!");
      quizBox.classList.add("hidden");
      summaryBox.classList.remove("hidden");
    }
  }

  const timerInterval = setInterval(updateTimer, 1000);
  updateTimer();
});
