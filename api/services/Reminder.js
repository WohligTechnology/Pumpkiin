var cron = require("node-cron");
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
  reminderMailSent: {
    type: Boolean,
    default: false
  },
  warrantyRemindermail: {
    type: Boolean,
    default: false
  },
  insurranceRemindermail: {
    type: Boolean,
    default: false
  }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model("Reminder", schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
  totalNumberOfReminders: function(data, callback) {
    this.find({
      user: data.user
    })
      .count()
      .exec(callback);
  },

  totalNumberOfCompletedReminders: function(data, callback) {
    this.find({
      user: data.user,
      status: "Completed"
    })
      .count()
      .exec(callback);
  },

  totalNumberOfPendingReminders: function(data, callback) {
    this.find({
      user: data.user,
      $or: [
        {
          status: "Pending"
        },
        {
          status: "Snooze"
        }
      ]
    })
      .count()
      .exec(callback);
  },

  findReminderOfPendingSnoozeByUser: function(data, callback) {
    this.find({
      user: data.user,
      $or: [
        {
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

  findReminderOfCompletedByUser: function(data, callback) {
    this.find({
      user: data.user,
      status: "Completed"
    })
      .sort({
        dateOfReminder: 1
      })
      .exec(callback);
  },

  reminderMail: function(data, callback) {
    async.waterfall(
      [
        function(callback) {
          Reminder.saveData(data, function(err, found) {
            if (err || _.isEmpty(found)) {
              callback(err, null);
            } else {
              callback(null, found);
            }
          });
        },
        function(finalData, callback) {
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
          emailData.title = data.title;
          emailData.description = data.description;
          emailData.filename = "Reminder.ejs";
          emailData.subject = "Reminder Notification";
          console.log("emailData in reminder mail", emailData);
          Config.email(emailData, function(err, emailRespo) {
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

  searchClosedReminders: function(data, callback) {
    Reminder.aggregate(
      [
        {
          $match: {
            title: {
              $regex: data.keyword,
              $options: "i"
            },
            status: "Completed",
            user: ObjectId(data.user)
          }
        }
      ],
      function(err, found) {
        if (err || _.isEmpty(found)) {
          callback(err, null);
        } else {
          callback(null, found);
        }
      }
    );
  },

  searchOpenReminders: function(data, callback) {
    Reminder.aggregate(
      [
        {
          $match: {
            title: {
              $regex: data.keyword,
              $options: "i"
            },
            status: "Pending",
            user: ObjectId(data.user)
          }
        }
      ],
      function(err, found) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, found);
        }
      }
    );
  },

  changeIsReadStatus: function(data, callback) {
    // console.log("-----------", data);
    this.findOneAndUpdate(
      {
        _id: data.id
      },
      {
        isRead: data.isRead
      },
      {
        new: true
      }
    ).exec(callback);
  },
  deleteMultiple: function(data, callback) {
    // console.log("-----------", data);
    this.remove({
      _id: {
        $in: data.data
      }
    }).exec(callback);
  },
  multiCompleted: function(data, callback) {
    Reminder.update(
      {
        _id: {
          $in: data.data
        }
      },
      {
        $set: {
          status: "Completed"
        }
      },
      {
        multi: true
      }
    ).exec(callback);
  },

  sendReminderMail: function() {
    Reminder.find({
      reminderMailSent: false
    })
      .populate("user")
      .exec(function(err, data) {
        // console.log("1----", data);
        async.eachSeries(
          data,
          function(singelData, callback) {
            var reminderDate = moment(singelData.dateOfReminder);
            var currentDate = moment(new Date());
            console.log(
              "reminderDate",
              reminderDate,
              "currentDate",
              currentDate,
              "new Date().getHours();",
              new Date().getHours()
            );
            console.log("singelData", singelData);
            var day = reminderDate.diff(currentDate, "days");
            console.log("day-->", day);
            if (singelData.user.email && day == 0) {
              console.log("@@@@@ MAIL SENT  @@@@@");
              Reminder.update(
                {
                  _id: singelData._id
                },
                {
                  reminderMailSent: true
                }
              ).exec(function(err, data3) {});

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
              emailData.name = singelData.user.name ? singelData.user.name : "";
              emailData.email = singelData.user.email
                ? singelData.user.email
                : "";
              emailData.greeting = greeting;
              emailData.title = singelData.title ? singelData.title : "";
              emailData.description = singelData.description
                ? singelData.description
                : "";
              emailData.filename = "Reminder.ejs";
              emailData.subject = "Reminder Notification";
              console.log("emailData", emailData);
              Config.email(emailData, function(err, emailRespo) {
                console.log("err", err);
                console.log("emailRespo", emailRespo);
                callback(null, emailRespo);
              });
            } else {
              callback();
            }
          },
          function(err, data2) {
            if (err) {
              console.log("In Err");
            } else {
              console.log("In HERE ");
            }
          }
        );
      });
  },
  sendWarrantyReminderMail: function() {
    Reminder.find({
      warrantyRemindermail: false,
      user: "5ba9d658803f451b9ccffc6a"
    })
      .populate("user")
      .exec(function(err, data) {
        if (err || _.isEmpty(data)) {
        } else {
          console.log("2----", data[25]);
          async.eachSeries(
            data,
            function(singelData, callback) {
              console.log("3----", singelData);
              var reminderDate = moment(singelData.dateOfReminder);
              var currentDate = moment(new Date());
              // console.log("reminderDate", reminderDate, "currentDate", currentDate);
              var day = reminderDate.diff(currentDate, "days");
              if (
                (singelData.email && day == 0) ||
                (singelData.email && day == 29)
              ) {
                Reminder.update(
                  {
                    _id: singelData._id
                  },
                  {
                    warrantyRemindermail: true
                  }
                ).exec(function(err, data3) {});

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
                emailData.name = singelData.user.name
                  ? singelData.user.name
                  : "";
                emailData.email = singelData.user.email;
                emailData.greeting = greeting;
                emailData.title = singelData.title ? singelData.title : "";
                emailData.description = singelData.description
                  ? singelData.description
                  : "";
                emailData.filename = "warrantyReminder.ejs";
                emailData.subject = "Reminder Notification";
                Config.email(emailData, function(err, emailRespo) {
                  console.log("err", err);
                  console.log("emailRespo", emailRespo);
                  callback(null, emailRespo);
                });
              }
            },
            function(err, data2) {
              if (err) {
                console.log("In Err");
              } else {
                console.log("In HERE ");
              }
            }
          );
        }
      });
  },
  sendInsuranceReminderMail: function() {
    Reminder.find({
      insurranceRemindermail: false,
      user: "5ba9d658803f451b9ccffc6a"
    })
      .populate("user")
      .exec(function(err, data) {
        if (err || _.isEmpty(data)) {
        } else {
          console.log("2----", data[25]);
          async.eachSeries(
            data,
            function(singelData, callback) {
              console.log("3----", singelData);
              var reminderDate = moment(singelData.dateOfReminder);
              var currentDate = moment(new Date());
              // console.log("reminderDate", reminderDate, "currentDate", currentDate);
              var day = reminderDate.diff(currentDate, "days");
              if (
                (singelData.email && day == 1) ||
                (singelData.email && day == 30)
              ) {
                Reminder.update(
                  {
                    _id: singelData._id
                  },
                  {
                    insurranceRemindermail: true
                  }
                ).exec(function(err, data3) {});

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
                emailData.name = singelData.user.name
                  ? singelData.user.name
                  : "";
                emailData.email = singelData.user.email;
                emailData.greeting = greeting;
                emailData.title = singelData.title ? singelData.title : "";
                emailData.description = singelData.description
                  ? singelData.description
                  : "";
                emailData.filename = "warrantyReminder.ejs";
                emailData.subject = "Reminder Notification";
                Config.email(emailData, function(err, emailRespo) {
                  console.log("err", err);
                  console.log("emailRespo", emailRespo);
                  callback(null, emailRespo);
                });
              }
            },
            function(err, data2) {
              if (err) {
                console.log("In Err");
              } else {
                console.log("In HERE ");
              }
            }
          );
        }
      });
  }
};

sails.on("ready", function() {
  cron.schedule("*/5 * * * *", function() {
    Reminder.sendReminderMail({});
    console.log("===================================");
  });
});

sails.on("ready", function() {
  cron.schedule("*/5 * * * *", function() {
    Reminder.sendWarrantyReminderMail({});
    console.log("===================================");
  });
});

sails.on("ready", function() {
  cron.schedule("*/5 * * * *", function() {
    Reminder.sendInsuranceReminderMail({});
    console.log("===================================");
  });
});

module.exports = _.assign(module.exports, exports, model);
