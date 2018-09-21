myApp.controller('ProfileCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, $uibModal, $state, $sce) {
    $scope.template = TemplateService.getHTML("content/profile/profile.html");
    TemplateService.title = "Profile"; //This is the Title of the Website
    TemplateService.landingheader = "";
    TemplateService.cssMain = "main";
    $scope.navigation = NavigationService.getNavigation();
    $scope.jstrgValue = $.jStorage.get('userData');
    $scope.genderData = {};
    $scope.mobile = {};
    // console.log("$scope.jstrgValue", $scope.jstrgValue);

    $scope.relation = [{
        "name": "First Last Name",
        "relation": "Brother",
    }, {
        "name": "First Last Name",
        "relation": "Brother",
    }];

    $scope.relationsForUser = ["Son", "Daughter", "Father", "Mother", "Grand Father", "Grand Mother", "Aunt", "Uncle", "Niece", "Nephew"]


    $scope.addressModalOpen = function () {
        $scope.addAddress = $uibModal.open({
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
        var test = {};
        test.relatedUsers = $scope.userDataForProfile.relations;
        test.user = $scope.userDataForProfile._id;
        // console.log("test", test);
        // console.log("$scope.userDataForProfile.relations", $scope.userDataForProfile.relations);
        NavigationService.apiCallWithData("User/save", $scope.userDataForProfile, function (response) {
            if (response.value == true) {
                toastr.error("Member removed successfully");
                $scope.getUserData();
            }
        });

        NavigationService.apiCallWithData("Product/removeRelation", test, function (response) {
            if (response.value == true) {}
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
        // console.log("data", $scope.genderData);
        $scope.mobile = $scope.genderData.mobile;
        if ($scope.genderData.mobile) {
            var dataToSend = {};
            dataToSend._id = $scope.jstrgValue._id;
            dataToSend.mobile = $scope.genderData.mobile;
            NavigationService.apiCallWithData("User/sendMobileOtp", dataToSend, function (response) {
                if (response.value == true) {
                    $scope.otp = $uibModal.open({
                        animation: true,
                        templateUrl: "views/modal/otpModal.html",
                        scope: $scope,
                        backdrop: 'static'
                    });
                }
            });
        } else {
            $scope.genderData._id = $scope.jstrgValue._id;
            NavigationService.apiCallWithData("User/save", $scope.genderData, function (response) {
                if (response.value == true) {
                    $state.reload();
                }
            });
        }
    }

    //saveForOtpModal

    $scope.saveMobileData = function (info) {
        if (info.digit1 >= 0 && info.digit2 >= 0 && info.digit3 >= 0 && info.digit4 >= 0) {
            $scope.data = {};

            $scope.data.otp = info.digit1.toString() + info.digit2.toString() + info.digit3.toString() + info.digit4.toString();
            $scope.data.mobile = $scope.mobile;

            NavigationService.apiCallWithData("User/verifyMobileOtp", $scope.data, function (response) {
                if (response.value == true) {
                    $scope.genderData._id = $scope.jstrgValue._id;
                    NavigationService.apiCallWithData("User/save", $scope.genderData, function (response) {
                        if (response.value == true) {
                            $scope.otp.close();
                            $state.reload();
                        }
                    });
                }
            });

        } else {
            toastr.warning('Enter all fields');
        }

    };


    $scope.$watch("userDataForProfile.profilePic", function (newVal, oldVal) {
        // console.log("newVal----------", newVal);
        if ($scope.userDataForProfile) {
            $scope.userDataForProfile.profilePic = newVal;
            // console.log("$scope.userDataForProfile----------", $scope.userDataForProfile);
            NavigationService.apiCallWithData("User/save", $scope.userDataForProfile, function (response) {
                if (response.value == true) {
                    var data = {};
                    data._id = $scope.jstrgValue._id;
                    NavigationService.apiCallWithData("User/getOne", data, function (response) {
                        if (response.value == true) {
                            $.jStorage.set("userData", response.data);
                            // console.log("$scope.userDataForProfile ", $scope.userDataForProfile);
                        }
                    });
                }
            });
        }
    });

    NavigationService.apiCallWithoutData("Ticket/getAllStatesOfIndia", function (response) {
        console.log("response of State", response)
        $scope.states = (response.data);
    });

    $scope.trustAsHtml = function (value) {
        return $sce.trustAsHtml(value);
    };

    $scope.updateState = function (data) {
        NavigationService.apiCallWithData("Ticket/getCity", data, function (response) {
            $scope.cities = response.data;
            console.log("response of City", response)
        });
    };

    $scope.saveAddressData = function (data) {
        console.log("data", data)
        var addData = {};
        var addressData = {};
        var add = [];
        addressData.title = data.title;
        addressData.addressLine = data.address;
        addressData.city = data.city.city;
        addressData.state = data.state.region;
        addressData.pincode = data.pin;
        add.push(addressData);
        addData._id = $scope.jstrgValue._id;
        addData.address = add;
        NavigationService.apiCallWithData("user/save", addData, function (response) {
            $scope.addAddress.close();
            toastr.success("Address added successfully");
            $state.reload();
        });
    };

    $scope.removeAddress = function (index) {
        $scope.userDataForProfile.address = _.slice($scope.userDataForProfile.address, 0, index);
        NavigationService.apiCallWithData("User/save", $scope.userDataForProfile, function (response) {
            toastr.error("Address deleted successfully");
        });
    };

});