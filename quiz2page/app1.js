// ---- Elements ----
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
const resultsBox = document.getElementById('resultsBox');
const resultsList = document.getElementById('resultsList');
const totalScoreEl = document.getElementById('totalScore');
const evaluateBtn = document.getElementById('evaluateBtn');

let questions = [];
let currentIndex = 0;
let answers = [];
let role = "";

// ---- Helper functions ----
function uiBusy(on) {
  statusEl.textContent = on ? 'Generating 10 questions…' : '';
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
  resultsBox.classList.add('hidden');
  quizBox.classList.remove('hidden');
  showQuestion(currentIndex);
}

// ---- Answering logic ----
submitAnswerBtn.addEventListener('click', () => {
  answers.push({
    id: questions[currentIndex].id,
    question: questions[currentIndex].question,
    answer: answerInput.value.trim()
  });
  currentIndex++;
  if (currentIndex < questions.length) showQuestion(currentIndex);
  else finishQuiz();
});

skipBtn.addEventListener('click', () => {
  answers.push({
    id: questions[currentIndex].id,
    question: questions[currentIndex].question,
    answer: ''
  });
  currentIndex++;
  if (currentIndex < questions.length) showQuestion(currentIndex);
  else finishQuiz();
});

function finishQuiz() {
  quizBox.classList.add('hidden');
  summaryBox.classList.remove('hidden');
  answersList.innerHTML = '';
  answers.forEach((item, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>Q${idx + 1}:</strong> ${item.question}<br/><em>Your answer:</em> ${item.answer || '<span style="color:#94a3b8">[skipped]</span>'}`;
    answersList.appendChild(li);
  });
  evaluateBtn.classList.remove('hidden');
}

// ---- Restart / Close ----
function restartQuiz() {
  summaryBox.classList.add('hidden');
  resultsBox.classList.add('hidden');
  quizBox.classList.add('hidden');
  answers = [];
  currentIndex = 0;
  progressBar.style.width = "0%";
  progressText.textContent = "0 / 10";

  if (role) {
    uiBusy(true);
    fetch(`generate1_questions.php?role=${encodeURIComponent(role)}`)
      .then(res => res.json())
      .then(data => {
        uiBusy(false);
        if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
          startQuiz(data.questions);
        } else {
          statusEl.textContent = "⚠️ No questions received for " + role;
        }
      })
      .catch(err => {
        uiBusy(false);
        console.error("Fetch error:", err);
        statusEl.textContent = "❌ Error loading questions.";
      });
  }
}

function closeQuiz() {
  window.location.href = "../mainpage/main.html";
}

function attachControlButtons() {
  const buttons = [
    document.getElementById('restartBtn'),
    document.getElementById('closeBtn'),
    document.getElementById('restartBtn2'),
    document.getElementById('closeBtn2')
  ];

  buttons.forEach(btn => {
    if (!btn) return;
    if (btn.id.includes('restart')) btn.addEventListener('click', restartQuiz);
    if (btn.id.includes('close')) btn.addEventListener('click', closeQuiz);
  });
}

// ---- Timer ----
function startTimer() {
  const timerEl = document.getElementById("timer");
  if (!timerEl) return;
  let timeLeft = 20 * 60; // 20 minutes

  function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerEl.innerHTML = `<i class="fas fa-clock"></i> ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    if (timeLeft > 0) timeLeft--;
    else {
      clearInterval(timerInterval);
      timerEl.innerHTML = `<i class="fas fa-clock"></i> 0:00`;
      alert("⏰ Time's up!");
      quizBox.classList.add("hidden");
      finishQuiz();
    }
  }

  const timerInterval = setInterval(updateTimer, 1000);
  updateTimer();
}

// ---- Fetch questions ----
function loadQuestions() {
  const urlParams = new URLSearchParams(window.location.search);
  role = urlParams.get("role") || "";

  if (role) {
    uiBusy(true);
    fetch(`generate1_questions.php?role=${encodeURIComponent(role)}`)
      .then(res => res.json())
      .then(data => {
        uiBusy(false);
        if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
          startQuiz(data.questions);
        } else {
          statusEl.textContent = "⚠️ No questions received for " + role;
        }
      })
      .catch(err => {
        uiBusy(false);
        console.error("Fetch error:", err);
        statusEl.textContent = "❌ Error loading questions.";
      });
  }
}

// ---- Evaluate answers ----
evaluateBtn?.addEventListener('click', () => {
  evaluateBtn.disabled = true;
  evaluateBtn.textContent = "⏳ Checking results...";

  fetch("evaluate1_answers.php", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ topic: role, qa: answers })
  })
  .then(res => res.json())
  .then(data => {
    evaluateBtn.disabled = false;
    evaluateBtn.textContent = "Check Results";

    if (data.success) {
      summaryBox.classList.add("hidden");
      resultsBox.classList.remove("hidden");
      resultsBox.style.setProperty("display", "block", "important");

      resultsList.innerHTML = "";
      data.results.forEach((r, idx) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>Q${idx + 1}:</strong> ${r.question}<br/>
          <em>Your answer:</em> ${r.answer || "<span style='color:#94a3b8'>[skipped]</span>"}<br/>
          <em>Score:</em> ${r.score}/10<br/>
          <em>Feedback:</em> ${r.feedback}
        `;
        resultsList.appendChild(li);
      });

      totalScoreEl.textContent = data.total ?? 0;
    } else {
      alert("❌ Evaluation failed: " + data.error);
    }
  })
  .catch(err => {
    evaluateBtn.disabled = false;
    evaluateBtn.textContent = "Check Results";
    console.error("Evaluation error:", err);
    alert("⚠️ Error checking results.");
  });
});

// ---- Initialize ----
document.addEventListener("DOMContentLoaded", () => {
  attachControlButtons();
  loadQuestions();
  startTimer();
});
