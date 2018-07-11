myApp.controller('LoginCtrl', function ($scope, TemplateService, NavigationService, $timeout, $window, toastr, $http, $state) {
    $scope.template = TemplateService.getHTML("content/login/login.html");
    TemplateService.title = "Login"; //This is the Title of the Website
    TemplateService.header = "";
    TemplateService.footer = "";
    $scope.formName = {};
    $scope.showsignUp = false;
    $scope.showLogin = true;
    $scope.shownameEmail = true;


    $scope.checkUser = function (data) {
        $scope.showsignUp = true;
        $scope.showLogin = false;
        $scope.mobile = data.mobile;
        // NavigationService.apiCallWithData("User/sendOtp", data, function (res1) {
        //     console.log("res1", res1);
        //     if (res1.value == true) {
        //         $scope.showsignUp = true;
        //         $scope.showLogin = false;
        //     } else {
        //         console.log("mobile already registered");
        //     }
        // });
    }


    $scope.saveUser = function (info) {
        if (info.digit1 >= 0 && info.digit2 >= 0 && info.digit3 >= 0 && info.digit4 >= 0) {
            $scope.data = {};

            $scope.data.otp = info.digit1.toString() + info.digit2.toString() + info.digit3.toString() + info.digit4.toString();
            $scope.data.mobile = $scope.mobile;

            if (info.email || info.name) {
                $scope.data.name = info.name;
                $scope.data.email = info.email;
                NavigationService.apiCallWithData("User/verifyUserWithOtp", $scope.data, function (data) {
                    console.log("data", data);
                    if (data.value == true) {
                        // toastr.success('You have been successfully sign in', 'Sign in Success');
                        $.jStorage.set("userData", data.data);
                        $scope.template.profile = data.data;
                        $state.go("openticket");
                    } else {
                        toastr.warning('Enter valid otp');
                    }
                });
            } else {
                NavigationService.apiCallWithData("User/verifyUserWithOtp", $scope.data, function (data) {
                    if (data.value == true) {
                        // toastr.success('You have been successfully logged in', 'Login Success');
                        $.jStorage.set("userData", data.data);
                        $scope.template.profile = data.data;
                        $state.go("openticket");
                    } else {
                        toastr.warning('Enter valid otp');
                    }
                });
            }

        } else {
            toastr.warning('Enter all fields');
        }
    }


    $scope.resendOtp = function (info) {
        if (info.mobile) {
            NavigationService.apiCallWithData("User/sendOtp", info, function (res1) {
                console.log("res1", res1);
                if (res1.value == true) {
                    console.log("sms resend");
                } else {
                    console.log("mobile already registered");
                }
            });
        }
    }

    $scope.sendOtp = function (data) {
        NavigationService.apiCallWithData("User/sendOtp", data, function (res1) {
            if (res1.value == true) {
                toastr.success('Otp sent succefully')
                $scope.formName.digit1 = "";
                $scope.formName.digit2 = "";
                $scope.formName.digit3 = "";
                $scope.formName.digit4 = "";
            } else {
                toastr.warning('Enter valid Mobile Number');
            }

        });
    }

    $scope.checkChange = function (value) {
        switch (value) {
            case 4:
                if ($scope.formName.digit4 == "") {
                    var element = $window.document.getElementById('part3');
                    if (element)
                        element.focus();
                }
                break;

            case 3:
                if ($scope.formName.digit3 == "") {
                    var element = $window.document.getElementById('part2');
                    if (element)
                        element.focus();
                }
                break;

            case 2:
                if ($scope.formName.digit2 == "") {
                    var element = $window.document.getElementById('part1');
                    if (element)
                        element.focus();
                }
                break;

            case 1:
                if ($scope.formName.digit1 == "") {
                    var element = $window.document.getElementById('part1');
                    if (element)
                        element.focus();
                }
                break;
            default:
                console.log("invalid choice");
        }
    }

    $scope.navigation = NavigationService.getNavigation();

});