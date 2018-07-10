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

    findReminderByUser: function (req, res) {
        if (req.body) {
            Reminder.findReminderByUser(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },
};
module.exports = _.assign(module.exports, controller);