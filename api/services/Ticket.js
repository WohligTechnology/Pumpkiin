var schema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    issueReported: Date,
    ticketNumber: Number,
    status: {
        type: String,
        enum: ["Closed", "Active"],
        default: "Active"
    },
    subStatus: String,
    elapsedTime: Date,
    customerCommunicationHistory: String,
    customerChat: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        comment: String,
        file: String,
        date: {
            type: String,
            default: Date.now()
        }
    }],
    closureDate: Date,
    closureCommentPumpkin: String,
    closureCommentCustomer: String,
    rating: String,
    cost: Number,
    repairRecepit: [String]
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Ticket', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    totalNumberOfTickets: function (data, callback) {
        this.find({
            user: data.user
        }).count().exec(callback);
    },

    totalNumberOfOpenTickets: function (data, callback) {
        this.find({
            user: data.user,
            status: "Active"
        }).count().exec(callback);
    },

    totalNumberOfClosedTickets: function (data, callback) {
        this.find({
            user: data.user,
            status: "Closed"
        }).count().exec(callback);
    },

    findAllTickteOfUser: function (data, callback) {
        this.find({
            product: data.productId,
        }).exec(callback);
    }
};
module.exports = _.assign(module.exports, exports, model);