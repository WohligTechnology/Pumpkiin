var schema = new Schema({
    ticketId: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket'
    },
    status: String,
    contactPerson: String,
    contactNumber: Number,
    date: Date,
    time: String
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('FollowUp', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);