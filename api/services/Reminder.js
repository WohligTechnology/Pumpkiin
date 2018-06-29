var schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    description: String,
    datefrom: Date,
    dateTo: Date,
    time: Date

});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Reminder', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);