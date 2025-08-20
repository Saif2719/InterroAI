<?php
session_start();

// 🚫 Prevent browser caching of logged-in pages
header("Cache-Control: no-cache, no-store, must-revalidate"); 
header("Pragma: no-cache");
header("Expires: 0");

// ✅ Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: ../loginpage/login.html");
    exit();
}

// ✅ Handle logout
if (isset($_GET['logout'])) {
    session_unset();
    session_destroy();

    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    header("Location: ../loginpage/login.html");
    exit();
}

// Load your main UI
include 'main.html';
