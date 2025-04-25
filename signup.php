<?php
// Include database configuration
include 'config.php';
session_start();

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect form data
    $firstName = mysqli_real_escape_string($conn, $_POST['firstName']);
    $lastName = mysqli_real_escape_string($conn, $_POST['lastName']);
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $phone = mysqli_real_escape_string($conn, $_POST['phone']);
    $country = mysqli_real_escape_string($conn, $_POST['country']);
    $password = $_POST['password']; // Will be hashed

    // Process date of birth
    $day = mysqli_real_escape_string($conn, $_POST['day']);
    $month = mysqli_real_escape_string($conn, $_POST['month']);
    $year = mysqli_real_escape_string($conn, $_POST['year']);
    $dob = "$year-$month-$day"; // Format: YYYY-MM-DD

    $travelFrequency = mysqli_real_escape_string($conn, $_POST['frequency']);
    $createdAt = date("Y-m-d H:i:s"); // Current timestamp

    // Input validation
    if (empty($firstName) || empty($lastName) || empty($email) || empty($phone) || 
        empty($country) || empty($password) || empty($dob) || empty($travelFrequency)) {
        echo "error: All fields are required";
        exit;
    }

    // Email validation
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "error: Invalid email format";
        exit;
    }

    // Check if email already exists
    $check_email = "SELECT email FROM users WHERE email = '$email'";
    $result = mysqli_query($conn, $check_email);

    if (mysqli_num_rows($result) > 0) {
        echo "error: Email already exists";
        exit;
    }

    // Password hashing
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Insert user data into database
    $sql = "INSERT INTO users 
            (first_name, last_name, email, phone, country, password, date_of_birth, travel_frequency, created_at) 
            VALUES 
            ('$firstName', '$lastName', '$email', '$phone', '$country', '$hashed_password', '$dob', '$travelFrequency', '$createdAt')";

    if (mysqli_query($conn, $sql)) {
        // Start session and set user data
        session_start();
        $_SESSION['email'] = $email;
        $_SESSION['user_id'] = mysqli_insert_id($conn);
        $_SESSION['first_name'] = $firstName;

        echo "success";
    } else {
        echo "error: " . mysqli_error($conn);
    }

    mysqli_close($conn);
}
?>
