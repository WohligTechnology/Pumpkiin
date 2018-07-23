myApp.controller('ProfileCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, $uibModal) {
    $scope.template = TemplateService.getHTML("content/profile/profile.html");
    TemplateService.title = "Profile"; //This is the Title of the Website
    TemplateService.landingheader = "";
    $scope.navigation = NavigationService.getNavigation();
    $scope.jstrgValue = $.jStorage.get('userData');

    console.log("$scope.jstrgValue", $scope.jstrgValue);

    $scope.relation = [{
        "name": "First Last Name",
        "relation": "Brother",
    }, {
        "name": "First Last Name",
        "relation": "Brother",
    }];

    $scope.addressModalOpen = function () {
        $scope.addReminder = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/addressEdit.html",
            scope: $scope,
        });
    }

    $scope.newUserModalOpen = function () {
        $scope.addNewUser = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/addNewUser.html",
            scope: $scope,
        });
    }

    var data = {};
    data._id = $scope.jstrgValue._id;
    NavigationService.apiCallWithData("User/getOne", data, function (response) {
        if (response.value == true) {
            $scope.userDataForProfile = response.data;
            console.log("$scope.userDataForProfile ", $scope.userDataForProfile);
        }
    });


});