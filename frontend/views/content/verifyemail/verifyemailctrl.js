myApp.controller('VerifyEmailCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, $uibModal, $state, $sce, $stateParams) {
    $scope.template = TemplateService.getHTML("content/verifyemail/verifyemail.html");
    TemplateService.title = "Verify Email"; //This is the Title of the Website
    TemplateService.landingheader = "";
    TemplateService.cssMain = "main";
    $scope.navigation = NavigationService.getNavigation();
    if ($stateParams.userId) {
        console.log("state----", $stateParams.userId);
        NavigationService.apiCallWithData("User/verifyEmail", {
            userId: $stateParams.userId
        }, function (result) {
            if (result.value == true) {
                $.jStorage.set("userData", result.data);
                $state.go("openticket");
            } else {
                toastr.warning('Login with valid URL');
            }

        })
    }


})