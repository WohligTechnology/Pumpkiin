sails.on("ready", function () {




    cron.schedule("*/5 * * * *", function () {
        Reminder.sendReminderOneDayEarlyReminders(function (err, data) {
            console.log("sendReminderOneDayEarlyReminders", err, data);
        });
        Reminder.sendReminderCurrentReminders(function (err, data) {
            console.log("sendReminderCurrentReminders", err, data);
        });
        Reminder.sendWarrantyReminderMail({});
        Reminder.sendInsuranceReminderMail({});
        console.log("===================================");
    });



});