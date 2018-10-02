module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    totalNumberOfReminders: function (req, res) {
        if (req.body) {
            Reminder.totalNumberOfReminders(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    totalNumberOfCompletedReminders: function (req, res) {
        if (req.body) {
            Reminder.totalNumberOfCompletedReminders(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },


    totalNumberOfPendingReminders: function (req, res) {
        if (req.body) {
            Reminder.totalNumberOfPendingReminders(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },


    findReminderOfPendingSnoozeByUser: function (req, res) {
        if (req.body) {
            Reminder.findReminderOfPendingSnoozeByUser(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    findReminderOfCompletedByUser: function (req, res) {
        if (req.body) {
            Reminder.findReminderOfCompletedByUser(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    reminderMail: function (req, res) {
        if (req.body) {
            Reminder.reminderMail(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    searchClosedReminders: function (req, res) {
        if (req.body) {
            Reminder.searchClosedReminders(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    searchOpenReminders: function (req, res) {
        if (req.body) {
            Reminder.searchOpenReminders(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    changeIsReadStatus: function (req, res) {
        if (req.body) {
            Reminder.changeIsReadStatus(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },
    deleteMultiple: function (req, res) {
        if (req.body) {
            Reminder.deleteMultiple(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },
    multiCompleted: function (req, res) {
        if (req.body) {
            Reminder.multiCompleted(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },
    sendReminderMail: function (req, res) {
        if (req.body) {
            Reminder.sendReminderMail(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    }
};
module.exports = _.assign(module.exports, controller);