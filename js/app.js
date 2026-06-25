(function() {
    'use strict';

    // ==========================================================================
    // 1. AngularJS Module & Routing Config
    // ==========================================================================
    angular.module('tripSavvyApp', ['ngRoute'])
        .config(RouteConfig)
        .factory('TripStateService', TripStateService)
        .controller('MainController', MainController)
        .controller('LandingController', LandingController)
        .controller('LoginController', LoginController)
        .controller('SignupController', SignupController)
        .controller('ExploreController', ExploreController)
        .controller('ActivitiesController', ActivitiesController)
        .controller('GuidesController', GuidesController)
        .controller('DashboardController', DashboardController)
        .controller('BlogController', BlogController)
        .controller('ContactController', ContactController)
        .controller('CalendarController', CalendarController);

    RouteConfig.$inject = ['$routeProvider'];
    function RouteConfig($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'templates/landing.html',
                controller: 'LandingController'
            })
            .when('/login', {
                templateUrl: 'templates/login.html',
                controller: 'LoginController'
            })
            .when('/signup', {
                templateUrl: 'templates/signup.html',
                controller: 'SignupController'
            })
            .when('/explore', {
                templateUrl: 'templates/exploredestinations.html',
                controller: 'ExploreController'
            })
            .when('/activities', {
                templateUrl: 'templates/local.html',
                controller: 'ActivitiesController'
            })
            .when('/guides', {
                templateUrl: 'templates/guides.html',
                controller: 'GuidesController'
            })
            .when('/blog', {
                templateUrl: 'templates/blog.html',
                controller: 'BlogController'
            })
            .when('/contact', {
                templateUrl: 'templates/contact.html',
                controller: 'ContactController'
            })
            .when('/calendar', {
                templateUrl: 'templates/calendar.html',
                controller: 'CalendarController'
            })
            .when('/dashboard', {
                templateUrl: 'templates/home.html',
                controller: 'DashboardController'
            })
            .otherwise({
                redirectTo: '/'
            });
    }

    // ==========================================================================
    // 2. Shared State Service (Persists user login status and cross-view bookings)
    // ==========================================================================
    TripStateService.$inject = ['$window'];
    function TripStateService($window) {
        const service = {};
        let loggedIn = $window.localStorage.getItem('tripsavvy_loggedin') === 'true';

        service.isLoggedIn = function() {
            return loggedIn;
        };

        service.setLoggedIn = function(status) {
            loggedIn = status;
            $window.localStorage.setItem('tripsavvy_loggedin', status ? 'true' : 'false');
        };

        return service;
    }

    // ==========================================================================
    // 3. MainController (Global Nav & Theme Toggling Scope)
    // ==========================================================================
    MainController.$inject = ['$location', 'TripStateService', '$window', '$scope'];
    function MainController($location, TripStateService, $window, $scope) {
        const main = this;

        // Theme management
        main.activeTheme = $window.localStorage.getItem('tripsavvy_theme') || 'spice';
        main.activeThemeClass = 'theme-' + main.activeTheme;

        main.changeTheme = function(themeName) {
            main.activeTheme = themeName;
            main.activeThemeClass = 'theme-' + themeName;
            $window.localStorage.setItem('tripsavvy_theme', themeName);
        };

        // Navigation state checks
        main.isLoggedIn = function() {
            return TripStateService.isLoggedIn();
        };

        main.logout = function() {
            TripStateService.setLoggedIn(false);
            $location.path('/');
        };

        main.isActiveRoute = function(path) {
            return $location.path() === path;
        };
    }

    // ==========================================================================
    // 4. LandingController (Testimonials carousel, image zoom popup, newsletter)
    // ==========================================================================
    LandingController.$inject = ['$scope', '$timeout'];
    function LandingController($scope, $timeout) {
        // Testimonial details
        const testimonials = [
            { text: "The best travel planning experience I've ever had. Kerala trip was magical!", author: "Ria Chawak" },
            { text: "I found hidden ancient temples in Tamil Nadu that aren't listed on regular travel sites. TripSavvy is truly a gem finder!", author: "Aaryaki Patil" },
            { text: "The guides matched with me in Rajasthan made our family holiday rich with history and completely hassle-free.", author: "Ketakee Joshi" }
        ];

        $scope.currentIndex = 0;
        $scope.currentTestimonial = testimonials[$scope.currentIndex];

        // Manual controls
        $scope.nextTestimonial = function() {
            $scope.currentIndex = ($scope.currentIndex + 1) % testimonials.length;
            $scope.currentTestimonial = testimonials[$scope.currentIndex];
        };

        $scope.prevTestimonial = function() {
            $scope.currentIndex = ($scope.currentIndex - 1 + testimonials.length) % testimonials.length;
            $scope.currentTestimonial = testimonials[$scope.currentIndex];
        };

        // Auto cycling testemonials
        let autoCycle = setInterval(function() {
            $scope.$apply($scope.nextTestimonial);
        }, 5000);

        $scope.$on('$destroy', function() {
            clearInterval(autoCycle);
        });

        // Image Zoom overlay modal logic
        $scope.overlayStyle = { display: 'none' };
        $scope.overlayImgSrc = '';
        $scope.overlayCaptionText = '';

        $scope.zoomImage = function(event) {
            const $img = $(event.target);
            $scope.overlayImgSrc = $img.attr('src');
            $scope.overlayCaptionText = $img.attr('alt');
            $scope.overlayStyle = { display: 'flex' };
        };

        $scope.closeZoom = function() {
            $scope.overlayStyle = { display: 'none' };
        };

        // Newsletter subscribe toast triggers
        $scope.showToast = false;
        $scope.subscribeNewsletter = function(event) {
            event.preventDefault();
            $('#subscribeEmail').val('');
            $scope.showToast = true;
            $timeout(function() {
                $scope.showToast = false;
            }, 4000);
        };
    }

    // ==========================================================================
    // 5. LoginController (Two-stage form validation)
    // ==========================================================================
    LoginController.$inject = ['$scope', '$location', 'TripStateService'];
    function LoginController($scope, $location, TripStateService) {
        $scope.email = '';
        $scope.password = '';
        
        $scope.emailError = '';
        $scope.passwordError = '';
        
        $scope.showNextBtn = true;
        $scope.showPasswordGroup = false;
        $scope.showSubmitBtn = false;

        $scope.clickNext = function() {
            const emailVal = $scope.email.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailVal) {
                $scope.emailError = "Please enter your email address.";
            } else if (!emailPattern.test(emailVal)) {
                $scope.emailError = "Please enter a valid email address.";
            } else {
                $scope.emailError = "";
                // Transition to password section
                $scope.showPasswordGroup = true;
                $scope.showSubmitBtn = true;
                $scope.showNextBtn = false;
                
                // Focus password input box
                setTimeout(() => {
                    document.getElementById('password').focus();
                }, 50);
            }
        };

        $scope.submitLogin = function(event) {
            event.preventDefault();
            const passVal = $scope.password;

            if (!passVal) {
                $scope.passwordError = "Please enter your password.";
            } else if (passVal.length < 6) {
                $scope.passwordError = "Password must be at least 6 characters long.";
            } else {
                $scope.passwordError = "";
                // Log user in and redirect to dashboard
                TripStateService.setLoggedIn(true);
                $location.path('/dashboard');
            }
        };
    }

    // ==========================================================================
    // 6. SignupController (4-step wizard form)
    // ==========================================================================
    SignupController.$inject = ['$scope', '$timeout', '$location', 'TripStateService'];
    function SignupController($scope, $timeout, $location, TripStateService) {
        // Date picker lists
        $scope.daysList = Array.from({length: 31}, (_, i) => i + 1);
        $scope.monthsList = [
            { val: 1, name: 'January' }, { val: 2, name: 'February' }, { val: 3, name: 'March' },
            { val: 4, name: 'April' }, { val: 5, name: 'May' }, { val: 6, name: 'June' },
            { val: 7, name: 'July' }, { val: 8, name: 'August' }, { val: 9, name: 'September' },
            { val: 10, name: 'October' }, { val: 11, name: 'November' }, { val: 12, name: 'December' }
        ];
        const currentYear = new Date().getFullYear();
        $scope.yearsList = Array.from({length: 100}, (_, i) => currentYear - i);

        // Model variables
        $scope.user = {
            firstName: '', lastName: '', email: '', phone: '',
            country: '', password: '', confirmPassword: '',
            dobDay: '', dobMonth: '', dobYear: '', frequency: '', terms: false
        };
        $scope.errors = {};
        
        $scope.currentStep = 1;
        $scope.progressPercentage = 25;
        
        $scope.strength = { percentage: 0, text: 'Very Weak', color: '#e74c3c' };
        $scope.showSuccess = false;
        $scope.isSubmitting = false;
        $scope.submittingText = 'Create Account';

        let iti;

        // Initialize phone flag input after template renders
        $timeout(function() {
            const phoneEl = document.querySelector("#phone");
            if (phoneEl) {
                iti = window.intlTelInput(phoneEl, {
                    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
                    separateDialCode: true,
                    preferredCountries: ['in', 'us', 'gb'],
                    initialCountry: "in"
                });
            }
        });

        // Password analyzer
        $scope.checkPasswordStrength = function() {
            const pass = $scope.user.password;
            const strength = { percentage: 0, text: 'Very Weak', color: '#e74c3c' };

            if (!pass) {
                $scope.strength = strength;
                return;
            }

            if (pass.length >= 8) strength.percentage += 25;
            if (/[A-Z]/.test(pass)) strength.percentage += 25;
            if (/[0-9]/.test(pass)) strength.percentage += 25;
            if (/[^A-Za-z0-9]/.test(pass)) strength.percentage += 25;

            if (strength.percentage >= 100) {
                strength.text = 'Strong';
                strength.color = '#3CB371';
            } else if (strength.percentage >= 50) {
                strength.text = 'Medium';
                strength.color = '#FF8C00';
            } else if (strength.percentage >= 25) {
                strength.text = 'Weak';
                strength.color = '#f1c40f';
            }
            $scope.strength = strength;
        };

        // Navigation Steps
        $scope.goNext = function() {
            if (validateStep($scope.currentStep)) {
                $scope.currentStep++;
                $scope.progressPercentage = ($scope.currentStep / 4) * 100;
            }
        };

        $scope.goPrev = function() {
            if ($scope.currentStep > 1) {
                $scope.currentStep--;
                $scope.progressPercentage = ($scope.currentStep / 4) * 100;
            }
        };

        function validateStep(step) {
            $scope.errors = {};
            let valid = true;

            if (step === 1) {
                if (!$scope.user.firstName.trim()) { $scope.errors.firstName = "First name required"; valid = false; }
                if (!$scope.user.lastName.trim()) { $scope.errors.lastName = "Last name required"; valid = false; }
            }
            else if (step === 2) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!$scope.user.email.trim()) { $scope.errors.email = "Email is required"; valid = false; }
                else if (!emailPattern.test($scope.user.email)) { $scope.errors.email = "Invalid email format"; valid = false; }
                
                if (iti && !iti.isValidNumber()) {
                    $scope.errors.phone = "Invalid phone number";
                    valid = false;
                }
                if (!$scope.user.country) { $scope.errors.country = "Please select country"; valid = false; }
            }
            else if (step === 3) {
                if (!$scope.user.password) { $scope.errors.password = "Password is required"; valid = false; }
                else if ($scope.user.password.length < 8) { $scope.errors.password = "Must be at least 8 characters"; valid = false; }
                
                if ($scope.user.confirmPassword !== $scope.user.password) {
                    $scope.errors.confirmPassword = "Passwords do not match";
                    valid = false;
                }
            }
            return valid;
        }

        // Form Submit
        $scope.submitSignup = function(event) {
            event.preventDefault();
            $scope.errors = {};

            if (!$scope.user.dobDay || !$scope.user.dobMonth || !$scope.user.dobYear) {
                $scope.errors.dob = "Select full date of birth";
                return;
            }
            if (!$scope.user.frequency) {
                $scope.errors.frequency = "Please choose a travel frequency option";
                return;
            }
            if (!$scope.user.terms) {
                $scope.errors.terms = "You must agree to the terms";
                return;
            }

            // Perform mock signup loading
            $scope.isSubmitting = true;
            $scope.submittingText = 'Creating Account...';

            $timeout(function() {
                $scope.showSuccess = true;
                TripStateService.setLoggedIn(true);
            }, 1500);
        };
    }

    // ==========================================================================
    // 7. ExploreController (State Destination Search autocomplete page)
    // ==========================================================================
    ExploreController.$inject = ['$scope', '$location', '$timeout'];
    function ExploreController($scope, $location, $timeout) {
        const destinations = {
            "Gujarat": {
                details: "Gujarat: Known for its diverse culture, heritage sites and the Gir National Park.",
                season: "October to March",
                languages: "Gujarati, Hindi, English",
                highlights: "Statue of Unity, Rann of Kutch, Gir Forest",
                image: "images/hiddengems.jpg",
                badge: "West India"
            },
            "Maharashtra": {
                details: "Maharashtra: Known for its bustling city Mumbai, ancient caves of Ajanta and Ellora, and the scenic Western Ghats mountain range.",
                season: "October to May",
                languages: "Marathi, Hindi, English",
                highlights: "Ajanta & Ellora Caves, Gateway of India, Mahabaleshwar",
                image: "images/guides.jpg",
                badge: "West India"
            },
            "Rajasthan": {
                details: "Rajasthan: Famous for its majestic palaces, historic forts, vibrant culture, and the vast sands of the Thar Desert.",
                season: "November to February",
                languages: "Hindi, Rajasthani, English",
                highlights: "Jaipur City Palace, Mehrangarh Fort, Jaisalmer Dunes",
                image: "images/hero-background.png",
                badge: "North India"
            },
            "Delhi": {
                details: "Delhi: The capital city showcasing historic sites like Red Fort and Qutub Minar alongside modern government structures and bustling bazaars.",
                season: "October to March",
                languages: "Hindi, Punjabi, Urdu, English",
                highlights: "Red Fort, India Gate, Qutub Minar, Lotus Temple",
                image: "images/hero-background.png",
                badge: "North India"
            },
            "Uttar Pradesh": {
                details: "Uttar Pradesh: Home to the iconic Taj Mahal in Agra, sacred cities of Varanasi and Prayagraj, and rich legacies of classical music and royal Mughal kitchens.",
                season: "October to March",
                languages: "Hindi, Urdu, English",
                highlights: "Taj Mahal, Varanasi Ghats, Agra Fort, Fatehpur Sikri",
                image: "images/hero-background.png",
                badge: "North India"
            },
            "Kerala": {
                details: "Kerala: Known for its serene backwaters, palm-fringed beaches, tea gardens of Munnar, and traditional Kathakali dance recitals.",
                season: "September to March",
                languages: "Malayalam, English",
                highlights: "Alleppey Backwaters, Munnar Hills, Kovalam Beach, Periyar Reserve",
                image: "images/festivals.jpg",
                badge: "South India"
            }
        };

        const stateList = Object.keys(destinations);
        $scope.popularStates = ["Gujarat", "Rajasthan", "Kerala", "Maharashtra"];

        $scope.searchText = "";
        $scope.suggestions = [];
        
        $scope.showResultCard = false;
        $scope.activeStateName = "";
        $scope.activeStateData = {};

        // Autocomplete typing logic
        $scope.updateSuggestions = function() {
            const query = $scope.searchText.trim().toLowerCase();
            if (query) {
                $scope.suggestions = stateList.filter(s => s.toLowerCase().includes(query));
            } else {
                $scope.suggestions = [];
            }
        };

        $scope.selectSuggestion = function(stateName) {
            $scope.searchText = stateName;
            $scope.suggestions = [];
            $scope.triggerStateSearch(stateName);
        };

        $scope.clearSearch = function() {
            $scope.searchText = "";
            $scope.suggestions = [];
        };

        $scope.searchState = function() {
            const query = $scope.searchText.trim();
            if (query) {
                $scope.triggerStateSearch(query);
            }
        };

        $scope.loadQuickCard = function(stateName) {
            $scope.searchText = stateName;
            $scope.triggerStateSearch(stateName);
        };

        $scope.triggerStateSearch = function(stateName) {
            const match = stateList.find(key => key.toLowerCase() === stateName.toLowerCase());
            
            if (match) {
                $scope.activeStateName = match;
                $scope.activeStateData = destinations[match];
                $scope.showResultCard = true;
                $scope.suggestions = [];
                
                // Smooth scroll to results block
                $timeout(function() {
                    $('html, body').animate({
                        scrollTop: $('#resultsSection').offset().top - 100
                    }, 400);
                }, 100);
            } else {
                alert(`No details found for "${stateName}". Try searching for: Gujarat, Maharashtra, Rajasthan, Delhi, Uttar Pradesh, or Kerala!`);
            }
        };

        $scope.closeResult = function() {
            $scope.showResultCard = false;
        };

        $scope.addToItinerary = function(stateName) {
            // Save state name in localStorage to import on dashboard!
            localStorage.setItem('tripsavvy_explorer_state', stateName);
            $location.path('/dashboard');
        };
    }

    // ==========================================================================
    // 8. ActivitiesController (Local AngularJS Traditions & scheduling modal)
    // ==========================================================================
    ActivitiesController.$inject = ['$scope', '$window', '$timeout'];
    function ActivitiesController($scope, $window, $timeout) {
        $scope.activities = [
            { id: 1, name: "Kathakali Dance & Expression Show", state: "Kerala", category: "dance", duration: "3 Hours", description: "Experience the stylized classical dance-drama of Kerala, characterized by dramatic makeup, detailed gestures, elaborate costumes, and vibrant expressions.", isBookmarked: false },
            { id: 2, name: "Durga Puja Pandal Hop & Dhunuchi Dance", state: "West Bengal", category: "festival", duration: "5 Days", description: "Observe the grand celebrations honoring Goddess Durga with creative art pandals, traditional drumming (dhak), incense dance, and delicious street food tours.", isBookmarked: false },
            { id: 3, name: "Jaipur Blue Pottery Glazing Craft Class", state: "Rajasthan", category: "craft", duration: "4 Hours", description: "Participate in a clay workshop matching color pigments and glaze art of traditional glazed blue pottery under master potters in a historical Jaipur courtyard.", isBookmarked: false },
            { id: 4, name: "Gir Sanctuary Asiatic Lion Morning Safari", state: "Gujarat", category: "nature", duration: "6 Hours", description: "Embark on an early morning guided open-jeep safari through the deciduous dry forests of Gir, the last sanctuary home to the magnificent Asiatic lions.", isBookmarked: false },
            { id: 5, name: "Desert Camel Safari & Kalbeliya Folk Evening", state: "Rajasthan", category: "nature", duration: "8 Hours", description: "Ride through Thar desert dunes at sunset followed by traditional Kalbeliya snake-dance performances, Rajasthani puppet stories, and a woodfire dinner.", isBookmarked: false },
            { id: 6, name: "Kathak Storytelling Recital & Tatkar", state: "Uttar Pradesh", category: "dance", duration: "2 Hours", description: "Watch a classical storytelling dance recital in Lucknow style featuring rhythmic footwork (tatkar), rapid spins, and expressions of ancient epics.", isBookmarked: false }
        ];

        $scope.searchText = "";
        $scope.selectedCategory = "all";
        $scope.bookmarkedCount = 0;
        $scope.activeActivity = null;

        function init() {
            const saved = JSON.parse($window.localStorage.getItem('tripsavvy_bookmarks') || '[]');
            $scope.activities.forEach(a => {
                if (saved.indexOf(a.id) !== -1) {
                    a.isBookmarked = true;
                }
            });
            recalcBookmarks();
        }

        function recalcBookmarks() {
            $scope.bookmarkedCount = $scope.activities.filter(a => a.isBookmarked).length;
        }

        $scope.setCategory = function(cat) {
            $scope.selectedCategory = cat;
        };

        $scope.categoryFilter = function(act) {
            if ($scope.selectedCategory === 'all') return true;
            return act.category === $scope.selectedCategory;
        };

        $scope.toggleBookmark = function(act) {
            act.isBookmarked = !act.isBookmarked;
            const saved = JSON.parse($window.localStorage.getItem('tripsavvy_bookmarks') || '[]');
            const idx = saved.indexOf(act.id);
            if (act.isBookmarked && idx === -1) saved.push(act.id);
            else if (!act.isBookmarked && idx !== -1) saved.splice(idx, 1);
            $window.localStorage.setItem('tripsavvy_bookmarks', JSON.stringify(saved));
            recalcBookmarks();
        };

        // Modal triggers
        let modalInstance;
        $scope.openBookingModal = function(act) {
            $scope.activeActivity = act;
            document.getElementById('bookingDate').value = '';
            document.getElementById('bookingTime').value = '';

            const modalEl = document.getElementById('bookingModal');
            modalInstance = new $window.bootstrap.Modal(modalEl);
            modalInstance.show();
        };

        $scope.submitBooking = function(event) {
            event.preventDefault();
            const date = document.getElementById('bookingDate').value;
            const slot = document.getElementById('bookingTime').value;

            if (date && slot && $scope.activeActivity) {
                const currentSchedule = JSON.parse($window.localStorage.getItem('tripsavvy_schedule') || '[]');
                currentSchedule.push({
                    name: $scope.activeActivity.name,
                    state: $scope.activeActivity.state,
                    date: date,
                    time: slot,
                    duration: $scope.activeActivity.duration
                });
                $window.localStorage.setItem('tripsavvy_schedule', JSON.stringify(currentSchedule));

                if (modalInstance) {
                    modalInstance.hide();
                }

                // Show Success Toast
                const toastEl = document.getElementById('bookingToast');
                const toast = new $window.bootstrap.Toast(toastEl, { delay: 2500 });
                toast.show();
            }
        };

        init();
    }

    // ==========================================================================
    // 9. GuidesController (Hiring list sidebar filters & cost calculator modal)
    // ==========================================================================
    GuidesController.$inject = ['$scope', '$window', '$timeout'];
    function GuidesController($scope, $window, $timeout) {
        const guides = [
            { id: 1, name: "Kabir Singh", state: "Rajasthan", rating: 4.8, reviews: 42, languages: ["English", "Hindi"], specialties: ["History", "Culture"], price: 2500, avatarClass: "avatar-1" },
            { id: 2, name: "Aditi Sharma", state: "Delhi", rating: 4.9, reviews: 58, languages: ["English", "Hindi", "French"], specialties: ["History", "Cuisine"], price: 3000, avatarClass: "avatar-2" },
            { id: 3, name: "Rajesh Nair", state: "Kerala", rating: 4.7, reviews: 35, languages: ["English", "Hindi"], specialties: ["Adventure", "Nature"], price: 2000, avatarClass: "avatar-3" },
            { id: 4, name: "Deepa Shah", state: "Gujarat", rating: 4.6, reviews: 24, languages: ["English", "Hindi", "Gujarati"], specialties: ["Cuisine", "Culture"], price: 2200, avatarClass: "avatar-4" }
        ];

        $scope.specialtyOptions = ["History", "Cuisine", "Adventure", "Culture", "Nature"];
        $scope.languageOptions = ["English", "Hindi", "French", "Gujarati"];

        // Filters State model
        $scope.filters = {
            specialties: {},
            languages: {},
            maxPrice: 5000
        };

        $scope.filteredGuides = angular.copy(guides);
        $scope.activeGuide = null;
        $scope.modalOverlayStyle = { display: 'none' };
        $scope.showToast = false;
        
        $scope.booking = { startDate: null, endDate: null, showBreakdown: false, daysCount: 1, serviceFee: 0, totalFee: 0 };

        // Helper rating star loops
        $scope.getStarsArray = function(val) {
            return new Array(Math.floor(val));
        };
        $scope.getEmptyStarsArray = function(val) {
            return new Array(5 - Math.floor(val));
        };

        $scope.applyFilters = function() {
            // Check active specialties
            const activeSpecs = Object.keys($scope.filters.specialties).filter(k => $scope.filters.specialties[k]);
            // Check active languages
            const activeLangs = Object.keys($scope.filters.languages).filter(k => $scope.filters.languages[k]);

            $scope.filteredGuides = guides.filter(guide => {
                if (guide.price > $scope.filters.maxPrice) return false;
                
                if (activeSpecs.length > 0) {
                    const matchSpec = guide.specialties.some(s => activeSpecs.includes(s));
                    if (!matchSpec) return false;
                }
                
                if (activeLangs.length > 0) {
                    const matchLang = guide.languages.some(l => activeLangs.includes(l));
                    if (!matchLang) return false;
                }
                
                return true;
            });
        };

        $scope.resetFilters = function() {
            $scope.filters = { specialties: {}, languages: {}, maxPrice: 5000 };
            $scope.filteredGuides = angular.copy(guides);
        };

        // Modal triggers
        $scope.openBookingModal = function(guide) {
            $scope.activeGuide = guide;
            $scope.booking = { startDate: null, endDate: null, showBreakdown: false, daysCount: 1, serviceFee: 0, totalFee: 0 };
            $scope.modalOverlayStyle = { display: 'flex' };
        };

        $scope.closeModal = function() {
            $scope.modalOverlayStyle = { display: 'none' };
        };

        $scope.calculateCost = function() {
            const start = $scope.booking.startDate;
            const end = $scope.booking.endDate;
            
            if (start && end && $scope.activeGuide) {
                const startDateObj = new Date(start);
                const endDateObj = new Date(end);
                
                if (endDateObj >= startDateObj) {
                    const diff = endDateObj.getTime() - startDateObj.getTime();
                    $scope.booking.daysCount = Math.ceil(diff / (1000 * 3600 * 24)) + 1;
                    
                    const daily = $scope.activeGuide.price * $scope.booking.daysCount;
                    $scope.booking.serviceFee = Math.round(daily * 0.05); // 5%
                    $scope.booking.totalFee = daily + $scope.booking.serviceFee;
                    $scope.booking.showBreakdown = true;
                } else {
                    $scope.booking.showBreakdown = false;
                }
            }
        };

        $scope.submitBooking = function(event) {
            event.preventDefault();
            if ($scope.booking.startDate && $scope.booking.endDate && $scope.activeGuide) {
                const currentGuides = JSON.parse(localStorage.getItem('tripsavvy_booked_guides') || '[]');
                
                // Avoid duplication
                if (!currentGuides.some(g => g.name === $scope.activeGuide.name)) {
                    currentGuides.push({
                        name: $scope.activeGuide.name,
                        state: $scope.activeGuide.state,
                        price: $scope.activeGuide.price,
                        startDate: $scope.booking.startDate,
                        endDate: $scope.booking.endDate
                    });
                    localStorage.setItem('tripsavvy_booked_guides', JSON.stringify(currentGuides));
                }

                $scope.modalOverlayStyle = { display: 'none' };
                $scope.showToast = true;
                
                $timeout(function() {
                    $scope.showToast = false;
                }, 4000);
            }
        };
    }

    // ==========================================================================
    // 10. DashboardController (Trip planner, expense log, days lists timeline)
    // ==========================================================================
    DashboardController.$inject = ['$scope', '$window', '$timeout'];
    function DashboardController($scope, $window, $timeout) {
        $scope.profileName = "Ria Chawak";
        $scope.currentTrip = null;
        $scope.expenses = [];
        $scope.itinerary = {};
        $scope.daysList = [];
        $scope.selectedDay = 1;
        $scope.showActivityForm = false;
        
        $scope.bookedGuides = [];
        $scope.importedSchedule = [];

        function init() {
            const savedTrip = JSON.parse($window.localStorage.getItem('tripsavvy_trip'));
            const savedExpenses = JSON.parse($window.localStorage.getItem('tripsavvy_expenses'));
            const savedItinerary = JSON.parse($window.localStorage.getItem('tripsavvy_itinerary'));
            
            // Check if user came from destination explorer page
            const exploredState = $window.localStorage.getItem('tripsavvy_explorer_state');

            if (savedTrip) {
                $scope.currentTrip = {
                    title: savedTrip.title,
                    destination: savedTrip.destination,
                    startDate: new Date(savedTrip.startDate),
                    endDate: new Date(savedTrip.endDate),
                    budget: parseFloat(savedTrip.budget)
                };
                $scope.expenses = savedExpenses || [];
                $scope.itinerary = savedItinerary || {};
                
                // If explorer state was clicked, update destination
                if (exploredState) {
                    $scope.currentTrip.destination = exploredState;
                    $window.localStorage.removeItem('tripsavvy_explorer_state');
                }
                
                generateDaysList();
            } else {
                // Load dummy project trip
                loadDemoTrip();
                if (exploredState) {
                    $scope.currentTrip.destination = exploredState;
                    $window.localStorage.removeItem('tripsavvy_explorer_state');
                }
            }

            $scope.bookedGuides = JSON.parse($window.localStorage.getItem('tripsavvy_booked_guides') || '[]');
            $scope.importedSchedule = JSON.parse($window.localStorage.getItem('tripsavvy_schedule') || '[]');
        }

        function loadDemoTrip() {
            $scope.currentTrip = {
                title: "Royal Rajasthan Heritage Odyssey",
                destination: "Rajasthan",
                startDate: new Date(),
                endDate: new Date(new Date().getTime() + 6 * 24 * 60 * 60 * 1000), // 7 days
                budget: 50000
            };
            
            $scope.expenses = [
                { id: 1, title: "Heritage Haveli Stay (Jaipur)", amount: 15000, category: "Stay" },
                { id: 2, title: "Sleeper Flight to Jaipur", amount: 8500, category: "Transport" },
                { id: 3, title: "Traditional Thali Dinner", amount: 1800, category: "Food" }
            ];

            $scope.itinerary = {
                1: [
                    { id: 101, time: "09:30", description: "Arrive at Jaipur Airport, hire pre-paid taxi", cost: 800 },
                    { id: 102, time: "11:00", description: "Check in at Umaid Haveli, welcome tea", cost: 0 },
                    { id: 103, time: "19:30", description: "Grand dinner at Chokhi Dhani ethnic resort", cost: 1800 }
                ],
                2: [
                    { id: 201, time: "09:00", description: "Guided tour of Amber Fort & Sheesh Mahal", cost: 1200 },
                    { id: 202, time: "14:30", description: "Visit Hawa Mahal and click photos", cost: 200 }
                ]
            };

            generateDaysList();
            saveToStorage();
        }

        function generateDaysList() {
            const count = $scope.getDaysCount();
            $scope.daysList = [];
            for (let i = 1; i <= count; i++) {
                $scope.daysList.push(i);
            }
            if ($scope.selectedDay > count) {
                $scope.selectedDay = 1;
            }
        }

        function saveToStorage() {
            $window.localStorage.setItem('tripsavvy_trip', JSON.stringify($scope.currentTrip));
            $window.localStorage.setItem('tripsavvy_expenses', JSON.stringify($scope.expenses));
            $window.localStorage.setItem('tripsavvy_itinerary', JSON.stringify($scope.itinerary));
        }

        $scope.getDaysCount = function() {
            if (!$scope.currentTrip) return 0;
            const diff = Math.abs($scope.currentTrip.endDate - $scope.currentTrip.startDate);
            return Math.ceil(diff / (1000 * 3600 * 24)) + 1;
        };

        $scope.getTotalSpent = function() {
            return $scope.expenses.reduce((sum, item) => sum + item.amount, 0);
        };

        $scope.getBudgetPercentage = function() {
            if (!$scope.currentTrip || $scope.currentTrip.budget === 0) return 0;
            return Math.round(($scope.getTotalSpent() / $scope.currentTrip.budget) * 100);
        };

        $scope.selectDay = function(day) {
            $scope.selectedDay = day;
            $scope.showActivityForm = false;
        };

        // Modal trip configure
        let tripModal;
        $scope.openCreateTripModal = function() {
            if ($scope.currentTrip) {
                document.getElementById('tripTitle').value = $scope.currentTrip.title;
                document.getElementById('tripDest').value = $scope.currentTrip.destination;
                document.getElementById('tripStart').value = $scope.currentTrip.startDate.toISOString().substring(0, 10);
                document.getElementById('tripEnd').value = $scope.currentTrip.endDate.toISOString().substring(0, 10);
                document.getElementById('tripBudget').value = $scope.currentTrip.budget;
            } else {
                document.getElementById('tripTitle').value = '';
                document.getElementById('tripDest').value = '';
                document.getElementById('tripStart').value = '';
                document.getElementById('tripEnd').value = '';
                document.getElementById('tripBudget').value = '';
            }

            const modalEl = document.getElementById('tripModal');
            tripModal = new $window.bootstrap.Modal(modalEl);
            tripModal.show();
        };

        $scope.saveTrip = function(event) {
            event.preventDefault();
            const start = new Date(document.getElementById('tripStart').value);
            const end = new Date(document.getElementById('tripEnd').value);
            
            if (end < start) {
                alert("End date must be after Start date!");
                return;
            }

            $scope.currentTrip = {
                title: document.getElementById('tripTitle').value,
                destination: document.getElementById('tripDest').value,
                startDate: start,
                endDate: end,
                budget: parseFloat(document.getElementById('tripBudget').value)
            };

            $scope.expenses = [];
            $scope.itinerary = {};
            $scope.selectedDay = 1;

            generateDaysList();
            saveToStorage();

            if (tripModal) {
                tripModal.hide();
            }
            showToast("Trip initialized successfully.");
        };

        // Day activity scheduling
        $scope.openAddActivityForm = function() {
            $scope.showActivityForm = true;
            $timeout(function() {
                document.getElementById('actTime').value = '';
                document.getElementById('actDesc').value = '';
                document.getElementById('actCost').value = 0;
            }, 20);
        };

        $scope.closeActivityForm = function() {
            $scope.showActivityForm = false;
        };

        $scope.saveActivity = function(event) {
            event.preventDefault();
            const time = document.getElementById('actTime').value;
            const desc = document.getElementById('actDesc').value;
            const cost = parseFloat(document.getElementById('actCost').value || 0);

            if (time && desc) {
                if (!$scope.itinerary[$scope.selectedDay]) {
                    $scope.itinerary[$scope.selectedDay] = [];
                }

                const newAct = {
                    id: new Date().getTime(),
                    time: time,
                    description: desc,
                    cost: cost
                };

                $scope.itinerary[$scope.selectedDay].push(newAct);

                if (cost > 0) {
                    $scope.expenses.push({
                        id: newAct.id,
                        title: `${desc} (Day ${$scope.selectedDay})`,
                        amount: cost,
                        category: "Tickets"
                    });
                }

                saveToStorage();
                $scope.showActivityForm = false;
                showToast("Activity added.");
            }
        };

        $scope.deleteActivity = function(act) {
            const idx = $scope.itinerary[$scope.selectedDay].indexOf(act);
            if (idx !== -1) {
                $scope.itinerary[$scope.selectedDay].splice(idx, 1);
                
                if (act.cost > 0) {
                    const expIdx = $scope.expenses.findIndex(e => e.id === act.id);
                    if (expIdx !== -1) {
                        $scope.expenses.splice(expIdx, 1);
                    }
                }
                saveToStorage();
                showToast("Activity removed.");
            }
        };

        // Expense logger actions
        $scope.addExpense = function(event) {
            event.preventDefault();
            const title = document.getElementById('expTitle').value;
            const amount = parseFloat(document.getElementById('expAmount').value);
            const cat = document.getElementById('expCategory').value;

            if (title && amount > 0 && cat) {
                $scope.expenses.push({
                    id: new Date().getTime(),
                    title: title,
                    amount: amount,
                    category: cat
                });
                saveToStorage();
                
                document.getElementById('expTitle').value = '';
                document.getElementById('expAmount').value = '';
                document.getElementById('expCategory').value = '';
                showToast("Expense logged!");
            }
        };

        $scope.deleteExpense = function(exp) {
            const idx = $scope.expenses.indexOf(exp);
            if (idx !== -1) {
                $scope.expenses.splice(idx, 1);
                saveToStorage();
                showToast("Expense deleted.");
            }
        };

        // Import scheduled activity bookings
        $scope.importActivityToItinerary = function(item) {
            if (!$scope.itinerary[$scope.selectedDay]) {
                $scope.itinerary[$scope.selectedDay] = [];
            }

            let timeStr = "10:00";
            if (item.time === "afternoon") timeStr = "14:00";
            if (item.time === "evening") timeStr = "18:30";

            const newAct = {
                id: new Date().getTime(),
                time: timeStr,
                description: `Imported Activity: ${item.name} (${item.state})`,
                cost: 0
            };

            $scope.itinerary[$scope.selectedDay].push(newAct);

            const idx = $scope.importedSchedule.indexOf(item);
            if (idx !== -1) {
                $scope.importedSchedule.splice(idx, 1);
                $window.localStorage.setItem('tripsavvy_schedule', JSON.stringify($scope.importedSchedule));
            }

            saveToStorage();
            showToast("Activity imported to timeline.");
        };

        function showToast(msg) {
            document.getElementById('toastMessage').innerText = msg;
            const toastEl = document.getElementById('dashboardToast');
            const toast = new $window.bootstrap.Toast(toastEl, { delay: 2000 });
            toast.show();
        }

        init();
    }

    // ==========================================================================
    // 11. BlogController (Travel stories, filters, and modal readers)
    // ==========================================================================
    BlogController.$inject = ['$scope', '$window'];
    function BlogController($scope, $window) {
        $scope.blogs = [
            {
                id: 1,
                title: "The Unexplored Mountain Forts of Maharashtra",
                author: "Ria Chawak",
                date: "May 12, 2025",
                category: "heritage",
                imgClass: "blog-card-img-1",
                snippet: "Explore the hidden mountain passes, ocean-bound fortresses, and heritage lookouts in the heart of Maharashtra's Western Ghats.",
                content: [
                    "Maharashtra is home to over 350 forts, each with a legendary tale of bravery and brilliant military engineering. From the impregnable ocean fort of Murud-Janjira to the high hill fortress of Rajgad, these ruins stand as monumental gateways to the past.",
                    "Many of these forts are nestled in the scenic Sahyadri range (Western Ghats), offering spectacular hiking routes. Hikers can climb up stone steps carved directly into cliffs and peer out over misty gorges.",
                    "For heritage lovers, a weekend trek to Lohagad or Sinhagad offers the perfect blend of local food, panoramic landscapes, and historic storytelling."
                ]
            },
            {
                id: 2,
                title: "Spices & Houseboats: A Dream Week in Kerala",
                author: "Aaryaki Patil",
                date: "April 18, 2025",
                category: "nature",
                imgClass: "blog-card-img-2",
                snippet: "Cruise along palm-fringed canals, relax in tea gardens, and taste organic spices in the hills of Munnar.",
                content: [
                    "Kerala, often referred to as God's Own Country, is a paradise of slow travel. The backwaters of Alleppey offer a unique houseboat experience where you can drift past small villages, coconut groves, and paddy fields.",
                    "Further up in the hills, Munnar's rolling green tea estates provide a cooler climate, perfect for trekking and spice garden tours where you can see pepper, cardamom, and cinnamon grown organically.",
                    "End your journey with a traditional home-cooked meal featuring fresh coconut and local spices."
                ]
            },
            {
                id: 3,
                title: "Rann of Kutch: The White Desert Salt Safari",
                author: "Ketakee Joshi",
                date: "January 20, 2025",
                category: "culture",
                imgClass: "blog-card-img-3",
                snippet: "Witness the breathtaking white desert salt flats under the moonlight during the winter festival.",
                content: [
                    "The Great Rann of Kutch is one of the largest salt deserts in the world. During the winter months, the salt flats dry up to form a pristine white canvas that glows spectacularly under the full moon.",
                    "The annual Rann Utsav festival celebrates this natural wonder with local Kutchi music, dance, craft stalls, and camel safaris.",
                    "Visitors can stay in luxury tent cities, buy hand-embroidered textiles directly from village artisans, and experience the warm desert hospitality."
                ]
            }
        ];

        $scope.activeCategory = "all";
        $scope.blogSearch = "";
        $scope.activeBlog = null;

        $scope.setCategory = function(category) {
            $scope.activeCategory = category;
        };

        $scope.categoryFilter = function(blog) {
            if ($scope.activeCategory === 'all') return true;
            return blog.category === $scope.activeCategory;
        };

        $scope.readFullBlog = function(blog) {
            $scope.activeBlog = blog;
            const modalEl = document.getElementById('blogModal');
            const modal = new $window.bootstrap.Modal(modalEl);
            modal.show();
        };
    }

    // ==========================================================================
    // 12. ContactController (Inquiry form & toast feedbacks)
    // ==========================================================================
    ContactController.$inject = ['$scope', '$window'];
    function ContactController($scope, $window) {
        $scope.inquiry = { name: '', email: '', type: '', message: '' };

        $scope.submitInquiry = function(event) {
            event.preventDefault();
            
            // Show Success Toast
            const toastEl = document.getElementById('contactToast');
            const toast = new $window.bootstrap.Toast(toastEl, { delay: 3000 });
            toast.show();

            // Reset inputs
            $scope.inquiry = { name: '', email: '', type: '', message: '' };
        };
    }

    // ==========================================================================
    // 13. CalendarController (Dynamic Date-Based Planner view)
    // ==========================================================================
    CalendarController.$inject = ['$scope', '$window', '$timeout'];
    function CalendarController($scope, $window, $timeout) {
        const today = new Date();
        $scope.currentMonth = today.getMonth();
        $scope.currentYear = today.getFullYear();
        $scope.selectedDay = today.getDate();

        $scope.monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        
        $scope.weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        $scope.allEvents = {}; // Maps date string -> list of events
        $scope.activeEvents = []; // Events for selected date

        function init() {
            // Load events from LocalStorage
            const savedEvents = JSON.parse($window.localStorage.getItem('tripsavvy_calendar_events') || '{}');
            $scope.allEvents = savedEvents;
            $scope.selectedDateString = formatDateString($scope.currentYear, $scope.currentMonth, $scope.selectedDay);
            loadEventsForSelectedDate();
            generateCalendarGrid();
        }

        function formatDateString(y, m, d) {
            const mm = (m + 1 < 10) ? '0' + (m + 1) : (m + 1);
            const dd = (d < 10) ? '0' + d : d;
            return `${y}-${mm}-${dd}`;
        }

        function isToday(y, m, d) {
            const t = new Date();
            return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d;
        }

        function hasEvents(dateStr) {
            return $scope.allEvents[dateStr] && $scope.allEvents[dateStr].length > 0;
        }

        function generateCalendarGrid() {
            const year = $scope.currentYear;
            const month = $scope.currentMonth;
            
            const firstDayIndex = new Date(year, month, 1).getDay();
            const lastDay = new Date(year, month + 1, 0).getDate();

            const days = [];

            // Padding for previous month blank slots
            for (let i = 0; i < firstDayIndex; i++) {
                days.push({ day: null, dateString: null });
            }

            // Days of current month
            for (let d = 1; d <= lastDay; d++) {
                const dateStr = formatDateString(year, month, d);
                days.push({
                    day: d,
                    dateString: dateStr,
                    isToday: isToday(year, month, d),
                    hasEvents: hasEvents(dateStr)
                });
            }

            $scope.calendarDays = days;
        }

        function loadEventsForSelectedDate() {
            $scope.activeEvents = $scope.allEvents[$scope.selectedDateString] || [];
        }

        $scope.selectDay = function(dayObj) {
            if (!dayObj.day) return;
            $scope.selectedDay = dayObj.day;
            $scope.selectedDateString = dayObj.dateString;
            loadEventsForSelectedDate();
        };

        $scope.prevMonth = function() {
            $scope.currentMonth--;
            if ($scope.currentMonth < 0) {
                $scope.currentMonth = 11;
                $scope.currentYear--;
            }
            generateCalendarGrid();
        };

        $scope.nextMonth = function() {
            $scope.currentMonth++;
            if ($scope.currentMonth > 11) {
                $scope.currentMonth = 0;
                $scope.currentYear++;
            }
            generateCalendarGrid();
        };

        // Form Submit
        $scope.addActivity = function(event) {
            event.preventDefault();
            const timeVal = document.getElementById('actTime').value;
            const placeVal = document.getElementById('actPlace').value;
            const descVal = document.getElementById('actDesc').value;

            if (timeVal && placeVal && descVal) {
                const dateStr = $scope.selectedDateString;
                if (!$scope.allEvents[dateStr]) {
                    $scope.allEvents[dateStr] = [];
                }

                $scope.allEvents[dateStr].push({
                    id: new Date().getTime(),
                    time: timeVal,
                    place: placeVal,
                    description: descVal
                });

                $window.localStorage.setItem('tripsavvy_calendar_events', JSON.stringify($scope.allEvents));
                loadEventsForSelectedDate();
                generateCalendarGrid(); // Refresh to show hasEvents dot

                // Reset inputs
                document.getElementById('actTime').value = '';
                document.getElementById('actPlace').value = '';
                document.getElementById('actDesc').value = '';

                // Show Success Toast
                const toastEl = document.getElementById('calendarToast');
                const toast = new $window.bootstrap.Toast(toastEl, { delay: 2000 });
                toast.show();
            }
        };

        $scope.deleteActivity = function(act) {
            const dateStr = $scope.selectedDateString;
            const idx = $scope.allEvents[dateStr].indexOf(act);
            if (idx !== -1) {
                $scope.allEvents[dateStr].splice(idx, 1);
                if ($scope.allEvents[dateStr].length === 0) {
                    delete $scope.allEvents[dateStr];
                }
                $window.localStorage.setItem('tripsavvy_calendar_events', JSON.stringify($scope.allEvents));
                loadEventsForSelectedDate();
                generateCalendarGrid();
            }
        };

        init();
    }
})();
