<?php
session_start();

// 🚫 Prevent browser caching of logged-in pages
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

// ✅ Handle logout request
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

    // Redirect to login page after logout
    header("Location: ../loginpage/login.html");
    exit();
}

// ✅ Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    // Alert user if trying to access page after logout/back button
    echo "<script>
            alert('Please login again!');
            window.location.href = '../loginpage/login.html';
          </script>";
    exit();
}

// ✅ Load protected content
include 'main.html';
?>
