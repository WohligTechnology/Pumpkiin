var schema = new Schema({
    ticketid: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket',
        index: true
    },
    assignedto: {
        type: String
    },
    number: {
        type: Number
    },
    contactperson: {
        type: String
    },
    contactnumber: {
        type: Number
    },
    servicecenter: {
        type: Schema.Types.ObjectId,
        ref: 'ServiceCenter',
        index: true
    },
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('PickUpService', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);