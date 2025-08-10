<?php
// Database configuration
$db_host = 'localhost:3307';      // Database host with port
$db_username = 'root';           // Database username
$db_password = '';               // Database password
$db_name = 'login';              // Database name

// Create connection
$conn = new mysqli($db_host, $db_username, $db_password, $db_name);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Process form data when form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $fullname = $conn->real_escape_string($_POST['fullname']);
    $email = $conn->real_escape_string($_POST['emailInput']);
    $password = $_POST['password'];
    $confirmPassword = $_POST['confirmpassword'];
    
    // Validate password match
    if ($password !== $confirmPassword) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'errors' => ["Passwords do not match"]]);
        exit();
    }
    
    // Hash the password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // Check if email already exists
    $check_email = "SELECT email FROM logs WHERE email = '$email'";
    $result = $conn->query($check_email);
    
    if ($result && $result->num_rows > 0) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'errors' => ["Email already exists"]]);
        exit();
    }
    
    // Insert user data into database
    $sql = "INSERT INTO logs (fullname, email, password) VALUES ('$fullname', '$email', '$hashed_password')";
    
    if ($conn->query($sql)) {
        // Successful registration
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'redirect' => '../loginpage/login.html']);
        exit();
    } else {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Registration failed.']);
        exit();
    }
}

// Close connection
$conn->close();
?>