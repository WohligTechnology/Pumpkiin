var schema = new Schema({
    ticketid: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket'
    },
    status: {
        type: String,
    },
    contactperson: {
        type: String
    },
    contactnumber: {
        type: Number
    },
    date: {
        type: Date
    },
    time: {
        type: String,
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('FollowUp', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);