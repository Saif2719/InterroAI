<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: ../loginpage/login.html");
    exit();
}

// Handle logout
if (isset($_GET['logout'])) {
    session_unset();
    session_destroy();
    header("Location: ../loginpage/login.html");
    exit();
}
include 'main.html';
?>
