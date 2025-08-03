function validateEmail() {
    const emailInput = document.getElementById('emailInput').value;
    const errorMessage = document.getElementById('errorMessage');
    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const password = document.getElementById('password').value;

    if (emailInput === "") {
        errorMessage.textContent = "Please enter your Gmail address";
        errorMessage.style.display = 'block';
        return false;
    }

    if (!gmailPattern.test(emailInput)) {
        errorMessage.textContent = "Invalid Gmail address, Please use valid email.";
        errorMessage.style.display = 'block';
        return false;
    
    } 


    
    if (!password) {
        errorMessage.textContent = "Please enter a password.";
        errorMessage.style.display = "block";
        return false;
    }
    

    alert("logged in!");
    
  
}