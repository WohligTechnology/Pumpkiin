var schema = new Schema({
  name: {
    type: String
  },
  nickName: String,
  balance: {
    type: String
  },
  socialAccount: [{
    account: String
  }],
  relations: [{
    relationType: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  }],
  email: {
    type: String
  },
  brand: {
    type: Schema.Types.ObjectId,
    ref: "Brand"
  },
  retailer: {
    type: Schema.Types.ObjectId,
    ref: "Retailer"
  },
  location: [{
    location: String
  }],
  loginSession: [{
    timestamp: Date,
    ip: String,
    accessToken: String
  }],
  dob: {
    type: Date,
    excel: {
      name: "Birthday",
      modify: function (val, data) {
        return moment(val).format("MMM DD YYYY");
      }
    }
  },
  gender: {
    type: String,
    enum: ["Female", "Male"]
  },
  profilePic: String,
  photo: {
    type: String,
    default: "",
    excel: [{
        name: "Photo Val"
      },
      {
        name: "Photo String",
        modify: function (val, data) {
          return "http://abc/" + val;
        }
      },
      {
        name: "Photo Kebab",
        modify: function (val, data) {
          return data.name + " " + moment(data.dob).format("MMM DD YYYY");
        }
      }
    ]
  },
  password: {
    type: String,
    default: ""
  },
  forgotPassword: {
    type: String,
    default: ""
  },
  mobile: {
    type: Number
  },
  otp: {
    type: String,
    default: ""
  },
  otpTime: Date,
  accessToken: {
    type: [String],
    index: true
  },
  googleAccessToken: String,
  googleRefreshToken: String,
  oauthLogin: {
    type: [{
      socialId: String,
      socialProvider: String
    }],
    index: true
  },
  accessLevel: {
    type: String,
    enum: ["Admin", "User"],
    default: "User"
  },
  address: [{
    title: String,
    address: String,
    addressLine: String,
    city: Schema.Types.Mixed,
    district: String,
    state: Schema.Types.Mixed,
    pincode: Number
  }],
  verificationStatus: {
    type: Boolean,
    default: false
  }
});

