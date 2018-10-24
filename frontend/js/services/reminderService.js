myApp.service('reminderService', function (NavigationService) {


    // var presentUser = $.jStorage.get("userData");

    var reminderData = {};


    this.totalNumberOfReminders = function (callback) {
        reminderData.user = $.jStorage.get("userData")._id;
        NavigationService.apiCallWithData("Reminder/totalNumberOfReminders", reminderData, function (res) {
            if (res.value == true) {
                callback(res.data);
            }
        });
    };

    this.totalNumberOfCompletedReminders = function (callback) {
        reminderData.user = $.jStorage.get("userData")._id;
        NavigationService.apiCallWithData("Reminder/totalNumberOfCompletedReminders", reminderData, function (res) {
            if (res.value == true) {
                callback(res.data);
            }
        });
    };

    this.totalNumberOfPendingReminders = function (callback) {
        console.log("adadgsagsdasdg");
        reminderData.user = $.jStorage.get("userData")._id;
        NavigationService.apiCallWithData("Reminder/totalNumberOfPendingReminders", reminderData, function (res) {
            console.log("resss", res);

            callback(res);

        });
    };

    this.findReminderOfPendingSnoozeByUser = function (callback) {
        reminderData.user = $.jStorage.get("userData")._id;
        NavigationService.apiCallWithData("Reminder/findReminderOfPendingSnoozeByUser", reminderData, function (res) {
            if (res.value == true) {
                callback(res.data);
            }
        });
    };

    this.findReminderOfCompletedByUser = function (callback) {
        reminderData.user = $.jStorage.get("userData")._id;
        NavigationService.apiCallWithData("Reminder/findReminderOfCompletedByUser", reminderData, function (res) {
            if (res.value == true) {
                callback(res.data);
            }
        });
    };

})