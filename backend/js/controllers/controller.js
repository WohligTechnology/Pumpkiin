var globalfunction = {};
myApp
  .controller("DashboardCtrl", function (
    $scope,
    TemplateService,
    NavigationService,
    $timeout,
    $state
  ) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("dashboard");
    $scope.menutitle = NavigationService.makeactive("Dashboard");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
  })

  .controller("AccessController", function (
    $scope,
    TemplateService,
    NavigationService,
    $timeout,
    $state
  ) {
    if ($.jStorage.get("accessToken")) {} else {
      $state.go("login");
    }
  })

  .controller("JagzCtrl", function (
    $scope,
    TemplateService,
    NavigationService,
    $timeout,
    $state,
    $interval
  ) {
    function toColor(num, red) {
      num >>>= 0;
      var b = num & 0xff,
        g = (num & 0xff00) >>> 8,
        r = (num & 0xff0000) >>> 16,
        a = ((num & 0xff000000) >>> 24) / 255;
      if (red == "red") {
        r = 255;
        b = 0;
        g = 0;
      }
      return "rgba(" + [r, g, b, a].join(",") + ")";
    }

    $scope.circles = _.times(360, function (n) {
      var radius = _.random(0, 10);
      return {
        width: radius,
        height: radius,
        background: toColor(_.random(-12525360, 12525360)),
        top: _.random(0, $(window).height()),
        left: _.random(0, $(window).width())
      };
    });

    function generateCircle() {
      _.each($scope.circles, function (n, index) {
        var radius = _.random(0, 10);
        n.width = radius;
        n.height = radius;
        n.background = toColor(_.random(-12525360, 12525360));
        if (count % 7 === 0 || count % 7 === 5 || count % 7 === 6) {
          if (count % 7 === 6) {
            n.background = toColor(_.random(-12525360, 12525360), "red");
            // n.width = 3;
            // n.height = 3;
          }
          var t = (index * Math.PI) / 180;
          var x = 4.0 * Math.pow(Math.sin(t), 3);
          var y =
            3.0 * Math.cos(t) -
            1.3 * Math.cos(2 * t) -
            0.6 * Math.cos(3 * t) -
            0.2 * Math.cos(4 * t);
          n.top = -50 * y + 300;
          n.left = 50 * x + $(window).width() / 2;
        } else {
          n.top = _.random(0, $(window).height());
          n.left = _.random(0, $(window).width());
        }
      });
    }

    var count = 0;

    $interval(function () {
      count++;
      console.log("Version 1.1");
      generateCircle();
    }, 5000);
  })

  .controller("MultipleSelectCtrl", function (
    $scope,
    $window,
    TemplateService,
    NavigationService,
    $timeout,
    $state,
    $stateParams,
    $filter,
    toastr
  ) {
    var i = 0;
    $scope.getValues = function (filter, insertFirst) {
      var dataSend = {
        keyword: $scope.search.modelData,
        filter: filter,
        page: 1
      };
      if (dataSend.keyword === null || dataSend.keyword === undefined) {
        dataSend.keyword = "";
      }
      NavigationService[$scope.api](dataSend, ++i, function (data) {
        if (data.value) {
          $scope.list = data.data.results;
          if ($scope.search.modelData) {
            $scope.showCreate = true;
            _.each($scope.list, function (n) {
              // if (n.name) {
              if (_.lowerCase(n.name) == _.lowerCase($scope.search.modelData)) {
                $scope.showCreate = false;
                return 0;
              }
              // }else{
              //     if (_.lowerCase(n.officeCode) == _.lowerCase($scope.search.modelData)) {
              //       $scope.showCreate = false;
              //       return 0;
              //   }
              // }
            });
          } else {
            $scope.showCreate = false;
          }
          if (insertFirst) {
            if ($scope.list[0] && $scope.list[0]._id) {
              // if ($scope.list[0].name) {
              $scope.sendData($scope.list[0]._id, $scope.list[0].name);
              // }else{
              //   $scope.sendData($scope.list[0]._id, $scope.list[0].officeCode);
              // }
            } else {
              console.log("Making this happen");
              // $scope.sendData(null, null);
            }
          }
        } else {
          console.log("Making this happen2");
          $scope.sendData(null, null);
        }
      });
    };

    $scope.search = {
      modelData: ""
    };

    $scope.listview = false;
    $scope.showCreate = false;
    $scope.typeselect = "";
    $scope.showList = function () {
      var areFiltersThere = true;
      var filter = {};
      if ($scope.filter) {
        filter = JSON.parse($scope.filter);
      }
      var filterName = {};
      if ($scope.filterName) {
        filterName = JSON.parse($scope.filterName);
      }

      function getName(word) {
        var name = filterName[word];
        if (_.isEmpty(name)) {
          name = word;
        }
        return name;
      }

      if (filter) {
        _.each(filter, function (n, key) {
          if (_.isEmpty(n)) {
            areFiltersThere = false;
            toastr.warning("Please enter " + getName(key));
          }
        });
      }
      if (areFiltersThere) {
        $scope.listview = true;
        $scope.searchNew(true);
      }
    };
    $scope.closeList = function () {
      $scope.listview = false;
    };
    $scope.closeListSlow = function () {
      $timeout(function () {
        $scope.closeList();
      }, 500);
    };
    $scope.searchNew = function (dontFlush) {
      if (!dontFlush) {
        $scope.model = "";
      }
      var filter = {};
      if ($scope.filter) {
        filter = JSON.parse($scope.filter);
      }
      $scope.getValues(filter);
    };
    $scope.createNew = function (create) {
      var newCreate = $filter("capitalize")(create);
      var data = {
        name: newCreate
      };
      if ($scope.filter) {
        data = _.assign(data, JSON.parse($scope.filter));
      }
      NavigationService[$scope.create](data, function (data) {
        if (data.value) {
          toastr.success(
            $scope.name + " Created Successfully",
            "Creation Success"
          );
          $scope.model = data.data._id;
          $scope.ngName = data.data.name;
        } else {
          toastr.error("Error while creating " + $scope.name, "Error");
        }
      });
      $scope.listview = false;
    };
    $scope.sendData = function (val, name) {
      $scope.search.modelData = name;
      $scope.ngName = name;
      $scope.model = val;
      $scope.listview = false;
    };
    $scope.$watch("model", function (newVal, oldVal) {
      if ($scope.model) {
        if (_.isObject($scope.model)) {
          $scope.sendData($scope.model._id, $scope.model.name);
        }
      }
    });
  })

  .controller("PageJsonCtrl", function (
    $scope,
    TemplateService,
    NavigationService,
    JsonService,
    $timeout,
    $state,
    $stateParams,
    $uibModal
  ) {
    $scope.json = JsonService;
    $scope.template = TemplateService.changecontent("none");
    $scope.menutitle = NavigationService.makeactive("Country List");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    JsonService.getJson($stateParams.id, function () {});

    globalfunction.confDel = function (callback) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: "views/modal/conf-delete.html",
        size: "sm",
        scope: $scope
      });
      $scope.close = function (value) {
        callback(value);
        modalInstance.close("cancel");
      };
    };

    globalfunction.openModal = function (callback) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: "views/modal/modal.html",
        size: "lg",
        scope: $scope
      });
      $scope.close = function (value) {
        callback(value);
        modalInstance.close("cancel");
      };
    };

    // globalfunction.confDel(function (value) {
    //     console.log(value);
    //     if (value) {
    //         NavigationService.apiCall(id, function (data) {
    //             if (data.value) {
    //                 $scope.showAllCountries();
    //                 toastr.success("Country deleted successfully.", "Country deleted");
    //             } else {
    //                 toastr.error("There was an error while deleting country", "Country deleting error");
    //             }
    //         });
    //     }
    // });
  })
  .controller("UserDetailCtrl", function (
    $scope,
    TemplateService,
    NavigationService,
    JsonService,
    $timeout,
    $state,
    $stateParams,
    $uibModal
  ) {
    $scope.json = JsonService;
    $scope.template = TemplateService.changecontent("userdetail");
    $scope.menutitle = NavigationService.makeactive("userdetail");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    // console.log("$stateParams---", JSON.stringify($stateParams.keyword));
    // var obj = JSON.parse($stateParams.keyword)._id;
    var jsonData = null;
    $scope.showEdit = false;
    $scope.showCreate = false;
    try {
      jsonData = JSON.parse($stateParams.keyword)._id;
    } catch (e) {
      jsonData = $stateParams.keyword;
    }
    $scope.data = {};
    if (jsonData) {
      $scope.showEdit = true;
      $scope.showCreate = false;
      $scope.data._id = jsonData;
      NavigationService.apiCall("User/getOneUser", $scope.data, function (data) {
        if (data.value === true) {
          console.log("datadatadatadatadata", data);
          $scope.formdata = data.data;
          // $scope.formdata.relations ? $scope.formdata.relations : $scope.formdata.relations = [];
          if (!_.isEmpty($scope.formdata.relations)) {
            console.log("inside if condition");
          } else {
            console.log("Inside else condition");
            $scope.formdata.relations = [];
          }
        }
      });
      $scope.saveUser = function (formdata) {
        console.log("00", formdata);
        NavigationService.apiCall("User/saveUser", formdata, function (data) {
          if (data.value === true) {
            $scope.formdata = data.data;
          }
        });

        $state.go("page", {
          id: "viewUser"
        });
      };
    } else {
      $scope.showEdit = false;
      $scope.showCreate = true;
      $scope.saveUser = function (formdata) {
        console.log("11", formdata);
        NavigationService.apiCall("User/save", formdata, function (data) {
          if (data.value === true) {
            $scope.formdata = data.data;
          }
        });

        $state.go("page", {
          id: "viewUser"
        });
      };
    }

    $scope.getallList = function () {
      console.log("Insied get all reatldusduik");
    };
    $scope.disable = function (data) {
      $scope.formdata.isDisable = data;
      $scope.datavalue = data;
    };

    // $scope.allList = function (data) {
    // console.log("d1111111111111111", data)
    // if (data == 'Retailer') {
    NavigationService.apiCall("Retailer/getAllRetailer", {}, function (data) {
      if (data.value === true) {
        $scope.retailer = data.data;
      }
    });

    // } else if (data == 'Brand') {
    NavigationService.apiCall("Brand/getAllBrand", {}, function (data) {
      if (data.value === true) {
        $scope.brand = data.data;
      }
    });
    //     }
    // }
    $scope.cancelEdit = function () {
      console.log("**********");
      $state.go("page", {
        id: "viewUser"
      });
    };
    $scope.editRel = function (index, data) {
      $scope.relationData = data;
      $scope.relIndex = index;
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: "views/modal/relation.html",
        size: "lg",
        scope: $scope
      });
      $scope.close = function (value) {
        callback(value);
        modalInstance.close("cancel");
      };
    };

    $scope.deleteRel = function (index, data) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: "views/modal/conf-delete.html",
        size: "sm",
        scope: $scope,
        backdrop: "static",
        keyboard: false
      });
      $scope.close = function (value) {
        if (value) {
          data.splice(index, 1);
        }
        modalInstance.close("cancel");
      };
    };
    $scope.saveRel = function () {
      if ($scope.relIndex) {
        $scope.formdata.relations[$scope.relIndex] = $scope.relationData;
      } else {
        $scope.formdata.relations.push($scope.relationData);
      }
    };
  })
  .controller("ViewProductPageCtrl", function (
    $scope,
    TemplateService,
    NavigationService,
    JsonService,
    $timeout,
    $state,
    $stateParams,
    $uibModal,
    toastr
  ) {
    $scope.json = JsonService;
    $scope.template = TemplateService.changecontent("viewproductpage");
    $scope.menutitle = NavigationService.makeactive("viewproductpage");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    $scope.checkStatus = $stateParams.status;

    $scope.changeInput = function () {
      if ($scope.formData.input != "") {
        $scope.formData.input = "";
      } else {
        $scope.formData.input = $scope.formData.input;
      }
    };
    $scope.viewUserDetail = function (id) {
      $state.go("createproductpage", {
        id: id
      });
    };

    $scope.deleteProduct = function (data) {
      NavigationService.apiCall(
        "Product/delete", {
          _id: data
        },
        function (result) {
          if (result.value) {
            toastr.success("Product was deleted successfully");
            $scope.viewTable();
          } else {
            toastr.error("There was a problem deleting a product");
          }
        }
      );
    };

    $scope.changeAll = function () {
      $scope.formData = {};
      $scope.formData.page = 1;
      $scope.formData.type = "";
      $scope.formData.keyword = "";
      $scope.viewTable();
    };
    $scope.formData = {};
    $scope.formData.page = 1;
    $scope.formData.type = "";
    $scope.formData.keyword = "";
    // $scope.selectedStatus = 'All';
    $scope.searchInTable = function (data) {
      $scope.formData.page = 1;
      if (data.length >= 2) {
        $scope.formData.keyword = data;
        $scope.viewTable();
      } else if (data.length == "") {
        $scope.formData.keyword = data;
        $scope.viewTable();
      }
    };
    $scope.viewTable = function () {
      var dataTofilter = {};
      dataTofilter.status = $stateParams.status;
      $scope.formData.filter = dataTofilter;
      $scope.url = "Product/searchProductWithInvoice";
      // $scope.formData.page = $scope.formData.page;

      console.log("-----", $stateParams.status);
      if ($stateParams.status == "Pending") {
        NavigationService.apiCall($scope.url, $scope.formData, function (data) {
          console.log("data.value", data);
          if (data.value) {
            $scope.items = data.data.results;
            console.log(" $scope.items", $scope.items);
          }

          $scope.totalItems = data.data.total;
          $scope.maxRow = 10;
        });
      } else {
        NavigationService.apiCall(
          "Product/searchConfirmedProducts",
          $scope.formData,
          function (data) {
            console.log("confirmed", data);
            $scope.items = data.data.results;
            $scope.totalItems = data.data.total;
            $scope.maxRow = 10;
          }
        );
      }
    };

    // $scope.changePage = function (page) {
    //     $scope.viewTable(page);
    // }

    $scope.viewTable();
  })
  .controller("EditProductPageCtrl", function (
    $scope,
    TemplateService,
    NavigationService,
    JsonService,
    $timeout,
    $state,
    $stateParams,
    $uibModal,
    toastr
  ) {
    $scope.json = JsonService;
    $scope.template = TemplateService.changecontent("userdetail");
    $scope.menutitle = NavigationService.makeactive("userdetail");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    // console.log("$stateParams---", JSON.stringify($stateParams.keyword));
    // var obj = JSON.parse($stateParams.keyword)._id;
    var jsonData = null;
    $scope.showEdit = false;
    $scope.showCreate = false;
    try {
      jsonData = JSON.parse($stateParams.keyword)._id;
    } catch (e) {
      jsonData = $stateParams.keyword;
    }
    $scope.data = {};
    if (jsonData) {
      $scope.showEdit = true;
      $scope.showCreate = false;
      $scope.data._id = jsonData;
      NavigationService.apiCall("User/getOneUser", $scope.data, function (data) {
        if (data.value === true) {
          console.log("datadatadatadatadata", data);
          $scope.formdata = data.data;
          // $scope.formdata.relations ? $scope.formdata.relations : $scope.formdata.relations = [];
          if (!_.isEmpty($scope.formdata.relations)) {
            console.log("inside if condition");
          } else {
            console.log("Inside else condition");
            $scope.formdata.relations = [];
          }
        }
      });
      $scope.saveUser = function (formdata) {
        console.log("00", formdata);
        NavigationService.apiCall("User/saveUser", formdata, function (data) {
          if (data.value === true) {
            $scope.formdata = data.data;
          }
        });

        $state.go("page", {
          id: "viewUser"
        });
      };
    } else {
      $scope.showEdit = false;
      $scope.showCreate = true;
      $scope.saveUser = function (formdata) {
        console.log("11", formdata);
        NavigationService.apiCall("User/save", formdata, function (data) {
          if (data.value === true) {
            $scope.formdata = data.data;
          }
        });

        $state.go("page", {
          id: "viewUser"
        });
      };
    }

    $scope.getallList = function () {
      console.log("Insied get all reatldusduik");
    };
    $scope.disable = function (data) {
      $scope.formdata.isDisable = data;
      $scope.datavalue = data;
    };

    // $scope.allList = function (data) {
    // console.log("d1111111111111111", data)
    // if (data == 'Retailer') {
    NavigationService.apiCall("Retailer/getAllRetailer", {}, function (data) {
      if (data.value === true) {
        $scope.retailer = data.data;
      }
    });

    // } else if (data == 'Brand') {
    NavigationService.apiCall("Brand/getAllBrand", {}, function (data) {
      if (data.value === true) {
        $scope.brand = data.data;
      }
    });
    //     }
    // }
    $scope.cancelEdit = function () {
      console.log("**********");
      $state.go("page", {
        id: "viewUser"
      });
    };
    $scope.editRel = function (index, data) {
      $scope.relationData = data;
      $scope.relIndex = index;
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: "views/modal/relation.html",
        size: "lg",
        scope: $scope
      });
      $scope.close = function (value) {
        callback(value);
        modalInstance.close("cancel");
      };
    };

    $scope.deleteRel = function (index, data) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: "views/modal/conf-delete.html",
        size: "sm",
        scope: $scope,
        backdrop: "static",
        keyboard: false
      });
      $scope.close = function (value) {
        if (value) {
          data.splice(index, 1);
        }
        modalInstance.close("cancel");
      };
    };
    $scope.saveRel = function () {
      if ($scope.relIndex) {
        $scope.formdata.relations[$scope.relIndex] = $scope.relationData;
      } else {
        $scope.formdata.relations.push($scope.relationData);
      }
    };
  })
  .controller("CreateProductPageCtrl", function (
    $scope,
    TemplateService,
    NavigationService,
    JsonService,
    $timeout,
    $state,
    $stateParams,
    $uibModal
  ) {
    $scope.json = JsonService;
    $scope.template = TemplateService.changecontent("createproductpage");
    $scope.menutitle = NavigationService.makeactive("createproductpage");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    $scope.checkStatus = $stateParams.status;
    console.log("----------", $stateParams);
    $scope.changeInput = function () {
      if ($scope.formData.input != "") {
        $scope.formData.input = "";
      } else {
        $scope.formData.input = $scope.formData.input;
      }
    };
    $scope.getInfo = {};
    $scope.getInfo._id = $stateParams.id;
    NavigationService.apiCall("Product/getOne", $scope.getInfo, function (data) {
      if (data.value === true) {
        $scope.formdata = data.data;
        $scope.formdata.purchaseDate = new Date(data.data.purchaseDate);
        $scope.formdata.warrantyExpDate = new Date(data.data.warrantyExpDate);
        $scope.formdata.insuranceExpDate = new Date(data.data.insuranceExpDate);
      }
    });
    $scope.changeAll = function () {
      $scope.formData = {};
      $scope.formData.page = 1;
      $scope.formData.type = "";
      $scope.formData.keyword = "";
      $scope.viewTable();
    };
    $scope.formData = {};
    $scope.formData.page = 1;
    $scope.formData.type = "";
    $scope.formData.keyword = "";
    // $scope.selectedStatus = 'All';
    $scope.searchInTable = function (data) {
      $scope.formData.page = 1;
      if (data.length >= 2) {
        $scope.formData.keyword = data;
        $scope.viewTable();
      } else if (data.length == "") {
        $scope.formData.keyword = data;
        $scope.viewTable();
      }
    };
    ($scope.viewTable = function () {
      $scope.url = "Product/search";
      $scope.formData.page = $scope.formData.page++;
      NavigationService.apiCall($scope.url, $scope.formData, function (data) {
        console.log("data.value", data);
        if (data.value) {
          $scope.items = data.data.results;
          console.log(" $scope.items", $scope.items);
        }

        $scope.totalItems = data.data.total;
        $scope.maxRow = data.data.options.count;
      });
    }),
    $scope.viewTable();

    $scope.saveProduct = function (data) {
      console.log("save first page", data);
      data.productImages = [];
      _.forEach(data.image, function (img) {
        data.productImages.push({
          image: img
        });
      });
      data.purchaseproof = [];
      _.forEach(data.purchaseImage, function (img) {
        data.purchaseproof.push({
          proofImage: img
        });
      });
      data.doneBy = "Admin";
      NavigationService.apiCall("Product/save", data, function (data) {
        if (data.value === true) {
          $scope.formdata = data.data;
        }
      });
      $state.go("viewproductpage", {
        status: "Confirmed"
      });
    };

    $scope.removeProductImage = function (index) {
      $scope.formdata.productImages = _.slice(
        $scope.formdata.productImages,
        0,
        index
      );
      NavigationService.apiCall("Product/save", $scope.formdata, function (
        data
      ) {
        if (data.value === true) {
          $state.reload();
        }
      });
    };

    NavigationService.apiCallWithoutData("User/searchUser", function (data) {
      console.log("user details", data.data);
      $scope.users = data.data;
    });
  })

  .controller("ViewCtrl", function (
    $scope,
    TemplateService,
    NavigationService,
    JsonService,
    $timeout,
    $state,
    $stateParams
  ) {
    $scope.json = JsonService;
    $scope.template = TemplateService;
    var i = 0;
    if ($stateParams.page && !isNaN(parseInt($stateParams.page))) {
      $scope.currentPage = $stateParams.page;
    } else {
      $scope.currentPage = 1;
    }

    $scope.search = {
      keyword: ""
    };
    if ($stateParams.keyword) {
      $scope.search.keyword = $stateParams.keyword;
    }
    $scope.changePage = function (page) {
      var goTo = "page";
      if ($scope.search.keyword) {
        goTo = "page";
      }
      $state.go(goTo, {
        id: $stateParams.id,
        page: page,
        keyword: $scope.search.keyword
      });
    };

    $scope.getAllItems = function (keywordChange) {
      $scope.totalItems = undefined;
      var filter = {};
      if (keywordChange) {
        $scope.currentPage = 1;
      }
      var userData = $.jStorage.get("profile");
      $scope.filter = {};
      if ($scope.json.json.filter) {
        $scope.filter = $scope.json.json.filter;
      }
      NavigationService.search(
        $scope.json.json.apiCall.url, {
          page: $scope.currentPage,
          keyword: $scope.search.keyword,
          filter: $scope.filter
        },
        ++i,
        function (data, ini) {
          if (ini == i) {
            $scope.items = data.data.results;
            $scope.totalItems = data.data.total;
            $scope.maxRow = data.data.options.count;
          }
        }
      );
    };
    JsonService.refreshView = $scope.getAllItems;
    $scope.getAllItems();
  })

  .controller("ClosedTicketcreationCtrl", function (
    $scope,
    TemplateService,
    NavigationService,
    $timeout,
    toastr,
    $uibModal,
    $stateParams
  ) {
    $scope.template = TemplateService.changecontent("closedTicketcreation");
    $scope.menutitle = NavigationService.makeactive("Closed Ticket");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();

    var formData = {};

    $scope.jstrgData = $.jStorage.get("profile");
    console.log("$stateParams----------", $scope.jstrgData);

    $scope.getTicket = function () {
      var sendData = {};
      sendData._id = $stateParams.id;
      NavigationService.apiCall("Ticket/getOne", sendData, function (res) {
        if (res.value == true) {
          $scope.ticketData = res.data;
          console.log("$scope.ticketData-----", $scope.ticketData);
        }
      });
    };
    $scope.getTicket();

    //for ticket block

    var userId = {};
    userId.user = $scope.jstrgData._id;
    NavigationService.apiCall("Ticket/totalClosedTickets", userId, function (
      data
    ) {
      $scope.totalClosedTickets = data;
      $scope.showLessClosedTickets = _.slice($scope.totalClosedTickets, 0, 5);
      console.log("/////////////", data);
      if ($stateParams.id) {
        var ticketData = {};
        ticketData.ticketId = $stateParams.id;
        ticketData.user = userId.user;
        console.log("------------", ticketData);
        NavigationService.apiCall(
          "Ticket/findClosedTicketOfUser",
          ticketData,
          function (res) {
            $scope.ticketDetails = res.data;
            console.log("$scope.ticketDetails-----------", res);
          }
        );
      } else {
        $scope.ticketDetails = $scope.totalClosedTickets[0];
      }
    });
  })

  .controller("DetailCtrl", function (
    $scope,
    $window,
    TemplateService,
    NavigationService,
    JsonService,
    $timeout,
    $state,
    $stateParams,
    toastr
  ) {
    $scope.json = JsonService;
    JsonService.setKeyword($stateParams.keyword);
    $scope.template = TemplateService;
    $scope.data = {};
    console.log("detail controller");
    console.log($scope.json);

    //  START FOR EDIT
    if ($scope.json.json.preApi) {
      var obj = {};
      obj[$scope.json.json.preApi.params] = $scope.json.keyword._id;
      NavigationService.apiCall($scope.json.json.preApi.url, obj, function (
        data
      ) {
        $scope.data = data.data;
        $scope.generateField = true;
      });
    } else {
      $scope.generateField = true;
    }
    //  END FOR EDIT

    $scope.onCancel = function (sendTo) {
      if (sendTo == null) {
        $window.history.back();
      } else {
        $scope.json.json.action[1].stateName.json.keyword = "";
        $scope.json.json.action[1].stateName.json.page = "";
        $state.go(
          $scope.json.json.action[1].stateName.page,
          $scope.json.json.action[1].stateName.json
        );
      }
    };

    $scope.saveData = function (formData) {
      NavigationService.apiCall(
        $scope.json.json.apiCall.url,
        formData,
        function (data) {
          var messText = "created";
          if (data.value === true) {
            if ($scope.json.json.action[0].stateName == null) {
              $window.history.back();
            } else {
              $scope.json.json.action[0].stateName.json.keyword = "";
              $scope.json.json.action[0].stateName.json.page = "";
              $state.go(
                $scope.json.json.action[0].stateName.page,
                $scope.json.json.action[0].stateName.json
              );
              if ($scope.json.keyword._id) {
                messText = "edited";
              }
              toastr.success(
                $scope.json.json.name +
                " " +
                formData.name +
                " " +
                messText +
                " successfully."
              );
            }
          } else {
            messText = "creating";
            if ($scope.json.keyword._id) {
              messText = "editing";
            }
            toastr.error("Failed " + messText + " " + $scope.json.json.name);
          }
        }
      );
    };
  })

  .controller("DetailFieldCtrl", function (
    $scope,
    TemplateService,
    NavigationService,
    JsonService,
    $timeout,
    $state,
    $stateParams,
    $uibModal,
    toastr
  ) {
    if (!$scope.type.type) {
      $scope.type.type = "text";
    }
    $scope.json = JsonService;
    $scope.tags = {};
    $scope.model = [];
    $scope.tagNgModel = {};
    // $scope.boxModel
    if ($scope.type.validation) {
      var isRequired = _.findIndex($scope.type.validation, function (n) {
        return n == "required";
      });
      if (isRequired >= 0) {
        $scope.type.required = true;
      }
    }
    $scope.form = {};
    if ($scope.value && $scope.value[$scope.type.tableRef]) {
      $scope.form.model = $scope.value[$scope.type.tableRef];
    }

    $scope.template = "views/field/" + $scope.type.type + ".html";

    // Multiple checkbox selection
    if ($scope.type.type == "multipleCheckbox") {
      if ($scope.type.url !== "") {
        NavigationService.searchCall(
          $scope.type.url, {
            keyword: ""
          },
          1,
          function (data1) {
            $scope.items[$scope.type.tableRef] = data1.data.results;
            if ($scope.json.keyword._id) {
              console.log(
                "Edit multiCheckbox formData: ",
                $scope.formData[$scope.type.tableRef]
              );
              for (
                var idx = 0; idx < $scope.items[$scope.type.tableRef].length; idx++
              ) {
                for (
                  var formIdx = 0; formIdx < $scope.formData[$scope.type.tableRef].length; formIdx++
                ) {
                  if (
                    $scope.items[$scope.type.tableRef][idx]._id ==
                    $scope.formData[$scope.type.tableRef][formIdx]._id
                  ) {
                    $scope.items[$scope.type.tableRef][idx].checked = true;
                  }
                }
              }
            }
          }
        );
      } else {
        $scope.items[$scope.type.tableRef] = $scope.type.dropDown;
      }
    }

    // Set multiple checkbox field
    $scope.setSelectedItem = function (item) {
      if (typeof $scope.formData[$scope.type.tableRef] === "undefined")
        $scope.formData[$scope.type.tableRef] = [];
      var index = _.findIndex($scope.formData[$scope.type.tableRef], function (
        doc
      ) {
        return doc._id == item._id;
      });
      if (index < 0) {
        $scope.formData[$scope.type.tableRef].push({
          _id: item._id
        });
      } else {
        $scope.formData[$scope.type.tableRef].splice(index, 1);
      }
    };

    function getJsonFromUrl(string) {
      var obj = _.split(string, "?");
      var returnval = {};
      if (obj.length >= 2) {
        obj = _.split(obj[1], "&");
        _.each(obj, function (n) {
          var newn = _.split(n, "=");
          returnval[newn[0]] = newn[1];
          return;
        });
        return returnval;
      }
    }
    // BOX
    if ($scope.type.type == "date") {
      $scope.formData[$scope.type.tableRef] = moment(
        $scope.formData[$scope.type.tableRef]
      ).toDate();
    }
    if ($scope.type.type == "password") {
      $scope.formData[$scope.type.tableRef] = "";
    }
    if ($scope.type.type == "youtube") {
      $scope.youtube = {};
      $scope.changeYoutubeUrl = function (string) {
        if (string) {
          $scope.formData[$scope.type.tableRef] = "";
          var result = getJsonFromUrl(string);
          if (result && result.v) {
            $scope.formData[$scope.type.tableRef] = result.v;
          } else {
            $scope.formData[$scope.type.tableRef] = string;
          }
        }
      };
    }

    //Box Changes By Avinash Start

    if ($scope.type.type == "box") {
      if (
        !_.isArray($scope.formData[$scope.type.tableRef]) &&
        $scope.formData[$scope.type.tableRef] === ""
      ) {
        $scope.formData[$scope.type.tableRef] = [];
        $scope.model = [];
      } else {
        if ($scope.formData[$scope.type.tableRef]) {
          $scope.model = $scope.formData[$scope.type.tableRef];
        }
      }
      $scope.search = {
        text: ""
      };
    }
    $scope.state = "";
    $scope.createBox = function (state) {
      $scope.state = state;
      $scope.model.push({});
      $scope.editBox("Create", $scope.model[$scope.model.length - 1]);
    };
    $scope.editBox = function (state, data) {
      $scope.state = state;
      $scope.data = data;
      if (!$scope.formData[$scope.type.tableRef]) {
        $scope.formData[$scope.type.tableRef] = [];
      }

      if (state == "Create" && $scope.json.json.pageType == "create") {
        $scope.formData[$scope.type.tableRef].push(data);
      }

      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: "views/modal/modal.html",
        size: "lg",
        scope: $scope
      });
      $scope.close = function (value) {
        callback(value);
        modalInstance.close("cancel");
      };
    };
    $scope.deleteBox = function (index, data) {
      console.log(data);
      data.splice(index, 1);
    };

    //Box Changes By Avinash End

    // if ($scope.type.type == "box") {

    //     if (!_.isArray($scope.formData[$scope.type.tableRef]) && $scope.formData[$scope.type.tableRef] === '') {
    //         $scope.formData[$scope.type.tableRef] = [];
    //         $scope.model = [];
    //     } else {
    //         if ($scope.formData[$scope.type.tableRef]) {
    //             $scope.model = $scope.formData[$scope.type.tableRef];
    //         }
    //     }
    //     $scope.search = {
    //         text: ""
    //     };
    // }
    // $scope.state = "";
    // $scope.createBox = function (state) {
    //     $scope.state = state;
    //     $scope.model.push({});
    //     $scope.editBox("Create", $scope.model[$scope.model.length - 1]);
    // };
    // $scope.editBox = function (state, data) {
    //     $scope.state = state;
    //     $scope.data = data;
    //     var modalInstance = $uibModal.open({
    //         animation: $scope.animationsEnabled,
    //         templateUrl: 'views/modal/modal.html',
    //         size: 'lg',
    //         scope: $scope
    //     });
    //     $scope.close = function (value) {
    //         callback(value);
    //         modalInstance.close("cancel");
    //     };
    // };
    // $scope.deleteBox = function (index, data) {
    //     console.log(data);
    //     data.splice(index, 1);
    // };

    //  TAGS STATIC AND FROM TABLE
    $scope.refreshTags = function (search) {
      if ($scope.type.url !== "") {
        NavigationService.searchCall(
          $scope.type.url, {
            keyword: search
          },
          1,
          function (data1) {
            $scope.tags[$scope.type.tableRef] = data1.data.results;
          }
        );
      } else {
        $scope.tags[$scope.type.tableRef] = $scope.type.dropDown;
      }
    };
    if ($scope.type.type == "tags") {
      $scope.refreshTags();
    }

    $scope.tagClicked = function (select, index) {
      if ($scope.type.fieldType === "array") {
        $scope.formData[$scope.type.tableRef] = [];
        _.each(select, function (n) {
          $scope.formData[$scope.type.tableRef].push(n._id);
        });
      } else {
        $scope.formData[$scope.type.tableRef] = select;
      }
    };
  })

  .controller("LoginCtrl", function (
    $scope,
    TemplateService,
    NavigationService,
    $timeout,
    $stateParams,
    $state,
    toastr
  ) {
    //Used to name the .html file
    $scope.menutitle = NavigationService.makeactive("Login");
    TemplateService.title = $scope.menutitle;
    $scope.template = TemplateService;
    $scope.currentHost = window.location.origin;
    if ($stateParams.id) {
      if ($stateParams.id === "AccessNotAvailable") {
        toastr.error("You do not have access for the Backend.");
      } else {
        NavigationService.parseAccessToken($stateParams.id, function () {
          NavigationService.profile(
            function () {
              $state.go("dashboard");
            },
            function () {
              $state.go("login");
            }
          );
        });
      }
    } else {
      NavigationService.removeAccessToken();
    }
  })

  .controller("CountryCtrl", function (
    $scope,
    TemplateService,
    NavigationService,
    $timeout,
    $state,
    $stateParams,
    toastr
  ) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("country-list");
    $scope.menutitle = NavigationService.makeactive("Country List");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    $scope.currentPage = $stateParams.page;
    var i = 0;
    $scope.search = {
      keyword: ""
    };
    if ($stateParams.keyword) {
      $scope.search.keyword = $stateParams.keyword;
    }
    $scope.showAllCountries = function (keywordChange) {
      $scope.totalItems = undefined;
      if (keywordChange) {
        $scope.currentPage = 1;
      }
      NavigationService.searchCountry({
          page: $scope.currentPage,
          keyword: $scope.search.keyword
        },
        ++i,
        function (data, ini) {
          if (ini == i) {
            $scope.countries = data.data.results;
            $scope.totalItems = data.data.total;
            $scope.maxRow = data.data.options.count;
          }
        }
      );
    };

    $scope.changePage = function (page) {
      var goTo = "country-list";
      if ($scope.search.keyword) {
        goTo = "country-list";
      }
      $state.go(goTo, {
        page: page,
        keyword: $scope.search.keyword
      });
    };
    $scope.showAllCountries();
    $scope.deleteCountry = function (id) {
      globalfunction.confDel(function (value) {
        console.log(value);
        if (value) {
          NavigationService.deleteCountry(id, function (data) {
            if (data.value) {
              $scope.showAllCountries();
              toastr.success(
                "Country deleted successfully.",
                "Country deleted"
              );
            } else {
              toastr.error(
                "There was an error while deleting country",
                "Country deleting error"
              );
            }
          });
        }
      });
    };
  })

  .controller("CreateCountryCtrl", function (
    $scope,
    TemplateService,
    NavigationService,
    $timeout,
    $state,
    toastr
  ) {
    //Used to name the .html file

    $scope.template = TemplateService.changecontent("country-detail");
    $scope.menutitle = NavigationService.makeactive("Country");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();

    $scope.header = {
      name: "Create Country"
    };
    $scope.formData = {};
    $scope.saveCountry = function (formData) {
      console.log($scope.formData);
      NavigationService.countrySave($scope.formData, function (data) {
        if (data.value === true) {
          $state.go("country-list");
          toastr.success(
            "Country " + formData.name + " created successfully.",
            "Country Created"
          );
        } else {
          toastr.error("Country creation failed.", "Country creation error");
        }
      });
    };
  })

  .controller("CreateAssignmentCtrl", function (
    $scope,
    TemplateService,
    NavigationService,
    $timeout,
    $state,
    toastr,
    $stateParams,
    $uibModal
  ) {
    //Used to name the .html file

    $scope.template = TemplateService.changecontent("assignment-detail");
    $scope.menutitle = NavigationService.makeactive("Assignment");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();

    $scope.header = {
      name: "Create Assignment"
    };
    $scope.formData = {};
    $scope.formData.status = true;
    $scope.formData.invoice = [];
    $scope.formData.products = [];
    $scope.formData.LRs = [];
    $scope.formData.vehicleNumber = [];
    $scope.formData.others = [];
    $scope.formData.shareWith = [];
    $scope.modalData = {};
    $scope.modalIndex = "";
    $scope.wholeObj = [];
    $scope.addModels = function (dataArray, data) {
      dataArray.push(data);
    };

    // NavigationService.searchNatureLoss(function(data) {
    //     $scope.natureLoss = data.data.results;
    // });

    $scope.refreshShareWith = function (data, office) {
      var formdata = {};
      formdata.search = data;
      formdata.filter = {
        postedAt: office
      };
      NavigationService.searchEmployee(formdata, 1, function (data) {
        $scope.shareWith = data.data.results;
      });
    };
    $scope.refreshNature = function (data, causeloss) {
      var formdata = {};
      formdata.search = data;
      formdata.filter = {
        _id: causeloss
      };
      NavigationService.getNatureLoss(formdata, 1, function (data) {
        $scope.natureLoss = data.data.results;
      });
    };

    $scope.addModal = function (
      filename,
      index,
      holdobj,
      data,
      current,
      wholeObj
    ) {
      if (index !== "") {
        $scope.modalData = data;
        $scope.modalIndex = index;
      } else {
        $scope.modalData = {};
        $scope.modalIndex = "";
      }
      $scope.wholeObj = wholeObj;
      $scope.current = current;
      $scope.holdObject = holdobj;
      var modalInstance = $uibModal.open({
        scope: $scope,
        templateUrl: "views/modal/" + filename + ".html",
        size: "lg"
      });
    };

    $scope.addElements = function (moddata) {
      if ($scope.modalIndex !== "") {
        $scope.wholeObj[$scope.modalIndex] = moddata;
      } else {
        $scope.newjson = moddata;
        var a = moddata;
        switch ($scope.holdObject) {
          case "invoice":
            {
              var newmod = a.invoiceNumber.split(",");
              _.each(newmod, function (n) {
                $scope.newjson.invoiceNumber = n;
                $scope.wholeObj.push($scope.newjson);
              });
            }
            break;
          case "products":
            {
              var newmod1 = a.item.split(",");
              _.each(newmod1, function (n) {
                $scope.newjson.item = n;
                $scope.wholeObj.push($scope.newjson);
              });
            }
            break;
          case "LRs":
            var newmod2 = a.lrNumber.split(",");
            _.each(newmod2, function (n) {
              $scope.newjson.lrNumber = n;
              $scope.wholeObj.push($scope.newjson);
            });
            break;
          case "Vehicle":
            var newmod3 = a.vehicleNumber.split(",");
            _.each(newmod3, function (n) {
              $scope.newjson.vehicleNumber = n;
              $scope.wholeObj.push($scope.newjson);
            });
            break;

          default:
            {
              $scope.wholeObj.push($scope.newjson);
            }
        }
      }
    };

    $scope.deleteElements = function (index, data) {
      data.splice(index, 1);
    };

    $scope.submit = function (formData) {
      console.log($scope.formData);
      NavigationService.assignmentSave($scope.formData, function (data) {
        if (data.value === true) {
          $state.go("assignment-list");
          toastr.success(
            "Assignment " + formData.name + " created successfully.",
            "Assignment Created"
          );
        } else {
          toastr.error(
            "Assignment creation failed.",
            "Assignment creation error"
          );
        }
      });
    };
  })

  .controller("EditAssignmentCtrl", function (
    $scope,
    TemplateService,
    NavigationService,
    $timeout,
    $state,
    toastr,
    $stateParams,
    $uibModal
  ) {
    //Used to name the .html file

    $scope.template = TemplateService.changecontent("assignment-detail");
    $scope.menutitle = NavigationService.makeactive("Assignment");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();

    $scope.header = {
      name: "Edit Assignment"
    };
    $scope.formData = {};
    $scope.formData.status = true;
    $scope.formData.invoice = [];
    $scope.formData.products = [];
    $scope.formData.LRs = [];
    $scope.formData.vehicleNumber = [];
    $scope.formData.others = [];
    $scope.formData.shareWith = [];
    $scope.modalData = {};
    $scope.modalIndex = "";
    $scope.wholeObj = [];
    $scope.addModels = function (dataArray, data) {
      dataArray.push(data);
    };

    NavigationService.getOneModel("Assignment", $stateParams.id, function (
      data
    ) {
      $scope.formData = data.data;
      $scope.formData.dateOfIntimation = new Date(data.data.dateOfIntimation);
      $scope.formData.dateOfAppointment = new Date(data.data.dateOfAppointment);
      $scope.formData.country = data.data.city.district.state.zone.country._id;
      $scope.formData.zone = data.data.city.district.state.zone._id;
      $scope.formData.state = data.data.city.district.state._id;
      $scope.formData.district = data.data.city.district._id;
      $scope.formData.city = data.data.city._id;
      $scope.formData.insuredOfficer = data.data.insuredOfficer._id;
      console.log($scope.formData.policyDoc);
      console.log($scope.formData);
    });

    $scope.refreshShareWith = function (data, office) {
      var formdata = {};
      formdata.search = data;
      formdata.filter = {
        postedAt: office
      };
      NavigationService.searchEmployee(formdata, 1, function (data) {
        $scope.shareWith = data.data.results;
      });
    };
    $scope.refreshNature = function (data, causeloss) {
      var formdata = {};
      formdata.search = data;
      formdata.filter = {
        _id: causeloss
      };
      NavigationService.getNatureLoss(formdata, 1, function (data) {
        $scope.natureLoss = data.data.results;
      });
    };

    $scope.addModal = function (
      filename,
      index,
      holdobj,
      data,
      current,
      wholeObj
    ) {
      if (index !== "") {
        $scope.modalData = data;
        $scope.modalIndex = index;
      } else {
        $scope.modalData = {};
        $scope.modalIndex = "";
      }
      $scope.wholeObj = wholeObj;
      $scope.current = current;
      $scope.holdObject = holdobj;
      var modalInstance = $uibModal.open({
        scope: $scope,
        templateUrl: "views/modal/" + filename + ".html",
        size: "lg"
      });
    };

    $scope.addElements = function (moddata) {
      
      if ($scope.modalIndex !== "") {
        $scope.wholeObj[$scope.modalIndex] = moddata;
      } else {
        $scope.newjson = moddata;
        var a = moddata;
        switch ($scope.holdObject) {
          case "invoice":
            {
              var newmod = a.invoiceNumber.split(",");
              _.each(newmod, function (n) {
                $scope.newjson.invoiceNumber = n;
                $scope.wholeObj.push($scope.newjson);
              });
            }
            break;
          case "products":
            {
              var newmod1 = a.item.split(",");
              _.each(newmod1, function (n) {
                $scope.newjson.item = n;
                $scope.wholeObj.push($scope.newjson);
              });
            }
            break;
          case "LRs":
            var newmod2 = a.lrNumber.split(",");
            _.each(newmod2, function (n) {
              $scope.newjson.lrNumber = n;
              $scope.wholeObj.push($scope.newjson);
            });
            break;
          case "Vehicle":
            var newmod3 = a.vehicleNumber.split(",");
            _.each(newmod3, function (n) {
              $scope.newjson.vehicleNumber = n;
              $scope.wholeObj.push($scope.newjson);
            });
            break;

          default:
            {
              $scope.wholeObj.push($scope.newjson);
            }
        }
      }
    };

    $scope.deleteElements = function (index, data) {
      data.splice(index, 1);
    };

    $scope.submit = function (formData) {
      console.log($scope.formData);
      NavigationService.assignmentSave($scope.formData, function (data) {
        if (data.value === true) {
          $state.go("assignment-list");
          toastr.success(
            "Assignment " + formData.name + " created successfully.",
            "Assignment Created"
          );
        } else {
          toastr.error(
            "Assignment creation failed.",
            "Assignment creation error"
          );
        }
      });
    };
  })

  .controller("EditCountryCtrl", function (
    $scope,
    TemplateService,
    NavigationService,
    $timeout,
    $stateParams,
    $state,
    toastr
  ) {
    //Used to name the .html file

    $scope.template = TemplateService.changecontent("country-detail");
    $scope.menutitle = NavigationService.makeactive("Country");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();

    $scope.header = {
      name: "Edit Country"
    };

    NavigationService.getOneCountry($stateParams.id, function (data) {
      $scope.formData = data.data;
      console.log("$scope.oneCountry", $scope.oneCountry);
    });

    $scope.saveCountry = function (formValid) {
      NavigationService.countryEditSave($scope.formData, function (data) {
        if (data.value === true) {
          $state.go("country-list");
          console.log("Check this one");
          toastr.success(
            "Country " + $scope.formData.name + " edited successfully.",
            "Country Edited"
          );
        } else {
          toastr.error("Country edition failed.", "Country editing error");
        }
      });
    };
  })

  .controller("SchemaCreatorCtrl", function (
    $scope,
    TemplateService,
    NavigationService,
    $timeout,
    $stateParams,
    $state,
    toastr
  ) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("schema-creator");
    $scope.menutitle = NavigationService.makeactive("Schema Creator");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    $scope.collectionTypes = [
      "Table View",
      "Table View Drag and Drop",
      "Grid View",
      "Grid View Drag and Drop"
    ];
    $scope.schema = [{
        schemaType: "Boolean",
        Input1: "",
        Input2: ""
      },
      {
        schemaType: "Color",
        Input1: "",
        Input2: ""
      },
      {
        schemaType: "Date",
        Input1: "",
        Input2: ""
      },
      {
        schemaType: "Email",
        Input1: "",
        Input2: ""
      },
      {
        schemaType: "File",
        Input1: "MB Limit",
        Input2: ""
      },
      {
        schemaType: "Image",
        Input1: "pixel x",
        Input2: "pixel y "
      },
      {
        schemaType: "Location",
        Input1: "",
        Input2: ""
      },
      {
        schemaType: "Mobile",
        Input1: "",
        Input2: ""
      },
      {
        schemaType: "Multiple Select",
        Input1: "Enum",
        Input2: ""
      },
      {
        schemaType: "Multiple Select From Table",
        Input1: "Collection",
        Input2: "Field"
      },
      {
        schemaType: "Number",
        Input1: "min ",
        Input2: "max"
      },
      {
        schemaType: "Single Select ",
        Input1: "Enum",
        Input2: ""
      },
      {
        schemaType: "Single Select From Table",
        Input1: "Collection",
        Input2: "Field"
      },
      {
        schemaType: "Telephone",
        Input1: "",
        Input2: ""
      },
      {
        schemaType: "Text",
        Input1: "min length",
        Input2: "max length"
      },
      {
        schemaType: "TextArea",
        Input1: "min length",
        Input2: "max length"
      },
      {
        schemaType: "URL",
        Input1: "",
        Input2: ""
      },
      {
        schemaType: "WYSIWYG",
        Input1: "",
        Input2: ""
      },
      {
        schemaType: "Youtube",
        Input1: "",
        Input2: ""
      }
    ];

    $scope.inputTypes = [{
        value: "",
        name: "Select type of input"
      },
      {
        value: "Text",
        name: "Text"
      },
      {
        value: "Date",
        name: "Date"
      },
      {
        value: "Textarea",
        name: "Textarea"
      }
    ];

    $scope.formData = {};
    $scope.formData.status = true;

    $scope.formData.forms = [{
      head: "",
      items: [{}, {}]
    }];

    $scope.addHead = function () {
      $scope.formData.forms.push({
        head: $scope.formData.forms.length + 1,
        items: [{}]
      });
    };
    $scope.removeHead = function (index) {
      if ($scope.formData.forms.length > 1) {
        $scope.formData.forms.splice(index, 1);
      } else {
        $scope.formData.forms = [{
          head: "",
          items: [{}, {}]
        }];
      }
    };

    $scope.addItem = function (obj) {
      var index = $scope.formData.forms.indexOf(obj);
      $scope.formData.forms[index].items.push({});
    };

    $scope.removeItem = function (obj, indexItem) {
      var indexHead = $scope.formData.forms.indexOf(obj);
      if ($scope.formData.forms[indexHead].items.length > 1) {
        $scope.formData.forms[indexHead].items.splice(indexItem, 1);
      } else {
        $scope.formData.forms[indexHead].items = [{}];
      }
    };
  })

  .controller("ExcelUploadCtrl", function (
    $scope,
    TemplateService,
    NavigationService,
    $timeout,
    $stateParams,
    $state,
    toastr
  ) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("excel-upload");
    $scope.menutitle = NavigationService.makeactive("Excel Upload");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    $scope.form = {
      file: null,
      model: $stateParams.model
    };

    $scope.excelUploaded = function () {
      console.log("Excel is uploaded with name " + $scope.form.file);
      NavigationService.uploadExcel($scope.form, function (data) {
        $scope.data = data.data;
      });
    };
  })

  .controller("ProductlistCtrl", function (
    $scope,
    TemplateService,
    NavigationService,
    $timeout,
    $stateParams,
    $state,
    toastr
  ) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("productlist");
    $scope.menutitle = NavigationService.makeactive("Product List");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
  })
  .controller("TicketlistCtrl", function (
    $scope,
    TemplateService,
    NavigationService,
    $timeout,
    $stateParams,
    $state,
    toastr
  ) {
    console.log("Ticket Controler");
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("ticketlist");
    $scope.menutitle = NavigationService.makeactive("Ticket List");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    $scope.pageNumber = 1;
    $scope.totalitems = 10;
    var page = {
      page: 1
    };
    $scope.search = {
      keyword: ""
    };

    $scope.getAllItems = function (searchData) {
      $scope.keyword = searchData;
      $scope.ticketsSearch();
    };

    $scope.ticketsSearch = function () {
      console.log("ticketsSearch---->>>>");
      NavigationService.apiCall(
        "Ticket/searchOnListPage", {
          page: $scope.currentPage,
          keyword: $scope.search.keyword
        },
        function (res) {
          if (res.value == true) {
            $scope.allTickets = res.data.results;
            console.log("$scope.allTickets-----", res);
            $scope.totalitems = res.data.total;
            $scope.maxRow = res.data.options.count;
          }
        }
      );
    };
    $scope.ticketsSearch();

    $scope.changePage = function (pageno) {
      // console.log("hey", pageno)
      $scope.currentPage = pageno;
      page.page = pageno;
      $scope.ticketsSearch();
    };
  })

  .controller("TicketcreationCtrl", function (
    $scope,
    TemplateService,
    NavigationService,
    $timeout,
    $stateParams,
    $state,
    toastr,
    $uibModal
  ) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("ticketcreation");
    $scope.menutitle = NavigationService.makeactive("Ticket Creation");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    $scope.chatData = {};
    $scope.pickupOpen = function () {
      $scope.pickUp = $uibModal.open({
        animation: true,
        templateUrl: "views/modal/pickup.html",
        scope: $scope,
        windowClass: "app-modal-window"
      });
    };

    var formData = {};

    $scope.jstrgData = $.jStorage.get("profile");
    console.log("$stateParams----------", $stateParams.id);

    $scope.getTicket = function () {
      var sendData = {};
      sendData._id = $stateParams.id;
      NavigationService.apiCall("Ticket/getOne", sendData, function (res) {
        if (res.value == true) {
          $scope.ticketData = res.data;
          // console.log("$scope.ticketData-----", $scope.ticketData);
        }
      });
    };
    $scope.getTicket();

    $scope.ticketChatSocket = function (data) {
      if (data) {
        $scope.ticketData = data.ticketChatData;
        // console.log("$scope.ticketData------------ ", $scope.ticketData);
        $scope.$apply();
      }
    };
    $scope.ticketChatSocket();
    io.socket.on("ticketChat" + $stateParams.id, $scope.ticketChatSocket);

    $scope.addComment = function (data) {
      if (_.isEmpty(data.comment) && _.isEmpty(data.image)) {
        toastr.warning("Please fill the message field");
      } else {
        formData.user = $scope.jstrgData._id;
        formData.comment = data.comment;
        formData.file = data.image;
        formData.date = Date.now();
        console.log("formData--->", formData);
        $scope.ticketData.customerChat.push(formData);
        NavigationService.apiCall(
          "Ticket/addToChat",
          $scope.ticketData,
          function (data) {
            if (data.value == true) {
              $scope.chatData.comment = null;
              $scope.chatData.image = null;
              $scope.sentValue = true;
              $scope.getTicket();
            }
          }
        );
      }
    };

    $scope.setPickUpTime = function (data) {
      console.log(" data", data);
      data.ticketId = $stateParams.id;
      var dataToSendToChat = {};
      dataToSendToChat.pickUpDetails = data;
      dataToSendToChat.user = $scope.jstrgData._id;
      dataToSendToChat.comment = null;
      dataToSendToChat.file = null;
      $scope.ticketData.customerChat.push(dataToSendToChat);
      // console.log(" $scope.ticketData", $scope.ticketData);
      NavigationService.apiCall("Ticket/addToChat", $scope.ticketData, function (
        data
      ) {
        $scope.getTicket();
      });
      NavigationService.apiCall("PickUpService/save", data, function (data) {
        if (data.value == true) {
          $scope.pickUp.close();
        }
      });
    };

    $scope.statusArr = [
      "Repair/ Maintenance",
      "Scheduling service with customer",
      "Coordinating with the service provider",
      "Service confirmed",
      "Service completed",
      "Appliance picked up",
      "Appliance returned",
      "Awaiting feedback",
      "Completed"
    ];

    $scope.updateStatus = function (data) {
      console.log("data", data);
      if (data == "Completed") {
        $scope.ticketData.subStatus = data;
        var arr = {};
        arr.status = data;
        arr.statusDate = new Date();
        $scope.ticketData.substat.push(arr);
        $scope.ticketData.status = "Closed";
        NavigationService.apiCall(
          "Ticket/changeTicketStatus",
          $scope.ticketData,
          function (data) {
            if (data.value == true) {
              toastr.success("Status changed Sucessfully");
            }
          }
        );
      } else {
        console.log("1", $scope.ticketData);
        console.log("2", $scope.jstrgData);
        var formData = {};
        $scope.ticketData.subStatus = data;
        var arr = {};
        arr.status = data;
        arr.statusDate = new Date();
        if (data == "Awaiting feedback") {
          $scope.ticketData.feedbackStatus = true;
          formData.user = $scope.jstrgData._id;
          formData.comment =
            "Thank you for providing us with the opportunity to serve you. We hope we were able to do so with satisfaction. Request if you could kindly provide us with your valuable feedback below. This will greatly help us improve our service. Thank you, Team Pumpkiin";

          $scope.ticketData.customerChat.push(formData);
        } else {
          $scope.ticketData.feedbackStatus = false;
        }
        $scope.ticketData.substat.push(arr);
        console.log("------------------", $scope.ticketData);
        NavigationService.apiCall(
          "Ticket/changeTicketStatus",
          $scope.ticketData,
          function (data) {
            if (data.value == true) {
              toastr.success("Status changed Sucessfully");
            }
          }
        );
      }
    };
  })

  .controller("headerctrl", function ($scope, TemplateService, $uibModal) {
    $scope.template = TemplateService;
    $scope.$on("$stateChangeSuccess", function (
      event,
      toState,
      toParams,
      fromState,
      fromParams
    ) {
      $(window).scrollTop(0);
    });
  })

  .controller("languageCtrl", function (
    $scope,
    TemplateService,
    $translate,
    $rootScope
  ) {
    $scope.changeLanguage = function () {
      console.log("Language CLicked");

      if (!$.jStorage.get("language")) {
        $translate.use("hi");
        $.jStorage.set("language", "hi");
      } else {
        if ($.jStorage.get("language") == "en") {
          $translate.use("hi");
          $.jStorage.set("language", "hi");
        } else {
          $translate.use("en");
          $.jStorage.set("language", "en");
        }
      }
      //  $rootScope.$apply();
    };
  });