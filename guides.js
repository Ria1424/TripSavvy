angular.module("guidesApp", []).controller("GuidesController", function ($scope) {
    $scope.guides = [
      {
        name: "Ravi Mehta",
        location: "Jaipur, Rajasthan",
        fee: "₹500/day",
        message: ""
      },
      {
        name: "Anita Sharma",
        location: "Munnar, Kerala",
        fee: "₹700/day",
        message: ""
      },
      {
        name: "Tenzin Norbu",
        location: "Leh, Ladakh",
        fee: "₹1000/day",
        message: ""
      },
      {
        name: "Neha Kamat",
        location: "Mumbai, Maharashtra",
        fee: "₹1000/day",
        message: ""
      },
      {
        name: "Rajesh Sharma",
        location: "Amritsar, Punjab",
        fee: "₹400/day",
        message: ""
      },
      {
        name: "Rajashri Das",
        location: "Calcutta, West Bengal",
        fee: "₹600/day",
        message: ""
      },
    ];
  
    $scope.selectedGuide = null;
  
    $scope.contactGuide = function (guide) {
      $scope.selectedGuide = guide;
      const modal = new bootstrap.Modal(document.getElementById('messageModal'));
      modal.show();
    };
  
    $scope.sendMessage = function () {
      if ($scope.selectedGuide && $scope.selectedGuide.message) {
        alert("Message sent to " + $scope.selectedGuide.name + ": " + $scope.selectedGuide.message);
        $scope.selectedGuide.message = "";
        const modal = bootstrap.Modal.getInstance(document.getElementById('messageModal'));
        modal.hide();
      }
    };
  });
  