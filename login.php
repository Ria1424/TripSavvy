<?php
// Include database configuration
require_once 'config.php';

// Start session
session_start();

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect form data
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = $_POST['password'];
    
    // Input validation
    if (empty($email) || empty($password)) {
        echo "All fields are required";
        exit;
    }
    
    // Check if email exists
    $sql = "SELECT id, first_name, email, password FROM users WHERE email = '$email'";
    $result = mysqli_query($conn, $sql);
    
    if (mysqli_num_rows($result) == 1) {
        $row = mysqli_fetch_assoc($result);
        
        // Verify password
        if (password_verify($password, $row['password'])) {
            // Set session variables
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['email'] = $row['email'];
            $_SESSION['first_name'] = $row['first_name'];
            
            echo "success";
        } else {
            echo "Invalid email or password";
        }
    } else {
        echo "Invalid email or password";
    }
    
    mysqli_close($conn);
}
?>