var schema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    issueReported: {
        type: Date,
        default: Date.now()
    },
    ticketNumber: String,
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
            type: Date,
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

schema.plugin(deepPopulate, {
    populate: {
        product: {
            select: ""
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Ticket', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "product", "product"));
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

    findTicketOfUser: function (data, callback) {
        this.findOne({
            product: data.productId,
        }).deepPopulate('product').exec(callback);
    },

    createNewTicket: function (data, callback) {
        Ticket.findOne({
            product: data.product
        }).exec(function (err, data1) {
            if (_.isEmpty(data1)) {
                Ticket.TicketIdGenerate(function (err, data2) {
                    data.ticketNumber = data2;
                    console.log("data", data);
                    Ticket.saveData(data, callback);
                });
            } else {
                callback(err, data1);
            }
        })
    },

    TicketIdGenerate: function (callback) {
        Ticket.find({}).sort({
            createdAt: -1
        }).limit(1).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else {
                if (_.isEmpty(found)) {
                    var year = new Date().getFullYear().toString().substr(-2);
                    var month = new Date().getMonth() + 1;
                    var m = month.toString().length;
                    if (m == 1) {
                        month = "0" + month
                        var ticketNumber = "T" + year + month + "-" + "1";
                    } else if (m == 2) {
                        var ticketNumber = "T" + year + month + "-" + "1";
                    }
                    console.log("ticketNumber", ticketNumber)

                    callback(null, ticketNumber);
                } else {
                    if (!found[0].paymentId) {
                        var year = new Date().getFullYear().toString().substr(-2);
                        var month = new Date().getMonth() + 1;
                        var m = month.toString().length;
                        if (m == 1) {
                            month = "0" + month
                            var ticketNumber = "T" + year + month + "-" + "1";
                        } else if (m == 2) {
                            var ticketNumber = "T" + year + month + "-" + "1";
                        }
                        console.log("ticketNumber", ticketNumber)

                        callback(null, ticketNumber);
                    } else {
                        var paymentData = found[0].paymentId.split("-");
                        var num = parseInt(paymentData[1]);
                        var nextNum = num + 1;
                        var year = new Date().getFullYear().toString().substr(-2);
                        var month = new Date().getMonth() + 1;
                        var m = month.toString().length;
                        if (m == 1) {
                            month = "0" + month
                            var ticketNumber = "T" + year + month + "-" + nextNum;
                        } else if (m == 2) {
                            var ticketNumber = "T" + year + month + "-" + nextNum;
                        }
                        console.log("ticketNumber", ticketNumber)
                        callback(null, ticketNumber);
                    }
                }
            }
        });
    },
};
module.exports = _.assign(module.exports, exports, model);