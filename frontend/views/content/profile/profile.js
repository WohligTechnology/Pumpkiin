myApp.controller('ProfileCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, $uibModal, $state) {
    $scope.template = TemplateService.getHTML("content/profile/profile.html");
    TemplateService.title = "Profile"; //This is the Title of the Website
    TemplateService.landingheader = "";
    $scope.navigation = NavigationService.getNavigation();
    $scope.jstrgValue = $.jStorage.get('userData');
    $scope.genderData = {};
    console.log("$scope.jstrgValue", $scope.jstrgValue);

    $scope.relation = [{
        "name": "First Last Name",
        "relation": "Brother",
    }, {
        "name": "First Last Name",
        "relation": "Brother",
    }];

    $scope.relationsForUser = ["Son", "Daughter", "Father", "Mother", "Grand Father", "Grand Mother", "Aunt", "Uncle", "Niece", "Nephew"]


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


    $scope.getUserData = function () {
        var data = {};
        data._id = $scope.jstrgValue._id;
        NavigationService.apiCallWithData("User/getOne", data, function (response) {
            if (response.value == true) {
                $scope.userDataForProfile = response.data;
                // console.log("$scope.userDataForProfile ", $scope.userDataForProfile);
            }
        });
    }

    $scope.getUserData();

    $scope.removeRelation = function (data) {
        _.remove($scope.userDataForProfile.relations, function (n) {
            return n._id == data;
        });
        // console.log("$scope.userDataForProfile.relations", $scope.userDataForProfile.relations);
        NavigationService.apiCallWithData("User/save", $scope.userDataForProfile, function (response) {
            if (response.value == true) {
                toastr.error("Member removed successfully");
                $scope.getUserData();
            }
        });
    }

    $scope.addUser = function (data) {
        data._id = $scope.jstrgValue._id;
        NavigationService.apiCallWithData("User/addRelation", data, function (response) {
            if (response.value == true) {
                toastr.success("Member added successfully");
                $scope.userData = null;
                $scope.addNewUser.close();
                $scope.getUserData();
            }
        });
    }

    $scope.changeInfo = function () {
        console.log("data", $scope.genderData);
        $scope.genderData._id = $scope.jstrgValue._id;
        NavigationService.apiCallWithData("User/save", $scope.genderData, function (response) {
            if (response.value == true) {
                $state.reload();
            }
        });
    }


    $scope.$watch("userDataForProfile.profilePic", function (newVal, oldVal) {
        // console.log("newVal----------", newVal);
        if ($scope.userDataForProfile) {
            $scope.userDataForProfile.profilePic = newVal;
            // console.log("$scope.userDataForProfile----------", $scope.userDataForProfile);
            NavigationService.apiCallWithData("User/save", $scope.userDataForProfile, function (response) {
                if (response.value == true) {}
            });
        }
    });

});