function validateEmail() {
    const emailInput = document.getElementById('emailInput').value.trim();
    const errorMessage = document.getElementById('errorMessage');
    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const password = document.getElementById('password').value.trim();

    errorMessage.textContent = ""; // Clear previous errors
    errorMessage.style.display = "none";

    if (!emailInput) {
        errorMessage.textContent = "Please enter your Gmail address";
        errorMessage.style.display = 'block';
        return false;
    }

    if (!gmailPattern.test(emailInput)) {
        errorMessage.textContent = "Invalid Gmail address. Please use a valid Gmail account.";
        errorMessage.style.display = 'block';
        return false;
    } 

    if (!password) {
        errorMessage.textContent = "Please enter a password.";
        errorMessage.style.display = "block";
        return false;
    }

    return true;
}

async function submitLoginForm(event) {
    event.preventDefault();
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = "";
    errorMessage.style.display = "none";

    if (!validateEmail()) return; // Validate first

    const form = event.target;
    const formData = new FormData(form);

    try {
        const response = await fetch(form.action, { 
            method: 'POST', 
            body: formData 
        });
        const text = await response.text();
        console.log("Server response:", text);

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            throw new Error("Invalid JSON: " + text);
        }

        if (data.success) {
            window.location.href = data.redirect || "../mainpage/main.php";
        } else {
            errorMessage.textContent = data.message || "Login failed.";
            errorMessage.style.display = "block";
        }
    } catch (error) {
        errorMessage.textContent = error.message.includes("JSON") 
            ? "Server error. Please try again." 
            : error.message;
        errorMessage.style.display = "block";
        console.error("Error:", error);
    }
}

// Attach event listener (fixed by correcting HTML ID)
document.getElementById('loginForm').addEventListener('submit', submitLoginForm);