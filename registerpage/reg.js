// This function is called by the form's onsubmit event to validate user input
function validateForm() {
    
    const fullname = document.getElementById('fullname').value.trim();
    const emailInput = document.getElementById('emailInput').value.trim();
    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const errorMessage = document.getElementById('errorMessage');

    

    // Hide error message initially
    errorMessage.style.display = "none";

    // Validate Fullname
    if (fullname === "") {
        errorMessage.textContent = "Please enter your name.";
        errorMessage.style.display = "block";
        return false; // Prevent form submission
    }

    // Validate Email presence
    if (emailInput === "") {
        errorMessage.textContent = "Please enter your email address.";
        errorMessage.style.display = "block";
        return false; // Prevent form submission
    }
    
    // Validate Email pattern
    if (!gmailPattern.test(emailInput)) {
        errorMessage.textContent = "Please enter a valid email address.";
        errorMessage.style.display = "block";
        return false; // Prevent form submission
    }

    // Validate Password presence
    if (password === "") {
        errorMessage.textContent = "Please enter a password.";
        errorMessage.style.display = "block";
        return false; // Prevent form submission
    }

    // Validate Password match
    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match!";
        errorMessage.style.display = "block";
        return false; // Prevent form submission
    }

    // All client-side validations passed.
    // Allow the form to be submitted to the server (register.php).
    return true; 
}


function submitForm(event) {
    event.preventDefault(); // Prevent default form submission
    

    // Call validateForm and only proceed if it returns true
    if (!validateForm()) {
        return false;
    }

    const form = document.getElementById('registrationForm');
    const formData = new FormData(form);
    const errorMessage = document.getElementById('errorMessage');

    fetch(form.action, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // ✅ Redirect to login page
            window.location.href = data.redirect;
        } else {
            // Show server-side validation errors
            showError(data.errors ? data.errors.join('<br>') : 'Registration failed.');
        }
    })
    .catch(error => {
        showError("An error occurred. Please try again.");
        console.error('Error:', error);
    });

    function showError(message) {
        errorMessage.innerHTML = message;
        errorMessage.style.display = "block";
    }
}

// Attach the custom submit handler to the form
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('registrationForm').addEventListener('submit', submitForm);
})
