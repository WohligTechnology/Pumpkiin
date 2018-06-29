var schema = new Schema({
    ticketId: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket',
        index: true
    },
    assignedTo: String,
    assignedtoNumber: Number,
    contactPerson: String,
    contactNumber: Number,
    serviceCenter: {
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