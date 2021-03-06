myApp
  .directive("img", function($compile, $parse) {
    return {
      restrict: "E",
      replace: false,
      link: function($scope, element, attrs) {
        var $element = $(element);
        if (!attrs.noloading) {
          $element.after("<img src='img/loading.gif' class='loading' />");
          var $loading = $element.next(".loading");
          $element.load(function() {
            $loading.remove();
            $(this).addClass("doneLoading");
          });
        } else {
          $($element).addClass("doneLoading");
        }
      }
    };
  })

  .directive("hideOnScroll", function($document) {
    return {
      restrict: "EA",
      replace: false,
      link: function(scope, element, attr) {
        var $element = $(element);
        var lastScrollTop = 0;
        $(window).scroll(function(event) {
          var st = $(this).scrollTop();
          if (st > lastScrollTop) {
            $(element).addClass("nav-up");
          } else {
            $(element).removeClass("nav-up");
          }
          lastScrollTop = st;
        });
      }
    };
  })

  .directive("fancyboxBox", function($document) {
    return {
      restrict: "EA",
      replace: false,
      link: function(scope, element, attr) {
        var $element = $(element);
        var target;
        if (attr.rel) {
          target = $("[rel='" + attr.rel + "']");
        } else {
          target = element;
        }

        target.fancybox({
          openEffect: "fade",
          closeEffect: "fade",
          closeBtn: true,
          nextEffect: "",
          prevEffect: "",
          padding: 0,
          helpers: {
            title: {
              type: "over"
            },
            thumbs: {
              width: 50,
              height: 50
            },
            helpers: {
              media: {}
            }
          }
        });
      }
    };
  })

  .directive("fancyboxThumb", function($document) {
    return {
      restrict: "EA",
      replace: false,
      link: function(scope, element, attr) {
        var $element = $(element);
        var target;
        if (attr.rel) {
          target = $("[rel='" + attr.rel + "']");
        } else {
          target = element;
        }

        target.fancybox({
          nextEffect: "none",
          prevEffect: "none",
          padding: 0,
          helpers: {
            title: {
              type: "over"
            },
            thumbs: {
              width: 50,
              height: 50
            }
          }
        });
      }
    };
  })

  .directive("autoHeight", function($compile, $parse) {
    return {
      restrict: "EA",
      replace: false,
      link: function($scope, element, attrs) {
        var $element = $(element);
        var windowHeight = $(window).height();
        $element.css("min-height", windowHeight);
      }
    };
  })

  .directive("replace", function() {
    return {
      require: "ngModel",
      scope: {
        regex: "@replace",
        with: "@with"
      },
      link: function(scope, element, attrs, model) {
        model.$parsers.push(function(val) {
          if (!val) {
            return;
          }
          var regex = new RegExp(scope.regex);
          var replaced = val.replace(regex, scope.with);
          if (replaced !== val) {
            model.$setViewValue(replaced);
            model.$render();
          }
          return replaced;
        });
      }
    };
  })

  .directive("uploadImage", function($http, $filter, $timeout, toastr) {
    return {
      templateUrl: "views/directive/uploadFile.html",
      scope: {
        model: "=ngModel",
        type: "@type",
        callback: "&ngCallback",
        imagesrc: "@imageSrc",
        imageclass: "@imageClass",
        noStatus: "@noStatus",
        hideStatus: "@hideStatus"
      },
      link: function($scope, element, attrs) {
        $scope.showImage = function() {};
        $scope.check = true;
        if (!$scope.type) {
          $scope.type = "image";
        }
        $scope.isMultiple = false;
        $scope.inObject = false;
        if (attrs.multiple || attrs.multiple === "") {
          $scope.isMultiple = true;
          $("#inputImage").attr("multiple", "ADD");
        }
        if (attrs.noView || attrs.noView === "") {
          $scope.noShow = true;
        }
        // if (attrs.required) {
        //     $scope.required = true;
        // } else {
        //     $scope.required = false;
        // }
        $scope.$watch("image", function(newVal, oldVal) {
          isArr = _.isArray(newVal);

          if (!isArr && newVal && newVal.file) {
            $scope.uploadNow(newVal);
          } else if (isArr && newVal.length > 0 && newVal[0].file) {
            $timeout(function() {
              _.each(newVal, function(newV, key) {
                console.log("newV", newV);
                console.log("------------------------------");
                console.log(newV.file.type);
                if (newV.file.size <= 5000000) {
                  if (
                    (newV && newV.file) ||
                    newV.file.type == "application/pdf" ||
                    newV.file.type == "image/jpeg " ||
                    newV.file.type == "image/png " ||
                    newV.file.type == "application/doc"
                  ) {
                    $scope.uploadNow(newV);
                  } else {
                    toastr.error("Please check the file");
                  }
                } else {
                  toastr.error("Please check the file Size");
                }
              });
            }, 100);
          }
        });

        if ($scope.model) {
          if (_.isArray($scope.model)) {
            $scope.image = [];
            _.each($scope.model, function(n) {
              $scope.image.push({
                url: n
              });
            });
          } else {
            if (_.endsWith($scope.model, ".pdf")) {
              $scope.type = "pdf";
            }
          }
        }
        if (attrs.inobj || attrs.inobj === "") {
          $scope.inObject = true;
        }

        $scope.clearOld = function() {
          $scope.model = [];
        };

        $scope.removeIndex = function(index) {
          $scope.model.splice(index, 1);
        };

        $scope.uploadNow = function(image) {
          $scope.uploadStatus = "uploading";
          var Template = this;
          image.hide = true;
          var formData = new FormData();
          formData.append("file", image.file, image.name);
          $http
            .post(uploadurl, formData, {
              headers: {
                "Content-Type": undefined
              },
              transformRequest: angular.identity
            })
            .then(function(data) {
              data = data.data;
              $scope.uploadStatus = "uploaded";
              if ($scope.isMultiple) {
                if (_.endsWith(data.data[0], ".pdf")) {
                  $scope.type = "pdf";
                } else {
                  $scope.type = "image";
                }
                if ($scope.inObject) {
                  $scope.model.push({
                    image: data.data[0]
                  });
                } else {
                  if (!$scope.model) {
                    $scope.clearOld();
                  }
                  $scope.model.push(data.data[0]);
                }
              } else {
                if (_.endsWith(data.data[0], ".pdf")) {
                  $scope.type = "pdf";
                } else {
                  $scope.type = "image";
                }
                $scope.model = data.data[0];
                // console.log($scope.model, 'model means blob');
              }
              $timeout(function() {
                $scope.callback();
              }, 100);
            });
        };
      }
    };
  })

  .directive("onlyDigits", function() {
    return {
      require: "ngModel",
      restrict: "A",
      link: function(scope, element, attr, ctrl) {
        var digits;

        function inputValue(val) {
          if (val) {
            var otherVal = val + "";
            if (attr.type == "text") {
              digits = otherVal.replace(/[^0-9\-\.\\]/g, "");
            } else {
              digits = otherVal.replace(/[^0-9\-\.\\]/g, "");
            }

            if (digits !== val) {
              ctrl.$setViewValue(digits);
              ctrl.$render();
            }
            return parseInt(digits, 10);
          }
          return undefined;
        }
        ctrl.$parsers.push(inputValue);
      }
    };
  })

  .directive("onlyLettersInput", function() {
    return {
      require: "ngModel",
      restrict: "A",
      link: function(scope, element, attr, ngModelCtrl) {
        function fromUser(text) {
          var transformedInput = text.replace(/[^a-zA-Z\s]/g, "");
          //console.log(transformedInput);
          if (transformedInput !== text) {
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render();
          }
          return transformedInput;
        }
        ngModelCtrl.$parsers.push(fromUser);
      }
    };
  })

  .directive("moveNextOnMaxlength", function() {
    return {
      restrict: "A",
      link: function($scope, element) {
        element.on("input", function(e) {
          if (element.val().length == element.attr("maxlength")) {
            var $nextElement = element.next();
            if ($nextElement.length) {
              $nextElement[0].focus();
            }
          }
        });
        $(":input").keyup(function(e) {
          if ($(this).val() == "" && e.which == 8) {
            $(this)
              .prev("input")
              .focus();
          }
        });
      }
    };
  })
  .directive("reminders", function($http, $filter) {
    return {
      templateUrl: "views/directive/reminders.html",
      link: function($scope, element, attrs) {}
    };
  })
  .directive("tickets", function($http, $filter) {
    return {
      templateUrl: "views/directive/tickets.html",
      link: function($scope, element, attrs) {}
    };
  });
