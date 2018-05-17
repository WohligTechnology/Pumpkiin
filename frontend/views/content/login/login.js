myApp.controller('LoginCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
    $scope.template = TemplateService.getHTML("content/login/login.html");
    TemplateService.title = "Login"; //This is the Title of the Website
    TemplateService.header = "";
    TemplateService.footer = "";
    $scope.formName={};
    $scope.checkChange = function (value) {
        console.log("inside",value);
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
                    console.log("inside 1st condition",case1);
                    var element = $window.document.getElementById('part1');
                    console.log("inside element",element);
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