var schema = new Schema({
    orderId: Number,
    issueReported: Date,
    ticketNumber: Number,
    status: String,
    subStatus: String,

    elapsedTime: Date,
    customerCommunicationHistory: String,
    closureDate: Date,
    closureCommentPumpkin: String,
    closureCommentCustomer: String,
    rating: String,
    cost: Number,
    repairRecepit: [{
        String
    }]
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Ticket', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);