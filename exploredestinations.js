angular.module('exploreDestinationsApp', [])
    .controller('DestinationController', function () {
        const vm = this;
        vm.destinations = [
            "Maharashtra",
            "Karnataka",
            "Delhi",
            "Tamil Nadu",
            "West Bengal",
            "Gujarat",
            "Rajasthan",
            "Uttar Pradesh",
            "Kerala",
            "Punjab"
        ];
        vm.suggestions = [];
        vm.query = '';
        vm.selectedDestination = null;
        vm.selectedDestinationDetails = '';

        vm.search = function () {
            const searchTerm = vm.query.toLowerCase();
            vm.suggestions = vm.destinations.filter(destination =>
                destination.toLowerCase().includes(searchTerm)
            );
        };

        vm.selectDestination = function (destination) {
            vm.query = destination;
            vm.suggestions = [];
        };

        vm.displayDetails = function () {
            const destination = vm.query;
            if (vm.destinations.includes(destination)) {
                vm.selectedDestination = destination; // ✅ Set this so the ng-if works
                switch (destination) {
                    case "Maharashtra":
                        vm.selectedDestinationDetails = "Maharashtra: Home to Mumbai, the financial capital of India, it's known for its vibrant culture and rich history.";
                        break;
                    case "Karnataka":
                        vm.selectedDestinationDetails = "Karnataka: Famous for its IT hub in Bangalore and beautiful landscapes in places like Coorg and Hampi.";
                        break;
                    case "Delhi":
                        vm.selectedDestinationDetails = "Delhi: The capital city known for its historical landmarks, shopping, and food.";
                        break;
                    case "Tamil Nadu":
                        vm.selectedDestinationDetails = "Tamil Nadu: Known for its classical dance, historic temples, and beautiful beaches.";
                        break;
                    case "West Bengal":
                        vm.selectedDestinationDetails = "West Bengal: Famous for its art, literature, and the cultural hub of Kolkata.";
                        break;
                    case "Gujarat":
                        vm.selectedDestinationDetails = "Gujarat: Known for its diverse culture, heritage sites and the Gir National Park.";
                        break;
                    case "Rajasthan":
                        vm.selectedDestinationDetails = "Rajasthan: Known for its royal palaces, forts, and vibrant festivals.";
                        break;
                    case "Uttar Pradesh":
                        vm.selectedDestinationDetails = "Uttar Pradesh: Home to the iconic Taj Mahal and rich Mughal history.";
                        break;
                    case "Kerala":
                        vm.selectedDestinationDetails = "Kerala: Known as ‘God’s Own Country’, famous for its backwaters, beaches, and Ayurveda.";
                        break;
                    case "Punjab":
                        vm.selectedDestinationDetails = "Punjab: Known for its rich culture, delicious cuisine, and the holy Golden Temple.";
                        break;
                    default:
                        vm.selectedDestinationDetails = 'No details found.';
                }
            } else {
                vm.selectedDestination = null; // clear
                vm.selectedDestinationDetails = 'No details found.';
            }
        };
    });
