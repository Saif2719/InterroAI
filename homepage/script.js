function validateEmail() {
    const emailInput = document.getElementById('emailInput').value;
    const errorMessage = document.getElementById('errorMessage');
    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (emailInput === "") {
        errorMessage.textContent = "Please enter your Gmail address";
        errorMessage.style.display = 'block';
        return;
    }
     if (!gmailPattern.test(emailInput)) {
        errorMessage.textContent = "Please use a valid Gmail.";
        errorMessage.style.display = "block";
        return false;
    }
    

    if (gmailPattern.test(emailInput)) {
        errorMessage.style.display = 'none';
        window.location.href = "../loginpage/login.html";
    
    } 
}
