var imgurl = adminurl + "upload/";

var imgpath = imgurl + "readFile";
var uploadurl = imgurl;

myApp.factory("NavigationService", function($http) {
  var navigation = [
    {
      name: "Users",
      classis: "active",
      sref: "#!/page/viewUser//",
      access: false
    },
    {
      name: "Product Confirmed",
      classis: "active",
      sref: "#!/page/viewProductConfirmed//"
    },
    {
      name: "Product Pending",
      classis: "active",
      sref: "#!/page/viewProductPending//"
    },
    /* {
                   name: "Brands",
                   classis: "active",
                   sref: "#!/page/viewBrand//",
                   access: false

               }, */
    /* {
            name: "Retailer",
            classis: "active",
            sref: "#!/page/viewRetailer//",
            access: false

        }, */
    // {
    //     name: "Ticket",
    //     classis: "active",
    //     sref: "#!/page/viewTicket//",
    //     access: false

    // },
    // {
    //     name: "CustomerSupportDetails",
    //     classis: "active",
    //     sref: "#!/page/viewCustomerSupportDetails//",
    //     access: false

    // }, {
    //     name: "FollowUp",
    //     classis: "active",
    //     sref: "#!/page/viewFollowUp//",
    //     access: false

    // },
    // {
    //     name: "productlist",
    //     classis: "active",
    //     uiSref: "productlist",
    //     access: false
    // },
    /* {
            name: "PickUpService",
            classis: "active",
            sref: "#!/page/viewPickUpService//",
            access: false
        }, */
    {
      name: "Ticket",
      classis: "active",
      sref: "#!/ticketlist",
      access: false
    }
  ];

  return {
    getnav: function() {
      // console.log("navigationnavigation", navigation[0].name)

      var userData = $.jStorage.get("profile");
      if (userData && userData.accessLevel) {
        _.forEach(navigation, function(value) {
          // console.log("userData.accessLevel", userData.accessLevel)
          if (
            userData.accessLevel == "Brand" ||
            userData.accessLevel == "Retailer"
          ) {
            if (value.name == "Product") {
              value.access = true;
            }
          } else if (userData.accessLevel == "Admin") {
            value.access = true;
          }
        });
      }
      return navigation;
    },

    parseAccessToken: function(data, callback) {
      if (data) {
        $.jStorage.set("accessToken", data);
        callback();
      }
    },
    removeAccessToken: function(data, callback) {
      $.jStorage.flush();
    },
    profile: function(callback, errorCallback) {
      var data = {
        accessToken: $.jStorage.get("accessToken")
      };
      $http.post(adminurl + "user/profile", data).then(function(data) {
        data = data.data;

        if (data.value === true) {
          $.jStorage.set("profile", data.data);
          callback();
        } else {
          errorCallback(data.error);
        }
      });
    },
    makeactive: function(menuname) {
      for (var i = 0; i < navigation.length; i++) {
        if (navigation[i].name == menuname) {
          navigation[i].classis = "active";
        } else {
          navigation[i].classis = "";
        }
      }
      return menuname;
    },

    search: function(url, formData, i, callback) {
      $http.post(adminurl + url, formData).then(function(data) {
        data = data.data;
        callback(data, i);
      });
    },
    delete: function(url, formData, callback) {
      $http.post(adminurl + url, formData).then(function(data) {
        data = data.data;
        callback(data);
      });
    },
    countrySave: function(formData, callback) {
      $http.post(adminurl + "country/save", formData).then(function(data) {
        data = data.data;
        callback(data);
      });
    },

    apiCall: function(url, formData, callback) {
      // console.log("urlurlurlurl", url)
      $http.post(adminurl + url, formData).then(function(data) {
        data = data.data;
        callback(data);
      });
    },
    searchCall: function(url, formData, i, callback) {
      $http.post(adminurl + url, formData).then(function(data) {
        data = data.data;
        callback(data, i);
      });
    },

    getOneCountry: function(id, callback) {
      $http
        .post(adminurl + "country/getOne", {
          _id: id
        })
        .then(function(data) {
          data = data.data;
          callback(data);
        });
    },
    getLatLng: function(address, i, callback) {
      $http({
        url:
          "https://maps.googleapis.com/maps/api/geocode/json?address=" +
          address +
          "&key=AIzaSyC62zlixVsjaq4zDaL4cefNCubjCgxkte4",
        method: "GET",
        withCredentials: false
      }).then(function(data) {
        data = data.data;
        callback(data, i);
      });
    },
    uploadExcel: function(form, callback) {
      $http
        .post(adminurl + form.model + "/import", {
          file: form.file
        })
        .then(function(data) {
          data = data.data;
          callback(data);
        });
    },

    apiCallWithoutData: function(url, callback) {
      $http.post(adminurl + url).then(function(data) {
        data = data.data;
        callback(data);
      });
    }
  };
});
