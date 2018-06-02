var schema = new Schema({
    ticketid: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket'
    },
    statusfrom: {
        type: String,
    },
    statusto: {
        type: String,
    },
    timeinstatusfrom: {
        type: String,
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('StatusLogsTickets', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);