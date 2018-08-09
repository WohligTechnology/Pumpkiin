var schema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
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
        },
        pickUpDetails: Schema.Types.Mixed
    }],
    closureDate: Date,
    closureCommentPumpkin: String,
    closureCommentCustomer: String,
    rating: String,
    cost: Number,
    repairRecepit: [String],
    substat: [{
        statusDate: Date,
        status: String
    }]
});

schema.plugin(deepPopulate, {
    populate: {
        product: {
            select: ""
        },
        user: {
            select: ""
        },
        "product.brand": {
            select: ""
        },
        "product.user": {
            select: ""
        },
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Ticket', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "product product.brand product.user user", "product product.brand product.user user"));
var model = {

    totalNumberOfTickets: function (data, callback) {
        this.find({
            user: data.user
        }).count().exec(callback);
    },

    totalOpenTickets: function (data, callback) {
        this.find({
            user: data.user,
            status: "Active"
        }).deepPopulate('product product.brand product.user').exec(callback);
    },

    totalClosedTickets: function (data, callback) {
        this.find({
            user: data.user,
            status: "Closed"
        }).deepPopulate('product product.brand product.user').exec(callback);
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

    findActiveTicketOfUser: function (data, callback) {
        this.findOne({
            product: data.product,
            user: data.user,
            status: 'Active'
        }).deepPopulate('product product.brand product.user').exec(callback);
    },

    findClosedTicketOfUser: function (data, callback) {
        this.findOne({
            _id: data.ticketId,
            user: data.user,
        }).deepPopulate('product product.brand product.user').exec(callback);
    },


    createNewTicket: function (data, callback) {
        async.waterfall([
            function (callback) {
                Ticket.TicketIdGenerate(function (err, data2) {
                    data.ticketNumber = data2;
                    // console.log("data", data);
                    Ticket.saveData(data, function (err, data) {
                        sails.sockets.blast("ticketChat", {
                            ticketChatData: data
                        });
                        callback(err, data);
                    });
                });
            },
            function (finalData, callback) {
                var emailData = {};
                var time = new Date().getHours();
                var greeting;
                if (time < 10) {
                    greeting = "Good morning";
                } else if (time < 17) {
                    greeting = "Good Afternoon";
                } else {
                    greeting = "Good evening";
                }
                emailData.from = "sahil@pumpkiin.com";
                emailData.name = data.name;
                emailData.email = data.email;
                emailData.greeting = greeting;
                emailData.productName = data.productName;
                emailData.ticketID = finalData.ticketNumber;
                emailData.filename = "ticketcreation.ejs";
                emailData.subject = "Ticket Creation";
                // console.log("emailData", emailData);
                Config.email(emailData, function (err, emailRespo) {
                    // console.log("err", err);
                    // console.log("emailRespo", emailRespo);
                    callback(null, emailRespo);
                });
            }
        ], callback);
    },

    changeTicketStatus: function (data, callback) {
        async.waterfall([
            function (callback) {
                Ticket.saveData(data, callback);
            },
            function (ticketData, callback) {
                Ticket.findOne({
                    _id: data._id
                }).deepPopulate('user product').exec(callback);
            },
            function (finalData, callback) {
                var emailData = {};
                var time = new Date().getHours();
                var greeting;
                if (finalData.status == 'Active') {
                    if (time < 10) {
                        greeting = "Good morning";
                    } else if (time < 17) {
                        greeting = "Good Afternoon";
                    } else {
                        greeting = "Good evening";
                    }
                    emailData.from = "sahil@pumpkiin.com";
                    emailData.name = finalData.user.name;
                    emailData.email = finalData.user.email;
                    emailData.greeting = greeting;
                    emailData.productName = finalData.product.productName;
                    emailData.ticketID = finalData.ticketNumber;
                    emailData.statusMsg = finalData.subStatus;
                    emailData.filename = "Ticketstatus.ejs";
                    emailData.subject = "Ticket Status Changed";
                    // console.log("emailData", emailData);
                    Config.email(emailData, function (err, emailRespo) {
                        // console.log("err", err);
                        // console.log("emailRespo", emailRespo);
                        callback(null, emailRespo);
                    });
                } else {
                    if (time < 10) {
                        greeting = "Good morning";
                    } else if (time < 17) {
                        greeting = "Good Afternoon";
                    } else {
                        greeting = "Good evening";
                    }
                    emailData.from = "sahil@pumpkiin.com";
                    emailData.name = finalData.user.name;
                    emailData.email = finalData.user.email;
                    emailData.greeting = greeting;
                    emailData.ticketID = finalData.ticketNumber;
                    emailData.filename = "ticket-closure.ejs";
                    emailData.subject = "Ticket closure email";
                    // console.log("emailData", emailData);
                    Config.email(emailData, function (err, emailRespo) {
                        // console.log("err", err);
                        // console.log("emailRespo", emailRespo);
                        callback(null, emailRespo);
                    });
                }
            }
        ], callback);
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
                    // console.log("ticketNumber", ticketNumber)

                    callback(null, ticketNumber);
                } else {
                    var ticketNum = found[0].ticketNumber.split("-");
                    var num = parseInt(ticketNum[1]);
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
                    // console.log("ticketNumber", ticketNumber)
                    callback(null, ticketNumber);
                }
            }
        });
    },

    addToChat: function (data, callback) {
        async.waterfall([
            function (callback) {
                Ticket.saveData(data, callback);
            },
            function (newUserData, callback) {
                Ticket.findOne({
                    _id: data._id
                }).exec(function (err, data) {
                    sails.sockets.blast("ticketChat", {
                        ticketChatData: data
                    });
                    callback(err, data)
                })
            }
        ], callback);
    },

    getAllStatesOfIndia: function (data, callback) {
        var options = {
            method: 'GET',
            url: 'http://battuta.medunes.net/api/region/in/all/?key=9eccdee51d4fed50a9b3b56c7c2bbb26'
        };
        request(options, function (err, response, body) {
            // console.log("body", body);
            // console.log("------------", typeof (body));
            var myJSON = JSON.parse(body);
            callback(null, myJSON);
        });
    },

    getCity: function (data, callback) {
        var options = {
            method: 'GET',
            url: 'http://battuta.medunes.net/api/city/in/search/?region=' + data.region + '&key=9eccdee51d4fed50a9b3b56c7c2bbb26'
        };
        request(options, function (err, response, body) {
            // console.log("body", body);
            var myJSON = JSON.parse(body);
            callback(null, myJSON);
        });
    },

    //getAllTickets oF user For edit Product Page

    getAllTickets: function (data, callback) {
        this.find({
            user: data.user
        }).exec(callback);
    },

    searchClosedTickets: function (data, callback) {
        Ticket.aggregate([
            // Stage 1
            {
                $lookup: {
                    from: "products",
                    localField: "product",
                    foreignField: "_id",
                    as: "product"
                }
            },

            // Stage 2
            {
                $unwind: {
                    path: "$product",
                    preserveNullAndEmptyArrays: false // optional
                }
            },

            // Stage 3
            {
                $match: {
                    "product.productName": {
                        $regex: data.keyword,
                        $options: "i"
                    },
                    "status": "Closed",
                }
            },

        ], function (err, found) {
            if (err || _.isEmpty(found)) {
                callback(err, null);
            } else {
                callback(null, found)
            }
        });
    },

    searchOpenTickets: function (data, callback) {
        Ticket.aggregate([
            // Stage 1
            {
                $lookup: {
                    from: "products",
                    localField: "product",
                    foreignField: "_id",
                    as: "productss"
                }
            },

            // Stage 2
            {
                $unwind: {
                    path: "$productss",
                    preserveNullAndEmptyArrays: false // optional
                }
            },

            // Stage 3
            {
                $match: {
                    "productss.productName": {
                        $regex: data.keyword,
                        $options: "i"
                    },
                    "status": "Active",
                }
            },

        ], function (err, found) {
            if (err || _.isEmpty(found)) {
                callback(err, null);
            } else {
                callback(null, found)
            }
        });
    },

};
module.exports = _.assign(module.exports, exports, model);