var schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  title: String,
  isRead: {
    type: Boolean,
    default: false
  },
  description: String,
  // datefrom: Date,
  // dateTo: Date,
  // time: Date,
  dateOfReminder: Date,
  status: {
    type: String,
    enum: ["Completed", "Pending", "Snooze"]
  },
  reminderMailSent1: {
    type: Boolean,
    default: false
  },
  reminderMailSent2: {
    type: Boolean,
    default: false
  },
  warrantyRemindermail1: {
    type: Boolean,
    default: false
  },
  warrantyRemindermail2: {
    type: Boolean,
    default: false
  },
  insurranceRemindermail1: {
    type: Boolean,
    default: false
  },
  insurranceRemindermail2: {
    type: Boolean,
    default: false
  },

  reminderCount: {
    type: Number,
    default: 0
  },

  warrantyReminderCount: {
    type: Number,
    default: 0
  },
  insurranceReminderCount: {
    type: Number,
    default: 0
  }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model("Reminder", schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
  totalNumberOfReminders: function (data, callback) {
    this.find({
        user: data.user
      })
      .count()
      .exec(callback);
  },

  totalNumberOfCompletedReminders: function (data, callback) {
    this.find({
        user: data.user,
        status: "Completed"
      })
      .count()
      .exec(callback);
  },


  totalNumberOfPendingReminders: function (data, callback) {
    this.find({
        user: data.user,
        $or: [{
            status: "Pending"
          },
          {
            status: "Snooze"
          }
        ],
        isRead: false
      })
      .count()
      .exec(callback);
  },

  findReminderOfPendingSnoozeByUser: function (data, callback) {
    this.find({
        user: data.user,
        $or: [{
            status: "Pending"
          },
          {
            status: "Snooze"
          }
        ]
      })
      .sort({
        dateOfReminder: 1
      })
      .exec(callback);
  },

  findReminderOfCompletedByUser: function (data, callback) {
    this.find({
        user: data.user,
        status: "Completed"
      })
      .sort({
        dateOfReminder: 1
      })
      .exec(callback);
  },

  reminderMail: function (data, callback) {
    async.waterfall(
      [
        function (callback) {
          Reminder.saveData(data, function (err, found) {
            if (err || _.isEmpty(found)) {
              callback(err, null);
            } else {
              callback(null, found);
            }
          });
        },
        function (finalData, callback) {
          var emailData = {};
          var time = parseInt(moment(new Date()).add(5, "hours").add(30, "minutes").format("HH"));
          var greeting;
          if (time < 12) {
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
          emailData.title = data.title;
          emailData.description = data.description;
          emailData.date = moment(data.dateOfReminder).add(5, "hours").add(30, "minutes").format("DD/MM/YYYY");
          emailData.filename = "Reminder";
          emailData.subject = "Reminder Notification";
          console.log("emailData in reminder mail", emailData);
          Config.email(emailData, function (err, emailRespo) {
            console.log("err------------------", err);
            console.log("emailRespo-----------", emailRespo);
            callback(null, emailRespo);
          });
        }
      ],
      callback
    );
  },

  //searchBar

  searchClosedReminders: function (data, callback) {
    Reminder.aggregate(
      [{
        $match: {
          title: {
            $regex: data.keyword,
            $options: "i"
          },
          $or: [{
            status: "Pending"
          }, {
            status: "Snooze"
          }],
          user: ObjectId(data.user)
        }
      }],
      function (err, found) {
        if (err || _.isEmpty(found)) {
          callback(err, null);
        } else {
          callback(null, found);
        }
      }
    );
  },

  searchOpenReminders: function (data, callback) {
    Reminder.aggregate(
      [{
        $match: {
          title: {
            $regex: data.keyword,
            $options: "i"
          },
          $or: [{
            status: "Pending"
          }, {
            status: "Snooze"
          }],
          user: ObjectId(data.user)
        }
      }],
      function (err, found) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, found);
        }
      }
    );
  },

  changeIsReadStatus: function (data, callback) {
    // console.log("-----------", data);
    this.findOneAndUpdate({
      _id: data.id
    }, {
      isRead: data.isRead
    }, {
      new: true
    }).exec(callback);
  },
  deleteMultiple: function (data, callback) {
    // console.log("-----------", data);
    this.remove({
      _id: {
        $in: data.data
      }
    }).exec(callback);
  },
  multiCompleted: function (data, callback) {
    Reminder.update({
      _id: {
        $in: data.data
      }
    }, {
      $set: {
        status: "Completed"
      }
    }, {
      multi: true
    }).exec(callback);
  },
  sendReminderOneDayEarlyReminders: function (callback) {
    var minTime = moment().add(1, "day");
    var maxTime = moment().add(1, "day").add(5, "minutes");
    var sendReminderEmails;
    async.waterfall([
      function (callback) {
        Reminder.find({
          reminderMailSent1: false,
          $and: {
            dateOfReminder: {
              $gte: minTime.toDate()
            },
            dateOfReminder: {
              $lte: maxTime.toDate()
            }
          }
        }).populate("user").exec(callback)
      },
      function (sendReminderEmails, callback) {
        async.concatLimit(sendReminderEmails, 10, function (singleData, callback) {
          emailData = Reminder.createEmail(singleData);
          async.waterfall([
            // Send Email
            function (callback) {
              Config.email(emailData, callback);
            },
            // Edit Status of Reminder
            function (data, callback) {
              singleData.reminderMailSent1 = true;
              singleData.save(callback);
            },

          ], callback);
        }, callback);
      }
    ], callback);
  },
  sendReminderCurrentReminders: function (callback) {
    var sendReminderEmails;
    async.waterfall([
      function (callback) {
        Reminder.find({
          reminderMailSent2: false,
        }).populate("user").exec(callback)
      },
      function (reminders, callback) {
        var minTime = moment().add();
        var maxTime = moment().add().add(5, "minutes");
        sendReminderEmails = _.filter(reminders, function (n) {
          return moment(n.dateOfReminder).isBetween(minTime, maxTime);
        });
        async.concatLimit(sendReminderEmails, 10, function (singleData, callback) {
          emailData = Reminder.createEmail(singleData);
          async.waterfall([
            // Send Email
            function (callback) {
              Config.email(emailData, callback);
            },
            // Edit Status of Reminder
            function (data, callback) {
              singleData.reminderMailSent2 = true;
              singleData.save(callback);
            },

          ], callback);
        }, callback);
      }
    ], callback);
  },
  createEmail: function (singleData) {
    var emailData = {};
    var time = parseInt(moment().add(5, "hours").add(30, "minutes").format("HH"));
    var greeting;
    if (time < 12) {
      greeting = "Good morning";
    } else if (time < 17) {
      greeting = "Good Afternoon";
    } else {
      greeting = "Good evening";
    }
    emailData.from = "sahil@pumpkiin.com";
    emailData.name = singleData.user.name ? singleData.user.name : "";
    emailData.email = singleData.user.email ?
      singleData.user.email :
      "";
    emailData.greeting = greeting;
    emailData.title = singleData.title ? singleData.title : "";
    emailData.description = singleData.description ?
      singleData.description :
      "";
    emailData.filename = "Reminder";
    emailData.subject = "Reminder Notification";
    emailData.date = moment(singleData.dateOfReminder).add(5, "hours").add(30, "minutes").format("DD/MM/YYYY");
    return emailData;
  },
  sendWarrantyReminderMail: function () {
    Reminder.find({
        $or: [{
            warrantyRemindermail1: false
          },
          {
            warrantyRemindermail2: false
          }
        ]
      })
      .populate("user")
      .exec(function (err, data) {
        // console.log("1----", data);
        async.eachSeries(
          data,
          function (singelData, callback) {
            var reminderDate = moment(singelData.dateOfReminder);
            var currentDate = moment(new Date());
            var flag = false;

            var minutes = reminderDate.diff(currentDate, "minutes");
            console.log("------------>>", minutes);
            var reminderTime = new moment(singelData.dateOfReminder).format(
              "HH:mm"
            );
            var currentTime = moment(new Date()).format("HH:mm");
            console.log("------------>>", reminderTime, currentTime);
            if (minutes < 43200 && !singelData.warrantyRemindermail1 && singelData.title == "Warranty expiry") {
              flag = true;
              Reminder.update({
                _id: singelData._id
              }, {
                warrantyRemindermail1: true
              }).exec(function (err, data3) {});
            }
            if (minutes < 1440 && (currentTime == "10:00" && !singelData.warrantyRemindermail2 && singelData.title == "Warranty expiry")) {
              console.log("@@@@@ ELSE  @@@@@");
              flag = true;

              Reminder.update({
                _id: singelData._id
              }, {
                warrantyRemindermail2: true
              }).exec(function (err, data3) {});
            }


            if (flag) {
              console.log("In Flag");
              var emailData = {};
              var time = parseInt(moment(new Date()).add(5, "hours").add(30, "minutes").format("HH"));
              var greeting;
              if (time < 12) {
                greeting = "Good morning";
              } else if (time < 17) {
                greeting = "Good Afternoon";
              } else {
                greeting = "Good evening";
              }
              emailData.from = "sahil@pumpkiin.com";
              emailData.name = singelData.user.name ? singelData.user.name : "";
              emailData.email = singelData.user.email ?
                singelData.user.email :
                "";
              emailData.greeting = greeting;
              emailData.title = singelData.title ? singelData.title : "";
              emailData.description = singelData.description ?
                singelData.description :
                "";
              emailData.filename = "Reminder";
              emailData.subject = "Reminder Notification";
              emailData.date = moment(data.dateOfReminder).add(5, "hours").add(30, "minutes").format("DD/MM/YYYY");
              console.log("emailData", emailData);
              Config.email(emailData, function (err, emailRespo) {
                // console.log("err", err);
                console.log("emailRespo", emailRespo);
                callback(null, emailRespo);
              });
            }

          },
          function (err, data2) {
            if (err) {
              console.log("In Err");
            } else {
              console.log("In HERE ");
            }
          }
        );
      });
  },
  sendInsuranceReminderMail: function () {
    Reminder.find({
        $or: [{
            insurranceRemindermail1: false
          },
          {
            insurranceRemindermail2: false
          }
        ]
      })
      .populate("user")
      .exec(function (err, data) {
        // console.log("1----", data);
        async.eachSeries(
          data,
          function (singelData, callback) {
            var reminderDate = moment(singelData.dateOfReminder);
            var currentDate = moment(new Date());
            var flag = false;

            var minutes = reminderDate.diff(currentDate, "minutes");
            console.log("------------>>", minutes);
            var reminderTime = new moment(singelData.dateOfReminder).format(
              "HH:mm"
            );
            var currentTime = moment(new Date()).format("HH:mm");
            console.log("------------>>", reminderTime, currentTime);
            if (minutes < 43200 && !singelData.insurranceRemindermail1 && singelData.title == "Warranty expiry") {
              flag = true;
              Reminder.update({
                _id: singelData._id
              }, {
                insurranceRemindermail1: true
              }).exec(function (err, data3) {});
            }
            if (minutes < 1440 && (currentTime == "13:04" && !singelData.insurranceRemindermail2 && singelData.title == "Warranty expiry")) {
              console.log("@@@@@ ELSE  @@@@@");
              flag = true;

              Reminder.update({
                _id: singelData._id
              }, {
                insurranceRemindermail2: true
              }).exec(function (err, data3) {});
            }


            if (flag) {
              console.log("In Flag");
              var emailData = {};
              var time = parseInt(moment(new Date()).add(5, "hours").add(30, "minutes").format("HH"));
              var greeting;
              if (time < 12) {
                greeting = "Good morning";
              } else if (time < 17) {
                greeting = "Good Afternoon";
              } else {
                greeting = "Good evening";
              }
              emailData.from = "sahil@pumpkiin.com";
              emailData.name = singelData.user.name ? singelData.user.name : "";
              emailData.email = singelData.user.email ?
                singelData.user.email :
                "";
              emailData.greeting = greeting;
              emailData.title = singelData.title ? singelData.title : "";
              emailData.description = singelData.description ?
                singelData.description :
                "";
              emailData.filename = "Reminder";
              emailData.subject = "Reminder Notification";
              emailData.date = moment(data.dateOfReminder).add(5, "hours").add(30, "minutes").format("DD/MM/YYYY");
              console.log("emailData", emailData);
              Config.email(emailData, function (err, emailRespo) {
                // console.log("err", err);
                console.log("emailRespo", emailRespo);
                callback(null, emailRespo);
              });
            }

          },
          function (err, data2) {
            if (err) {
              console.log("In Err");
            } else {
              console.log("In HERE ");
            }
          }
        );
      });
  }
};

module.exports = _.assign(module.exports, exports, model);