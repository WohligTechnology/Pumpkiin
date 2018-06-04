var schema = new Schema({

    orderid: {
        type: Number,
    },
    issuereported: {
        type: Date,
    },
    ticketnumber: {
        type: Number,
    },
    status: {
        type: String,
    },
    substatus: {
        type: String,
    },
    elapsedtime: {
        type: String,
    },
    customercommunicationhistory: {
        type: String,
    },
    closuredate: {
        type: Date,
    },
    closurecommentpumpkin: {
        type: String,
    },
    rating: {
        type: String,
    },
    cost: {
        type: Number,
    },
    repairrecepit: [{
        recepit: String
    }]
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Ticket', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);