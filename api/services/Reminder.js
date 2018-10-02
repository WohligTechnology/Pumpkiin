var cron = require('node-cron');
var schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
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
        enum: ['Completed', 'Pending', 'Snooze']
    },
    reminderMailSent: {
        type: Boolean,
        default: false
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Reminder', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    totalNumberOfReminders: function (data, callback) {
        this.find({
            user: data.user
        }).count().exec(callback);
    },

    totalNumberOfCompletedReminders: function (data, callback) {
        this.find({
            user: data.user,
            status: 'Completed'
        }).count().exec(callback);
    },

    totalNumberOfPendingReminders: function (data, callback) {
        this.find({
            user: data.user,
            $or: [{
                status: 'Pending'
            }, {
                status: 'Snooze'
            }]
        }).count().exec(callback);
    },


    findReminderOfPendingSnoozeByUser: function (data, callback) {
        this.find({
            user: data.user,
            $or: [{
                status: 'Pending'
            }, {
                status: 'Snooze'
            }]
        }).sort({
            dateOfReminder: 1
        }).exec(callback);
    },

    findReminderOfCompletedByUser: function (data, callback) {
        this.find({
            user: data.user,
            status: 'Completed'
        }).sort({
            dateOfReminder: 1
        }).exec(callback);
    },

    reminderMail: function (data, callback) {
        async.waterfall([
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
                Config.email(emailData, function (err, emailRespo) {
                    console.log("err------------------", err);
                    console.log("emailRespo-----------", emailRespo);
                    callback(null, emailRespo);
                });
            }
        ], callback);
    },

    //searchBar

    searchClosedReminders: function (data, callback) {
        Reminder.aggregate([{
            $match: {
                "title": {
                    $regex: data.keyword,
                    $options: "i"
                },
                "status": "Completed",
            }
        }], function (err, found) {
            if (err || _.isEmpty(found)) {
                callback(err, null);
            } else {
                callback(null, found)
            }
        });
    },

    searchOpenReminders: function (data, callback) {
        Reminder.aggregate([{
            $match: {
                "title": {
                    $regex: data.keyword,
                    $options: "i"
                },
                "status": "Pending",
            }
        }], function (err, found) {
            if (err || _.isEmpty(found)) {
                callback(err, null);
            } else {
                callback(null, found)
            }
        });
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
        // console.log("-----------", data);
        this.update({
            _id: {
                $in: data.data
            }
        }, {
            status: "Completed"
        }).exec(callback);
    },


    sendReminderMail: function (data, callback) {
        // console.log("1-----", data);
        Reminder.find({
            reminderMailSent: false
        }).exec(function (err, data) {
            if (err || _.isEmpty(data)) {} else {
                // console.log("2----", data);
                async.eachSeries(data, function (singelData, callback) {
                        // console.log("3----", singelData);
                        var reminderDate = moment(singelData.dateOfReminder);
                        var currentDate = moment(new Date());
                        // console.log("reminderDate", reminderDate, "currentDate", currentDate);
                        var day = reminderDate.diff(currentDate, "days");
                        if (singelData.email && day == 1) {
                            Reminder.update({
                                _id: singelData._id
                            }, {
                                reminderMailSent: true
                            }).exec(function (err, data3) {});

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
                            emailData.name = singelData.name ? singelData.name : "";
                            emailData.email = singelData.email;
                            emailData.greeting = greeting;
                            emailData.title = singelData.title ? singelData.title : "";
                            emailData.description = singelData.description ? singelData.description : "";
                            emailData.filename = "Reminder.ejs";
                            emailData.subject = "Reminder Notification";
                            Config.email(emailData, function (err, emailRespo) {
                                console.log("err", err);
                                console.log("emailRespo", emailRespo);
                                callback(null, emailRespo);
                            });
                        }
                    },
                    function (err, data2) {
                        if (err) {
                            callback("canNotSendMail", null);
                        } else {
                            callback(null, "mailSent");
                        }
                    });
            }
        });
    }


};
sails.on("ready", function () {
    cron.schedule('*/5 * * * *', function () {
        Reminder.sendReminderMail();
    });
});
module.exports = _.assign(module.exports, exports, model);