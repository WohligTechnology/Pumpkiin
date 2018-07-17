myApp.service('reminderService', function (NavigationService) {


    var presentUser = $.jStorage.get("userData");

    var reminderData = {};
    reminderData.user = presentUser._id;

    this.totalNumberOfReminders = function (callback) {
        NavigationService.apiCallWithData("Reminder/totalNumberOfReminders", reminderData, function (res) {
            if (res.value == true) {
                callback(res.data);
            }
        });
    };

    this.totalNumberOfCompletedReminders = function (callback) {
        NavigationService.apiCallWithData("Reminder/totalNumberOfCompletedReminders", reminderData, function (res) {
            if (res.value == true) {
                callback(res.data);
            }
        });
    };

    this.totalNumberOfPendingReminders = function (callback) {
        NavigationService.apiCallWithData("Reminder/totalNumberOfPendingReminders", reminderData, function (res) {
            if (res.value == true) {
                callback(res.data);
            }
        });
    };

    this.findReminderOfPendingSnoozeByUser = function (callback) {
        NavigationService.apiCallWithData("Reminder/findReminderOfPendingSnoozeByUser", reminderData, function (res) {
            if (res.value == true) {
                callback(res.data);
            }
        });
    };

    this.findReminderOfCompletedByUser = function (callback) {
        NavigationService.apiCallWithData("Reminder/findReminderOfCompletedByUser", reminderData, function (res) {
            if (res.value == true) {
                callback(res.data);
            }
        });
    };

})