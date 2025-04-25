<?php
// Database configuration
$db_host = "localhost";
$db_user = "root";
$db_pass = "root2004"; // The password you just set         // Your MySQL password - leave empty if no password
$db_name = "tripsavvy";

// Create database connection
$conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Check if database exists, create if not
$db_check = mysqli_query($conn, "SHOW DATABASES LIKE '$db_name'");
if (mysqli_num_rows($db_check) == 0) {
    // Create database
    $sql = "CREATE DATABASE $db_name";
    if (mysqli_query($conn, $sql)) {
        echo "Database created successfully<br>";
    } else {
        die("Error creating database: " . mysqli_error($conn));
    }
}

// Select database
mysqli_select_db($conn, $db_name);

// Check if users table exists, create if not
$table_check = mysqli_query($conn, "SHOW TABLES LIKE 'users'");
if (mysqli_num_rows($table_check) == 0) {
    // Create users table
    $sql = "CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        phone VARCHAR(20) NOT NULL,
        country VARCHAR(50) NOT NULL,
        password VARCHAR(255) NOT NULL,
        date_of_birth DATE NOT NULL,
        travel_frequency VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    if (mysqli_query($conn, $sql)) {
        echo "Users table created successfully";
    } else {
        die("Error creating table: " . mysqli_error($conn));
    }
}
?>