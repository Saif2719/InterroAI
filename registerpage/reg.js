// Combined JS function
function validateForm() {
    const emailInput = document.getElementById('emailInput').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const errorMessage = document.getElementById('errorMessage');

    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    // Validate Email
    if (emailInput === "") {
        errorMessage.textContent = "Please enter your Gmail address.";
        errorMessage.style.display = "block";
        return false;
    }

    if (!gmailPattern.test(emailInput)) {
        errorMessage.textContent = "Please use a valid Gmail.";
        errorMessage.style.display = "block";
        return false;
    }
    

    // Validate Password presence
    if (password === "") {
        errorMessage.textContent = "Please enter a password.";
        errorMessage.style.display = "block";
        return false;
    }

    // Validate Password match
    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match!";
        errorMessage.style.display = "block";
        return false;
    }

    // All validations passed
    errorMessage.style.display = "none";
    alert("Registration successful!");
    
    
    window.location.href = "../loginpage/login.html";
    return true;
}
