var schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    description: String,
    // datefrom: Date,
    // dateTo: Date,
    // time: Date,
    dateOfReminder: Date,
    status: {
        type: String,
        enum: ['Completed', 'Pending', 'Snooze']
    },
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
    }

};
module.exports = _.assign(module.exports, exports, model);