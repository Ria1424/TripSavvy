document.getElementById("nextButton").addEventListener("click", function () {
    const email = document.getElementById("email").value;
    const emailError = document.getElementById("emailError");

    // Email validation using regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        emailError.textContent = "Please enter a valid email address.";
    } else {
        emailError.textContent = "";
        document.getElementById("passwordGroup").style.display = "block";
        document.getElementById("submitButton").style.display = "block";
        document.getElementById("nextButton").style.display = "none";
    }
});

document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission to handle validation
    
    const password = document.getElementById("password").value;
    const passwordError = document.getElementById("passwordError");

    // Basic password validation
    if (password.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters long.";
    } else {
        passwordError.textContent = "";
        // Redirect to home.html
        window.location.href = "home.html";
    }
});