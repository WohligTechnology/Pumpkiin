myApp.controller("ProfileCtrl", function (
  $scope,
  TemplateService,
  NavigationService,
  $timeout,
  toastr,
  $http,
  $uibModal,
  $state,
  $sce
) {
  $scope.template = TemplateService.getHTML("content/profile/profile.html");
  TemplateService.title = "Profile"; //This is the Title of the Website
  TemplateService.landingheader = "";
  TemplateService.cssMain = "main";
  $scope.navigation = NavigationService.getNavigation();
  $scope.jstrgValue = $.jStorage.get("userData");
  $scope.genderData = {};
  $scope.mobile = {};
  $scope.profileAddress = {};
  $scope.userRel = {};
  $scope.addressIndex = -1;
  // console.log("$scope.jstrgValue", $scope.jstrgValue);

  $scope.relation = [{
      name: "First Last Name",
      relation: "Brother"
    },
    {
      name: "First Last Name",
      relation: "Brother"
    }
  ];

  $scope.saveImage = function () {
    $scope.jstrgValue.photo = null;
    $.jStorage.set("userData", $scope.jstrgValue);
    NavigationService.apiCallWithData("User/save", $scope.jstrgValue, function (
      response
    ) {
      if (response.value == true) {
        toastr.success("Profile Image Saved successfully");
      } else {
        toastr.error("Error Updating Profile Image");
      }
    });
    $state.reload();
  };

  $scope.relationsForUser = [
    "Son",
    "Daughter",
    "Father",
    "Mother",
    "Sister",
    "Brother",
    "Grand Father",
    "Grand Mother",
    "Aunt",
    "Uncle",
    "Niece",
    "Nephew",
    "Friend"
  ];

  $scope.editressModalOpen = function (address, index) {
    $scope.addressIndex = index;
    $scope.profileAddress = address;
    $scope.addAddress = $uibModal.open({
      animation: true,
      templateUrl: "views/modal/addressEdit.html",
      scope: $scope
    });
  };

  $scope.addressModalOpen = function () {
    $scope.profileAddress = {};
    $scope.addressIndex = -1;
    $scope.addAddress = $uibModal.open({
      animation: true,
      templateUrl: "views/modal/addressEdit.html",
      scope: $scope
    });
  };
  // var vm = this;
  // vm.types = "['establishment']";
  // vm.placeChanged = function() {
  //   vm.place = this.getPlace();
  //   console.log(vm.place);
  //   console.log("location", vm.place.geometry.location);
  //   vm.map.setCenter(vm.place.geometry.location);
  // };

  $scope.newUserModalOpen = function () {
    $scope.addNewUser = $uibModal.open({
      animation: true,
      templateUrl: "views/modal/addNewUser.html",
      scope: $scope
    });
  };

  $scope.getUserData = function () {
    var data = {};
    data._id = $scope.jstrgValue._id;
    NavigationService.apiCallWithData("User/getOne", data, function (response) {
      if (response.value == true) {
        $scope.userDataForProfile = response.data;
        $scope.userDataForProfile.dob = new Date($scope.userDataForProfile.dob);
        if ($scope.userDataForProfile.mobile) {
          $scope.verifyMobile = true;
        }
        $scope.userDataForProfile.lastMobile = $scope.userDataForProfile.mobile;
      }
    });
  };

  $scope.getUserData();

  $scope.removeRelation = function (data) {
    _.remove($scope.userDataForProfile.relations, function (n) {
      return n._id == data;
    });
    var test = {};
    test.relatedUsers = $scope.userDataForProfile.relations;
    test.user = $scope.userDataForProfile._id;
    NavigationService.apiCallWithData(
      "User/save",
      $scope.userDataForProfile,
      function (response) {
        if (response.value == true) {
          toastr.error("Member removed successfully");
          $scope.getUserData();
        }
      }
    );

    NavigationService.apiCallWithData("Product/removeRelation", test, function (
      response
    ) {
      if (response.value == true) {}
    });
  };

  $scope.addUser = function (data) {
    data._id = $scope.jstrgValue._id;
    var familymember = {};
    familymember.name = $scope.userDataForProfile.name;
    familymember.user = data;
    NavigationService.apiCallWithData("User/addRelation", data, function (
      response
    ) {
      if (response.value == true) {
        NavigationService.apiCallWithData(
          "user/sendEmailToFamily",
          familymember,
          function (res) {
            console.log(res.value);
          }
        );
        toastr.success("Member added successfully");
        $scope.userData = null;
        $scope.addNewUser.close();
        $scope.getUserData();
      }
    });
  };

  $scope.changeInfo = function () {
    if (
      $scope.userDataForProfile.lastMobile !== $scope.userDataForProfile.mobile
    ) {
      NavigationService.apiCallWithData(
        "User/sendMobileOtp", {
          _id: $scope.jstrgValue._id,
          mobile: $scope.userDataForProfile.mobile
        },
        function (response) {
          if (response.value == true) {
            $scope.formName = {
              mobile: $scope.userDataForProfile.mobile
            };
            $scope.otp = $uibModal.open({
              animation: true,
              templateUrl: "views/modal/otpModal.html",
              scope: $scope,
              backdrop: "static"
            });
          }
        }
      );
    } else {
      // $scope.genderData._id = $scope.jstrgValue._id;
      delete $scope.userDataForProfile.createdAt;
      // NavigationService.apiCallWithData(
      //   "User/save",
      //   $scope.userDataForProfile,
      //   function (response) {
      //     if (response.value == true) {
      //       $state.reload();
      //     }
      //   }
      // );
      console.log("saveUpdatedData   >>", $scope.userDataForProfile);
      NavigationService.apiCallWithData(
        "User/saveUpdatedData",
        $scope.userDataForProfile,
        function (response) {
          if (response.value == true) {
            $state.reload();
          }
        }
      );
    }
  };

  //saveForOtpModal

  $scope.saveMobileData = function (info) {
    if (
      info.digit1 >= 0 &&
      info.digit2 >= 0 &&
      info.digit3 >= 0 &&
      info.digit4 >= 0
    ) {
      $scope.data = {};

      $scope.data.otp =
        info.digit1.toString() +
        info.digit2.toString() +
        info.digit3.toString() +
        info.digit4.toString();
      $scope.data.mobile = info.mobile;

      NavigationService.apiCallWithData(
        "User/verifyMobileOtp", {
          otp: info.digit1.toString() +
            info.digit2.toString() +
            info.digit3.toString() +
            info.digit4.toString(),
          mobile: info.mobile,
          _id: $scope.userDataForProfile._id
        },
        function (response) {
          if (response.value == true) {
            console.log("saveUpdatedData   >>", $scope.userDataForProfile);

            NavigationService.apiCallWithData(
              "User/saveUpdatedData",
              $scope.userDataForProfile,
              function (response) {
                if (response.value == true) {
                  $scope.otp.close();
                  $state.reload();
                }
              }
            );
          }
        }
      );
    } else {
      toastr.warning("Enter all fields");
    }
  };

  // NavigationService.apiCallWithoutData("Ticket/getAllStatesOfIndia", function(
  //   response
  // ) {
  //   console.log("response of State", response);
  //   $scope.states = response.data;
  // });

  $scope.trustAsHtml = function (value) {
    return $sce.trustAsHtml(value);
  };

  // $scope.updateState = function(data) {
  //   NavigationService.apiCallWithData("Ticket/getCity", data, function(
  //     response
  //   ) {
  //     $scope.cities = response.data;
  //     console.log("response of City", response);
  //   });
  // };
  $scope.placeChanged = function () {
    var place = this.getPlace();
    $scope.formattedAddress = place.formatted_address;
  };

  $scope.saveAddressData = function (data) {
    console.log("-------------", data);
    data.address = $scope.formattedAddress;
    var addData = {};
    var add = $scope.userDataForProfile.address;
    if ($scope.addressIndex != -1) {
      add[$scope.addressIndex] = data;
    } else {
      add.push(data);
    }
    addData._id = $scope.jstrgValue._id;
    addData.address = add;
    console.log("add data >>>>>>>", add);
    NavigationService.apiCallWithData("user/save", addData, function (response) {
      var mailThisAddress = {};
      mailThisAddress.user = $scope.userDataForProfile.name;
      mailThisAddress.email = $scope.userDataForProfile.email;

      if ($scope.addressIndex > -1) {
        mailThisAddress.address =
          $scope.userDataForProfile.address[$scope.addressIndex];
      } else {
        mailThisAddress.address =
          $scope.userDataForProfile.address[
            $scope.userDataForProfile.address.length - 1
          ];
      }


      if (response.value) {
        NavigationService.apiCallWithData(
          "user/addressEditEmail",
          mailThisAddress,
          function (res) {
            console.log("response", res);
          }
        );
      }
      $scope.addAddress.close();
      toastr.success("Address added successfully");
      $state.reload();
    });
  };

  $scope.removeAddress = function (index) {
    $scope.userDataForProfile.address.splice(index, 1);
    NavigationService.apiCallWithData(
      "User/save",
      $scope.userDataForProfile,
      function (response) {
        toastr.success("Address deleted successfully");
      }
    );
  };

  $scope.openUserEdit = function (data) {
    $scope.addNewUser = $uibModal.open({
      animation: true,
      templateUrl: "views/modal/editUser.html",
      scope: $scope
    });
    $scope.user = data;
  };

  $scope.openFamilyUser = function (data) {
    data.userId = $scope.userDataForProfile._id;
    NavigationService.apiCallWithData("User/saveEditedUSer", data, function (
      res
    ) {
      $scope.addNewUser.close();
    });
  };
});