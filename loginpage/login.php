<?php
session_start();
header('Content-Type: application/json');

// Catch PHP warnings and send as JSON
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    echo json_encode([
        "success" => false,
        "message" => "PHP Error: $errstr"
    ]);
    exit;
});

// Database connection
$servername = "localhost:3307";
$username = "root";
$password = "";
$dbname = "login";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed."]);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = trim($_POST['email'] ?? '');
    $pass = trim($_POST['password'] ?? '');

    if (empty($email) || empty($pass)) {
        echo json_encode(["success" => false, "message" => "Email and password are required."]);
        exit();
    }

    $email = mysqli_real_escape_string($conn, $email);

    $sql = "SELECT * FROM logs WHERE email = '$email' LIMIT 1";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();

        if (password_verify($pass, $row['password'])) {
            $_SESSION['email'] = $email;
            echo json_encode(["success" => true, "redirect" => "../mainpage/main.html"]);
        } else {
            echo json_encode(["success" => false, "message" => "Invalid password."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "No account found with that email."]);
    }
}

$conn->close();
?>