schema.plugin(deepPopulate, {
  populate: {
    user: {
      select: "name _id"
    },
    retailer: {
      select: ""
    },
    brand: {
      select: ""
    },
    "relations.user": {
      select: ""
    }
  }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);

module.exports = mongoose.model("User", schema);

var exports = _.cloneDeep(
  require("sails-wohlig-service")(
    schema,
    "user retailer brand relations.user",
    "user retailer brand relations.user"
  )
);
var model = {
  getOneUser: function (data, callback) {
    User.findOne({
        _id: data._id
      })
      .deepPopulate("retailer brand")
      .exec(function (err, found) {
        if (err) {
          callback(err, null);
        } else if (_.isEmpty(found)) {
          callback("noDataound", null);
        } else {
          callback(null, found);
        }
      });
  },

  saveUser: function (data, callback) {
    User.findOne({
      _id: data._id
    }).exec(function (err, found) {
      if (err) {
        callback(err, null);
      } else if (_.isEmpty(found)) {
        callback("noDataound", null);
      } else {
        if (data.accessLevel == "Brand") {
          if (found.retailer) {
            data.retailer = null;
            User.saveData(data, function (err, data2) {
              if (err) {
                callback(err, data2);
              } else {
                callback(err, data2);
              }
            });
          } else {
            User.saveData(data, function (err, data2) {
              if (err) {
                callback(err, data2);
              } else {
                callback(err, data2);
              }
            });
          }
        }
        if (data.accessLevel == "Retailer") {
          if (found.brand) {
            data.brand = null;
            User.saveData(data, function (err, data2) {
              if (err) {
                callback(err, data2);
              } else {
                callback(err, data2);
              }
            });
          } else {
            User.saveData(data, function (err, data2) {
              if (err) {
                callback(err, data2);
              } else {
                callback(err, data2);
              }
            });
          }
        }
      }
    });
  },

  add: function () {
    var sum = 0;
    _.each(arguments, function (arg) {
      sum += arg;
    });
    return sum;
  },

  existsSocial: function (user, callback) {
    var Model = this;
    console.log("existsSocial user: ", user);
    Model.findOne({
      email: user.emails[0].value
    }).exec(function (err, data) {
      console.log("existsSocial: ", err, data);
      if (err) {
        callback(err, data);
      } else if (_.isEmpty(data)) {
        var envEmailIndex = _.indexOf(env.emails, user.emails[0].value);
        console.log("envEmailIndexenvEmailIndexenvEmailIndex", envEmailIndex);
        if (envEmailIndex >= 0) {
          var modelUser = {
            name: user.displayName,
            accessToken: [uid(16)],
            oauthLogin: [{
              socialId: user.id,
              socialProvider: user.provider
            }]
          };
          modelUser.email = user.emails[0].value;
          modelUser.accessLevel = "Admin";
          modelUser.googleAccessToken = user.googleAccessToken;
          modelUser.googleRefreshToken = user.googleRefreshToken;
          if (user.image && user.image.url) {
            modelUser.photo = user.image.url;
          }
          Model.saveData(modelUser, function (err, data2) {
            if (err) {
              callback(err, data2);
            } else {
              data3 = data2.toObject();
              delete data3.oauthLogin;
              delete data3.password;
              delete data3.forgotPassword;
              delete data3.otp;
              callback(err, data3);
            }
          });
        } else {
          data = {};
          data.accessToken = [];
          data.name = "noAccess";
          callback(err, data);
        }
      } else {
        console.log("00000000000000000000000000", data);
        delete data.oauthLogin;
        delete data.password;
        delete data.forgotPassword;
        delete data.otp;
        data.googleAccessToken = user.googleAccessToken;
        data.googleRefreshToken = user.googleRefreshToken;
        (data.name = user.displayName),
        (data.accessToken = [uid(16)]),
        (data.oauthLogin = [{
          socialId: user.id,
          socialProvider: user.provider
        }]);
        data.save(function () {});
        callback(err, data);
      }
    });
  },

  existsSocialFrontendLogin: function (user, callback) {
    var Model = this;
    // console.log("existsSocial user: ", user);
    Model.findOne({
      email: user.emails[0].value
    }).exec(function (err, data) {
      console.log("existsSocial: ", err, data);
      if (err) {
        callback(err, data);
      } else if (_.isEmpty(data)) {
        var modelUser = {
          name: user.displayName,
          accessToken: [uid(16)],
          oauthLogin: [{
            socialId: user.id,
            socialProvider: user.provider
          }]
        };
        modelUser.email = user.emails[0].value;
        modelUser.accessLevel = "User";
        modelUser.verificationStatus = true;
        modelUser.googleAccessToken = user.googleAccessToken;
        modelUser.googleRefreshToken = user.googleRefreshToken;
        console.log("SOCIAL LOGIN-->", modelUser);
        if (user.image && user.image.url) {
          modelUser.photo = user.image.url;
        }
        Model.saveData(modelUser, function (err, data2) {
          if (err) {
            callback(err, data2);
          } else {
            data3 = data2.toObject();
            User.sendIntroEmail(data3, function () {});
            delete data3.oauthLogin;
            delete data3.password;
            delete data3.forgotPassword;
            delete data3.otp;
            callback(err, data3);
          }
        });
      } else {
        // console.log("00000000000000000000000000", data)
        delete data.oauthLogin;
        delete data.password;
        delete data.forgotPassword;
        delete data.otp;
        data.googleAccessToken = user.googleAccessToken;
        data.googleRefreshToken = user.googleRefreshToken;
        (data.name = user.displayName),
        (data.accessToken = [uid(16)]),
        (data.oauthLogin = [{
          socialId: user.id,
          socialProvider: user.provider
        }]);
        data.save(function () {});
        callback(err, data);
      }
    });
  },

  existsSocialFrontendFbLogin: function (user, callback) {
    var Model = this;
    // console.log("existsSocial user: ", user);
    Model.findOne({
      email: user.emails[0].value
    }).exec(function (err, data) {
      console.log("existsSocial: ", err, data);
      if (err) {
        callback(err, data);
      } else if (_.isEmpty(data)) {
        var modelUser = {
          name: user.name.givenName,
          accessToken: [uid(16)],
          oauthLogin: [{
            socialId: user.id,
            socialProvider: user.provider
          }]
        };
        modelUser.verificationStatus = true;
        modelUser.email = user.emails[0].value;
        modelUser.accessLevel = "User";
        console.log("SOCIAL LOGIN-->", modelUser);

        if (user.photos && user.photos[0] && user.photos[0].value) {
          modelUser.photo = user.photos[0].value;
        }
        Model.saveData(modelUser, function (err, data2) {
          if (err) {
            callback(err, data2);
          } else {
            data3 = data2.toObject();
            User.sendIntroEmail(data3, function () {});
            delete data3.oauthLogin;
            delete data3.password;
            delete data3.forgotPassword;
            delete data3.otp;
            console.log(
              "data3 if console inside existsSocialFrontendFbLogin",
              data3
            );
            callback(err, data3);
          }
        });
      } else {
        // console.log("00000000000000000000000000", data)
        delete data.oauthLogin;
        delete data.password;
        delete data.forgotPassword;
        delete data.otp;
        (data.name = user.name.givenName),
        (data.accessToken = [uid(16)]),
        (data.oauthLogin = [{
          socialId: user.id,
          socialProvider: user.provider
        }]);
        data.save(function () {});
        console.log(
          "data3 else console inside existsSocialFrontendFbLogin",
          data
        );

        callback(err, data);
      }
    });
  },

  profile: function (data, callback, getGoogle) {
    User.findOne({
      accessToken: data.accessToken
    }).exec(function (err, data) {
      if (err) {
        callback(err);
      } else if (data) {
        callback(null, data);
      } else {
        callback("No Data Found", data);
      }
    });
  },

  updateAccessToken: function (id, accessToken) {
    User.findOne({
      _id: id
    }).exec(function (err, data) {
      data.googleAccessToken = accessToken;
      data.save(function () {});
    });
  },

  /**
   * This function get all the media from the id.
   * @param {userId} data
   * @param {callback} callback
   * @returns  that number, plus one.
   */
  getAllMedia: function (data, callback) {},

  //old api written

  addUserRelationMember: function (data, callback) {
    var newuserData;
    async.waterfall(
      [
        function (callback) {
          console.log("data", data);
          var dataToSend = {};
          dataToSend.name = data.name;
          dataToSend.nickName = data.nickName;
          dataToSend.email = data.email;
          dataToSend.mobile = data.contact;
          User.saveData(dataToSend, callback);
        },
        function (newUserData, callback) {
          // console.log("newUserData", newUserData);
          newuserData = newUserData;
          if (!_.isEmpty(newUserData)) {
            User.findOne({
              _id: data._id
            }).exec(callback);
          } else {
            callback(err, "noData");
          }
        },
        function (oldUserData, callback) {
          // console.log("oldUserData", oldUserData);
          var sendData = {};
          sendData = oldUserData;
          var arrData = [];
          arrData = oldUserData.relations;
          // console.log("arrData---------", arrData);
          var sendData1 = {};
          sendData1.relationType = data.relation;
          sendData1.user = newuserData._id;
          arrData.push(sendData1);
          sendData.relations = arrData;
          // console.log("arrData---------", arrData);
          User.saveData(sendData, function (err, userData) {
            var productDataToSave = {};
            productDataToSave._id = data.productId;
            productDataToSave.relatedUser = arrData;
            // console.log("productDataToSave---------", productDataToSave);
            Product.saveData(productDataToSave, callback);
          });
        }
      ],
      callback
    );
  },

  addRelation: function (data, callback) {
    var newuserData;
    var oldUserName;
    async.waterfall(
      [
        function (callback) {
          console.log("data", data);
          var dataToSend = {};
          dataToSend.name = data.name;
          dataToSend.nickName = data.nickName;
          dataToSend.email = data.email;
          dataToSend.mobile = data.mobile;
          User.saveData(dataToSend, callback);
        },
        function (newUserData, callback) {
          // console.log("newUserData", newUserData);
          newuserData = newUserData;
          if (!_.isEmpty(newUserData)) {
            User.findOne({
              _id: data._id
            }).exec(callback);
          } else {
            callback(err, "noData");
          }
        },
        function (oldUserData, callback) {
          oldUserName = oldUserData.name;
          console.log("oldUserData", oldUserData);
          var sendData = {};
          sendData = oldUserData;
          var arrData = [];
          arrData = oldUserData.relations;
          // console.log("arrData---------", arrData);
          var sendData1 = {};
          sendData1.relationType = data.relation;
          sendData1.user = newuserData._id;
          arrData.push(sendData1);
          sendData.relations = arrData;
          // console.log("arrData---------", arrData);
          User.saveData(sendData, function (err, result) {
            if (err) {
              callback(err, null);
            } else {
              callback(null, result);
            }
          });
        },
        function (data2, callback) {
          console.log("family Member", data)
          var emailData = {};
          var time = new Date().getHours();
          var greeting;
          if (time < 10) {
            greeting = "Good morning";
          } else if (time < 17) {
            greeting = "Good Afternoon";
          } else {
            greeting = "Good evening";
          }
          emailData.from = "sahil@pumpkiin.com";
          emailData.user = data.name;
          emailData.name = oldUserName;
          emailData.email = data.email;
          emailData.relation = data.relation;
          emailData.greeting = greeting;
          emailData.filename = "addFamilyMemberMail";
          emailData.subject = "Family member added successfully!";
          // console.log("emailData---------", emailData)
          var email = {};
          email = emailData.email;
          Config.sendEmail({
              //from
              email: "sahil@pumpkiin.com",
              name: "Sahil"
            },
            //to
            //emailData,
            [{
              email
            }],
            //subject
            emailData.subject,
            "",
            emailData,
            function (err, emailResp) {
              if (err) {
                console.log("err", err);
                callback("canNotSendMail", null);
              } else {
                console.log("err", emailResp);
                callback(null, "mailSent");
              }
            }
          );
        }
      ],
      callback
    );
  },

  removeUserRelationMember: function (userId, mobile, callback) {
    console.log("inside api", userId, mobile);
    async.waterfall(
      [
        function (callback1) {
          User.findOne({
            mobile: mobile
          }).exec(function (err, found) {
            console.log("found********", found);
            if (err) {
              callback1(err, null);
            } else if (_.isEmpty(found)) {
              callback1("noDataound", null);
            } else {
              var dataforDelete = {};
              dataforDelete._id = found._id;
              User.deleteData(found, function (err, created) {
                if (err) {
                  callback1(err, null);
                } else if (_.isEmpty(created)) {
                  callback1(null, "noDataound");
                } else {
                  callback1(null, found._id);
                }
              });
            }
          });
        },
        function (id, callback2) {
          console.log("idddddddddddddd", id);
          User.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(userId)
          }, {
            $pull: {
              member: {
                memberId: id
              }
            }
          }, {
            new: true
          }).exec(function (err, found) {
            if (err) {
              callback2(err, null);
            } else if (_.isEmpty(found)) {
              callback2("noDataound", null);
            } else {
              callback2(null, found);
            }
          });
        }
      ],
      function (err, data) {
        if (err || _.isEmpty(data)) {
          callback(err, []);
        } else {
          callback(null, data);
        }
      }
    );
  },

  getAllMembersForSearch: function (data, callback) {
    User.find({}, {
        name: 1,
        _id: 1,
        mobile: 1
      })
      .lean()
      .exec(function (err, data) {
        callback(null, data);
      });
  },

  sendOtp: function (data, callback) {
    if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
      if (data.mobile == 9167299537) {
        var otpNumber = 1111;
      } else {
        var otpNumber = (Math.random() + "").substring(2, 6);
      }
    } else {
      otpNumber = 1111;
    }
    User.findOneAndUpdate({
      mobile: data.mobile
    }, {
      otp: otpNumber,
      accessToken: uid(16),
      otpTime: new Date()
    }, {
      new: true,
      upsert: true
    }).exec(function (err, found) {
      if (err) {
        callback(err, null);
      } else if (_.isEmpty(found)) {
        callback("noDataFound", null);
      } else {
        data3 = found.toObject();
        delete data3.accessToken;
        delete data3.password;
        delete data3.forgotPassword;
        if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
          var smsData = {};
          smsData.message = "Your verification code is " + data3.otp;
          smsData.senderId = "PUMPKIIN";
          smsData.mobile = data.mobile;
          delete data3.otp;
          Config.sendSms(smsData, function (err, smsRespo) {
            if (err) {
              console.log(
                "*************************************************sms gateway error in photographer***********************************************",
                err
              );
            } else if (smsRespo) {
              console.log(
                smsRespo,
                "*************************************************sms sent partyyy hupppieeee**********************************************"
              );
            } else {
              console.log("invalid data");
            }
          });
        } else {
          delete data3.otp;
        }

        callback(null, data3);
      }
    });
  },

  verifyUserWithOtp: function (data, callback) {
    User.findOne({
      mobile: data.mobile,
      otp: data.otp
    }).exec(function (err, found) {
      if (err || _.isEmpty(found)) {
        callback(err, null);
      } else {
        var aa = moment().subtract(2, "minute");
        var bb = new Date();
        var cc = moment(found.createdAt).isBetween(aa, bb);
        if (!found.verificationStatus) {
          data._id = found._id;
          User.saveData(data, function () {});
          data3 = found.toObject();
          delete data3.accessToken;
          delete data3.password;
          delete data3.forgotPassword;
          delete data3.otp;

          User.sendIntroEmail(data, function () {}, true);

          data3.email = data.email;
          data3.name = data.name;
          callback(null, data3);
        } else {
          data._id = found._id;
          User.saveData(data, function () {});
          data3 = found.toObject();
          delete data3.accessToken;
          delete data3.password;
          delete data3.forgotPassword;
          delete data3.otp;
          data3.email = data.email;
          data3.name = data.name;
          callback(null, data3);
        }
      }
    });
  },
  verifyUserWithFB: function (data, callback) {
    User.findOne({
      mobile: data.mobile,
      otp: data.otp
    }).exec(function (err, found) {
      if (err || _.isEmpty(found)) {
        callback(err, null);
      } else {
        var aa = moment().subtract(2, "minute");
        var bb = new Date();
        var cc = moment(found.createdAt).isBetween(aa, bb);
        if (!data.verificationStatus) {
          data._id = found._id;
          User.saveData(data, function () {});
          data3 = found.toObject();
          delete data3.accessToken;
          delete data3.password;
          delete data3.forgotPassword;
          delete data3.otp;
          var emailData = {};
          var time = new Date().getHours();
          var greeting;
          if (time < 10) {
            greeting = "Good morning";
          } else if (time < 17) {
            greeting = "Good Afternoon";
          } else {
            greeting = "Good evening";
          }
          emailData.from = "sahil@pumpkiin.com";
          emailData.name = data.name;
          emailData.email = data.email;
          emailData.greeting = greeting;
          emailData.filename = "welcomeFB";
          emailData.subject = "Welcome to pumpkiin";
          emailData.verificationUrl = env.realHost + "/verifyemail/" + data._id;
          Config.email(emailData, function (err, emailRespo) {}, true);
          data3.email = data.email;
          data3.name = data.name;
          callback(null, data3);
        } else {
          data._id = found._id;
          User.saveData(data, function () {});
          data3 = found.toObject();
          delete data3.accessToken;
          delete data3.password;
          delete data3.forgotPassword;
          delete data3.otp;
          data3.email = data.email;
          data3.name = data.name;
          callback(null, data3);
        }
      }
    });
  },

  //for edit mobileNumber

  sendMobileOtp: function (data, callback) {
    if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
      var otpNumber = (Math.random() + "").substring(2, 6);
    } else {
      otpNumber = 1111;
    }
    User.findOneAndUpdate({
      _id: data._id
    }, {
      otp: otpNumber,
      otpTime: new Date(),
      mobile: data.mobile
    }, {
      new: true
    }).exec(function (err, found) {
      if (err) {
        callback(err, null);
      } else if (_.isEmpty(found)) {
        callback("noDataFound", null);
      } else {
        data3 = found.toObject();
        delete data3.accessToken;
        delete data3.password;
        delete data3.forgotPassword;
        if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
          var smsData = {};
          smsData.message = "Your verification code is " + data3.otp;
          smsData.senderId = "PUMPKIIN";
          smsData.mobile = data.mobile;
          delete data3.otp;
          Config.sendSms(smsData, function (err, smsRespo) {
            if (err) {
              console.log(
                "*************************************************sms gateway error in photographer***********************************************",
                err
              );
            } else if (smsRespo) {
              console.log(
                smsRespo,
                "*************************************************sms sent partyyy hupppieeee**********************************************"
              );
            } else {
              console.log("invalid data");
            }
          });
        } else {
          delete data3.otp;
        }
        callback(null, data3);
      }
    });
  },

  verifyMobileOtp: function (data, callback) {
    User.findOne({
      mobile: data.mobile,
      otp: data.otp
    }).exec(function (err, found) {
      if (err || _.isEmpty(found)) {
        callback(err, null);
      } else {
        callback(null, found);
      }
    });
  },

  searchUser: function (data, callback) {
    User.find({}).exec(function (err, found) {
      if (err || _.isEmpty(found)) {
        callback(err, null);
      } else {
        callback(null, found);
      }
    });
  },

  saveUpdatedData: function (data, callback) {
    console.log("save the updated data", data);
    User.findOneAndUpdate({
      _id: data._id
    }, {
      dob: data.dob,
      gender: data.gender,
      mobile: data.mobile,
      email: data.email
    }, {
      new: true
    }).exec(function (err, found) {
      if (err || _.isEmpty(found)) {
        callback(err, null);
      } else {
        var emailData = {};
        var time = new Date().getHours();
        var greeting;
        if (time < 10) {
          greeting = "Good morning";
        } else if (time < 17) {
          greeting = "Good Afternoon";
        } else {
          greeting = "Good evening";
        }
        emailData.from = "sahil@pumpkiin.com";
        emailData.name = found.name;
        emailData.mobile = found.mobile;
        emailData.email = found.email;
        emailData.dob = moment(found.dob).format("MMM DD YYYY");
        emailData.gender = found.gender;
        emailData.greeting = greeting;
        emailData.filename = "information-update";
        emailData.subject = "Following fields has been successfully updated!";
        // console.log("emailData---------", emailData)
        var email = {};
        email = emailData.email;
        Config.sendEmail({
            //from
            email: "sahil@pumpkiin.com",
            name: "Sahil"
          },
          //to
          //emailData,
          [{
            email
          }],
          //subject
          emailData.subject,
          "",
          emailData,
          function (err, emailResp) {
            if (err) {
              console.log("err", err);
              callback("canNotSendMail", null);
            } else {
              console.log("err", emailResp);
              callback(null, "mailSent");
            }
          }
        );

        // callback(null, found)
      }
    });
  },

  verifyEmail: function (data, callback) {
    console.log(data);
    User.findOneAndUpdate({
      _id: data.userId
    }, {
      verificationStatus: true
    }, {
      new: true
    }).exec(callback);
  },

  sendIntroEmail: function (data, callback, sendVerification) {
    global.red(data);
    var emailData = {};
    var time = new Date().getHours();
    var greeting;
    if (time < 10) {
      greeting = "Good morning";
    } else if (time < 17) {
      greeting = "Good Afternoon";
    } else {
      greeting = "Good evening";
    }
    emailData.from = "sahil@pumpkiin.com";
    emailData.name = data.name;
    emailData.email = data.email;
    emailData.greeting = greeting;
    if (sendVerification) {
      emailData.filename = "welcome";
    } else {
      emailData.filename = "welcomeFB";
    }

    emailData.subject = "Welcome to Pumpkiin";
    emailData.verificationUrl = env.realHost + "/verifyemail/" + data._id;
    Config.email(emailData, function (err, resultData) {
      console.log("1111111111111111111111111111111")
      console.log(resultData)
      callback(null, resultData);
    });
    console.log("+++++++++++++++++++++++++++++++++", emailData, '++++++++++++++++++++++++', callback)
  },

  addressEditEmail: function (data, callback) {
    console.log("address --- ", data);
    var emailData = {};
    var time = new Date().getHours();
    var greeting;
    if (time < 10) {
      greeting = "Good morning";
    } else if (time < 17) {
      greeting = "Good Afternoon";
    } else {
      greeting = "Good evening";
    }
    emailData.from = "sahil@pumpkiin.com";
    emailData.name = data.user;
    // emailData.mobile = found.mobile;
    emailData.email = data.email;
    emailData.title = data.address.title;
    emailData.address = data.address.address;
    // emailData.dob = moment(found.dob).format("MMM DD YYYY");
    // emailData.gender = found.gender;
    emailData.greeting = greeting;
    emailData.filename = "addressEditMail";
    emailData.subject = "Address successfully updated!";
    // console.log("emailData---------", emailData)
    var email = {};
    email = emailData.email;
    Config.sendEmail({
        //from
        email: "sahil@pumpkiin.com",
        name: "Sahil"
      },
      //to
      //emailData,
      [{
        email
      }],
      //subject
      emailData.subject,
      "",
      emailData,
      function (err, emailResp) {
        if (err) {
          console.log("err", err);
          callback("canNotSendMail", null);
        } else {
          console.log("err", emailResp);
          callback(null, "mailSent");
        }
      }
    );
  },
  sendEmailToFamily: function (data, callback) {
    console.log("address --- ", data);
    var emailData = {};
    var time = new Date().getHours();
    var greeting;
    if (time < 10) {
      greeting = "Good morning";
    } else if (time < 17) {
      greeting = "Good Afternoon";
    } else {
      greeting = "Good evening";
    }
    emailData.from = "sahil@pumpkiin.com";
    emailData.name = data.name;
    emailData.user = data.user.name;
    emailData.email = data.user.email;
    emailData.relation = data.user.relation;
    // emailData.dob = moment(found.dob).format("MMM DD YYYY");
    // emailData.gender = found.gender;
    emailData.greeting = greeting;
    emailData.filename = "addFamilyMemberMail";
    emailData.subject = "Family member added successfully!";
    // console.log("emailData---------", emailData)
    var email = {};
    email = emailData.email;
    Config.sendEmail({
        //from
        email: "sahil@pumpkiin.com",
        name: "Sahil"
      },
      //to
      //emailData,
      [{
        email
      }],
      //subject
      emailData.subject,
      "",
      emailData,
      function (err, emailResp) {
        if (err) {
          console.log("err", err);
          callback("canNotSendMail", null);
        } else {
          console.log("err", emailResp);
          callback(null, "mailSent");
        }
      }
    );
  },
  saveEditedUSer: function (data, callback) {
    console.log("saveEditedUSer", data.user._id);
    async.parallel(
      [
        function (callback) {
          User.findOneAndUpdate({
            _id: data.user._id
          }, {
            // relationType: data.user.relationType,
            name: data.user.name,
            email: data.user.email,
            mobile: data.user.mobile,
            nickName: data.user.nickName
          }, {
            new: true
          }).exec(callback);
        },
        function (callback) {
          User.update({
            _id: data.userId,
            "relations.user": data.user._id
          }, {
            "relations.$.relationType": data.relationType
          }).exec(callback);
        }
      ],
      callback
    );
  },
  saveProfilePic: function (data, callback) {
    User.findOneAndUpdate({
      _id: data._id
    }, {
      profilePic: data.profilePic
    }, {
      new: true
    }).exec(callback);
  },


  searchUsers: function (data, callback) {
    var Model = this;
    var Const = this(data);
    var maxRow = Config.maxRow;
    if (data.keyword) {} else {
      data.keyword = "";
    }
    var page = 1;
    if (data.page) {
      page = data.page;
    }
    var options = {
      filters: {
        field: data.fields,
        keyword: {
          fields: ['name'],
          term: data.keyword
        }
      },
      sort: {
        asc: 'name'
      },
      start: (page - 1) * maxRow,
      count: maxRow
    };
    _.each(data.filter, function (n, key) {
      if (_.isEmpty(n)) {
        n = undefined;
      }
    });
    var Search = Model.find(data.filter).sort({
        createdAt: -1
      })
      .field(options)
      .order(options)
      .keyword(options)
      .page(options, callback);
  }
};
module.exports = _.assign(module.exports, exports, model);