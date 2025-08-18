// ================= Profile Dropdown =================
document.getElementById('profileBtn').addEventListener('click', function () {
    let menu = document.getElementById('dropdownMenu');
    menu.style.display = (menu.style.display === 'flex') ? 'none' : 'flex';
    menu.style.flexDirection = 'column'; // make dropdown vertical
});

// Handle logout click
document.querySelector('#dropdownMenu a').addEventListener('click', function (e) {
    e.preventDefault(); // Stop default link behavior
    // Redirect to logout via PHP
    window.location.href = "main.php?logout=true";
});

// ================= Hover Effect for Tags =================
document.addEventListener('DOMContentLoaded', function() {
    const tags = document.querySelectorAll('.role-tag,.custom');
    
    tags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 5px 15px rgba(79, 70, 229, 0.2)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
});

// ================= Chatbox, Timer & Progress =================
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    const chatbox = document.getElementById('chatbox');
    const timerDisplay = document.getElementById('timer');
    const progressBar = document.getElementById('progress');

    // Timer setup
    const totalSeconds = 21 * 60;
    let remainingSeconds = totalSeconds;
    let timerInterval;

    // Question progress setup
    let totalQuestions = 10;  
    let answered = 0;

    function updateProgress() {
        let percent = (answered / totalQuestions) * 100;
        progressBar.style.width = percent + "%";
    }

    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (remainingSeconds > 0) {
                remainingSeconds--;
                let minutes = Math.floor(remainingSeconds / 60);
                let seconds = remainingSeconds % 60;
                timerDisplay.textContent = 
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                clearInterval(timerInterval);
                timerDisplay.textContent = "Time's up!";
            }
        }, 1000);
    }

    // Role/Topic button click
    const roleTags = document.querySelectorAll('.role-tag, .custom');
    roleTags.forEach(tag => {
        tag.addEventListener('click', function() {
            container.style.display = "none";
            chatbox.style.display = "flex";

            // Reset timer & progress
            remainingSeconds = totalSeconds;
            timerDisplay.textContent = "21:00";
            startTimer();

            answered = 0;
            updateProgress();
        });
    });

    // ================= Chat input handling =================
    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    document.getElementById('answerInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const input = document.getElementById('answerInput');
        const chatContent = document.getElementById('chatContent');
        const message = input.value.trim();

        if (message !== "") {
            // Add user message
            const userMsg = document.createElement('div');
            userMsg.classList.add('user-message');
            userMsg.textContent = message;
            chatContent.appendChild(userMsg);

            input.value = "";
            chatContent.scrollTop = chatContent.scrollHeight;

            // Mark question as answered
            answered++;
            updateProgress();

            // (Optional) Add placeholder bot reply
            setTimeout(() => {
                const botMsg = document.createElement('div');
                botMsg.classList.add('bot-message');
                botMsg.textContent = "Okay, got it!";
                chatContent.appendChild(botMsg);
                chatContent.scrollTop = chatContent.scrollHeight;
            }, 1000);
        }
    }

    // ✅ Close button handler is inside DOMContentLoaded
    document.getElementById('closeChat').addEventListener('click', function() {
        chatbox.style.display = "none";   // hide chatbox
        document.getElementById('chatContent').innerHTML = "";
        container.style.display = "flex"; // show job roles again
        clearInterval(timerInterval);     // stop timer
    });
});
