$(document).ready(function() {
    // Initialize phone input
    const phoneInput = window.intlTelInput(document.querySelector("#phone"), {
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
        separateDialCode: true,
        preferredCountries: ['in', 'us', 'gb'],
        hiddenInput: "full_phone",
        initialCountry: "auto",
        geoIpLookup: function(callback) {
            fetch("https://ipapi.co/json")
                .then(res => res.json())
                .then(data => callback(data.country_code))
                .catch(() => callback("us"));
        }
    });

    // Date of Birth options
    const days = Array.from({length: 31}, (_, i) => i + 1);
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentYear = new Date().getFullYear();
    const years = Array.from({length: 100}, (_, i) => currentYear - i);

    $('#day').append(days.map(d => new Option(d, d)));
    $('#month').append(months.map((m, i) => new Option(m, i + 1)));
    $('#year').append(years.map(y => new Option(y, y)));

    // Form navigation
    let currentStep = 1;
    const totalSteps = 4;

    $('.btn-next').click(function() {
        if(validateStep(currentStep)) {
            showStep(currentStep + 1);
            updateProgress();
        }
    });

    $('.btn-prev').click(function() {
        showStep(currentStep - 1);
        updateProgress();
    });

    function showStep(step) {
        currentStep = step;
        $('.form-step').removeClass('active');
        $(`[data-step="${step}"]`).addClass('active');
    }

    function updateProgress() {
        const progress = (currentStep - 1) / (totalSteps - 1) * 100;
        $('#progress').css('width', progress + '%');
    }

    // Password strength
    $('#password').on('input', function() {
        const password = $(this).val();
        const strength = calculatePasswordStrength(password);
        $('.strength-meter').css('width', strength.percentage + '%');
        $('.strength-text').text(strength.text).css('color', strength.color);
    });

    // Form validation
    function validateStep(step) {
        let isValid = true;
        const $currentStep = $(`[data-step="${step}"]`);

        // Clear previous errors
        $currentStep.find('.error').text('');

        // Check required fields
        $currentStep.find('input, select').each(function() {
            const $input = $(this);
            const value = $input.val().trim();

            // Skip hidden phone input
            if($input.attr('name') === 'full_phone') return;

            // Check required fields
            if($input.prop('required') && !value) {
                showError($input, 'This field is required');
                isValid = false;
            }

            // Special validations
            switch($input.attr('id')) {
                case 'email':
                    if(!validateEmail(value)) {
                        showError($input, 'Invalid email address');
                        isValid = false;
                    }
                    break;
                case 'phone':
                    if(!phoneInput.isValidNumber()) {
                        showError($input, 'Invalid phone number');
                        isValid = false;
                    }
                    break;
                case 'password':
                    if(!validatePassword(value)) {
                        showError($input, 'Password must be at least 8 characters');
                        isValid = false;
                    }
                    break;
                case 'confirmPassword':
                    if(value !== $('#password').val()) {
                        showError($input, 'Passwords do not match');
                        isValid = false;
                    }
                    break;
            }
        });

        // Check radio buttons
        if(step === 4) {
            const frequencySelected = $('[name="frequency"]:checked').length > 0;
            if(!frequencySelected) {
                showError($currentStep.find('[name="frequency"]').first().parent().parent(), 'Please select travel frequency');
                isValid = false;
            }

            // Check terms checkbox
            if(!$('#terms').prop('checked')) {
                showError($('#terms').parent().parent(), 'You must agree to the terms');
                isValid = false;
            }
        }

        return isValid;
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePassword(password) {
        return password.length >= 8;
    }

    function calculatePasswordStrength(password) {
        const strength = {
            percentage: 0,
            text: 'Weak',
            color: '#e74c3c'
        };

        if(password.length >= 8) strength.percentage += 25;
        if(/[A-Z]/.test(password)) strength.percentage += 25;
        if(/[0-9]/.test(password)) strength.percentage += 25;
        if(/[^A-Za-z0-9]/.test(password)) strength.percentage += 25;

        if(strength.percentage >= 75) {
            strength.text = 'Strong';
            strength.color = '#3CB371';
        } else if(strength.percentage >= 50) {
            strength.text = 'Medium';
            strength.color = '#FF8C00';
        }

        return strength;
    }

    function showError(input, message) {
        const $error = input.closest('.input-group').find('.error');
        $error.text(message).css('color', '#e74c3c');
    }

    // Form submission
    $('#signupForm').submit(function(e) {
        e.preventDefault();
        if(validateStep(currentStep)) {
            // Simulate form submission
            $('.btn-submit').prop('disabled', true).text('Creating Account...');
            
            setTimeout(() => {
                // Hide form and show success message
                $('.signup-container').hide();
                $('.success-message').addClass('active');
            }, 1500);
        }
    });
});