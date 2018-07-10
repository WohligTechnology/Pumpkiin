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
        enum: ['Completed', 'Pending']
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

    findReminderByUser: function (data, callback) {
        this.find({
            user: data.user,
            status: 'Pending'
        }).exec(callback);
    }

};
module.exports = _.assign(module.exports, exports, model);