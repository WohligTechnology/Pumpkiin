myApp.controller('LoginCtrl', function ($scope, TemplateService, NavigationService, $timeout, $window, toastr, $http, $state, $stateParams) {
  $scope.template = TemplateService.getHTML("content/login/login.html");
  TemplateService.title = "Login"; //This is the Title of the Website
  TemplateService.header = "";
  TemplateService.cssMain = "without-padding";
  TemplateService.footer = "";
  $scope.formName = {};
  $scope.showsignUp = false;
  $scope.showLogin = true;
  $scope.shownameEmail = true;
  $scope.mobile;

  NavigationService.apiCallWithoutData("User/getConfig", function (res) {
    $scope.url = res.realHost;
    $scope.googleUrl = $scope.url + "/api/user/loginGoogle?returnUrl=" + $scope.url + "/#!/login/";
    $scope.fbUrl = $scope.url + "/api/user/loginFacebook?returnUrl=" + $scope.url + "/#!/login/";
    console.log("$scope.googleUrl", $scope.googleUrl)
    console.log("$scope.fbUrl", $scope.fbUrl)

  });
  $scope.socialLogin = function (url) {
    console.log("url", url);
    window.location.replace(url);
  };

  if ($stateParams.id) {
    if ($stateParams.id === "AccessNotAvailable") {
      toastr.error("You do not have access for the Backend.");
    } else {
      NavigationService.parseAccessToken($stateParams.id, function () {
        NavigationService.profile(function () {
          $state.go("openticket");
        }, function () {
          $state.go("login");
        });
      });
    }
  } else {
    $.jStorage.flush();
  }
  $scope.checkUser = function (data) {
    // $scope.showsignUp = true;
    // $scope.showLogin = false;
    $scope.mobile = data.mobile;
    NavigationService.apiCallWithData("User/sendOtp", data, function (res1) {
      // console.log("res1", res1);
      if (res1.value == true) {
        if (res1.data.name && res1.data.email) {
          $scope.formName.name = res1.data.name;
          $scope.formName.email = res1.data.email;
          $scope.alreadyExists = true;
        }
        $scope.showsignUp = true;
        $scope.showLogin = false;
      } else {
        console.log("mobile already registered");
      }
    });
  }


  $scope.saveUser = function (info) {
    if (info.digit1 >= 0 && info.digit2 >= 0 && info.digit3 >= 0 && info.digit4 >= 0) {
      $scope.data = {};

      $scope.data.otp = info.digit1.toString() + info.digit2.toString() + info.digit3.toString() + info.digit4.toString();
      $scope.data.mobile = $scope.mobile;

      if (info.email || info.name) {
        $scope.data.name = info.name;
        $scope.data.email = info.email;
      }
      NavigationService.apiCallWithData("User/verifyUserWithOtp", $scope.data, function (data) {
        console.log("data", data);
        if (data.value == true) {
          // toastr.success('You have been successfully sign in', 'Sign in Success');
          if (data.data.verificationStatus) {
            $.jStorage.set("userData", data.data);
            $scope.template.profile = data.data;
            $state.go("openticket");
          } else {
            $state.go("verifyemail");
          }

        } else {
          toastr.warning('Enter valid otp');
        }
      });
      // } else {
      //   NavigationService.apiCallWithData("User/verifyUserWithOtp", $scope.data, function (data) {
      //     if (data.value == true) {
      //       if (data.data.verificationStatus) {
      //         $.jStorage.set("userData", data.data);
      //         $scope.template.profile = data.data;
      //         $state.go("openticket");
      //       } else {
      //         $state.go("verifyemail");
      //       }
      //     } else {
      //       toastr.warning('Enter valid otp');
      //     }
      //   });
      // }

    } else {
      toastr.warning('Enter all fields');
    }
  }


  $scope.resendOtp = function (info) {
    if (info) {
      var sendData = {};
      sendData.mobile = info;
      NavigationService.apiCallWithData("User/sendOtp", sendData, function (res1) {
        // console.log("res1", res1);
        if (res1.value == true) {
          toastr.success('Check The Otp');
        } else {
          toastr.warning('Please Check Mobile Number');
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