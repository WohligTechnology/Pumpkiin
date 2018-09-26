var schema = new Schema({
    // brand: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Brand'
    // },
    brand: String,
    productName: String,
    serialNo: String,
    modelNo: String,
    retailer: String,
    // retailer: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Retailer'
    // },
    purchaseDate: Date,
    purchasePrice: Number,
    purchaseProof: [String],
    relatedUser: [{
        relationType: String,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }],

    warrantyPeriod: String,
    warrantyExpDate: Date,
    warrantyCardImage: [String],

    insurancePeriod: String,
    insuranceExpDate: Date,
    insuranceProofImage: [String],


    bill: Schema.Types.Mixed,
    confirmationCode: String,
    status: {
        type: String,
        enum: ['Pending', 'Confirmed'],
        default: 'Pending'
    },
    productImages: [String],
    localSupport: [{
        name: String,
        contact: Date,
        email: String
    }],
    warrentyStatus: String,
    document: [{
        name: String,
        doc: String
    }],
    invoiceImage: String,
    tags: String,
    type: {
        type: String,
        enum: ['Product', 'Accessory']
    },
    productAccessory: [String],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    category: String,
    warrantyProof: String,

    doneBy: {
        type: String,
        enum: ['Admin', 'User']
    },
    pendingRequest: {
        type: Boolean,
        default: false
    },
    isRead: {
        type: Boolean,
        default: false
    },
    productInvoicePR: String,
    warrantyCardPR: String,
    ticketGenerated: {
        type: Boolean,
        default: false
    }
});

schema.plugin(deepPopulate, {
    populate: {
        'retailer': {
            select: ''
        },
        'user': {
            select: ''
        },
        'relatedUser.user': {
            select: ''
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Product', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, " retailer user relatedUser.user", " retailer user relatedUser.user"));
var model = {

    saveProduct: function (data, callback) {
        console.log("----------------------------")
        console.log(data);
        Product.saveData(data, function (err, found) {
            if (err || _.isEmpty(found)) {
                callback(err, null);
            } else {
                callback(null, found);
            }
        });
    },

    getAllProducts: function (data, callback) {
        Product.find({
            status: 'Confirmed',
            user: data.user
        }, function (err, found) {
            if (err || _.isEmpty(found)) {
                callback(err, null);
            } else {
                callback(null, found);
            }
        });
    },

    removeRelation: function (data, callback) {
        Product.find({
            user: data.user
        }, function (err, found) {
            if (err || _.isEmpty(found)) {
                callback(err, null);
            } else {
                _.each(found, function (x) {
                    Product.findOneAndUpdate({
                        _id: x._id
                    }, {
                        relatedUser: data.relatedUsers
                    }).exec(function (err, found1) {
                        // callback(null, found1)
                    })
                })
                callback(null, found);
            }
        })
    },

    //mailer
    saveFinalProduct: function (data, callback) {
        var productdata = {};
        async.waterfall([
            function (callback) {
                Product.findOne({
                    _id: data._id
                }, function (err, found) {
                    if (err || _.isEmpty(found)) {
                        callback(err, null);
                    } else {
                        callback(null, found);
                    }
                });
            },
            function (productData, callback) {
                console.log("productData", productData)
                productdata = productData;
                var accessoriesToSave = {};
                accessoriesToSave._id = data._id;
                accessoriesToSave.productAccessory = data.productAccessory;
                accessoriesToSave.status = 'Confirmed';
                Product.saveData(accessoriesToSave, function (err, found) {
                    if (err || _.isEmpty(found)) {
                        callback(err, null);
                    } else {
                        callback(null, found);
                    }
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
                emailData.productName = productdata.productName;
                emailData.filename = "product-registration.ejs";
                emailData.subject = "New Product Registered";
                Config.email(emailData, function (err, emailRespo) {
                    callback(null, emailRespo);
                });
            }
        ], callback);
    },

    //searchApi

    getSearchProductAndBrand: function (data, callback) {
        Product.aggregate([
            // Stage 1
            {
                $lookup: {
                    from: "brands",
                    localField: "brand",
                    foreignField: "_id",
                    as: "brandss"
                }
            },

            // Stage 2
            {
                $unwind: {
                    path: "$brandss",
                    preserveNullAndEmptyArrays: false // optional
                }
            },

            // Stage 3
            {
                $match: {

                    $or: [{
                            "brandss.name": {
                                $regex: data.keyword,
                                $options: "i"
                            },
                        },
                        {
                            "productName": {
                                $regex: data.keyword,
                                $options: "i"
                            },
                        }
                    ],
                    "status": "Confirmed",
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

    //sorting brand and product
    /* sortProductsByBrands: function (data, callback) {
        Product.aggregate([
            // Stage 1
            {
                $match: {
                    "user": ObjectId(data.user),
                }
            },
            {
                $lookup: // Equality Match
                {
                    from: "brands",
                    localField: "brand",
                    foreignField: "_id",
                    as: "brands"
                }
            },

            // Stage 2
            {
                $unwind: {
                    path: "$brands",
                    preserveNullAndEmptyArrays: false // optional
                }
            },

            // Stage 3
            {
                $project: {
                    brandName: "$brands.name",
                    _id: "$_id",
                    productName: "$productName",
                    brand: "$brand",
                    serialNo: "$serialNo",
                    modelNo: "$modelNo",
                    user: "$user",
                    pendingRequest: "$pendingRequest",
                    productAccessory: "$productAccessory",
                    productImages: "$productImages",
                    status: "$status",
                    insuranceProofImage: "$insuranceProofImage",
                    warrantyCardImage: "$warrantyCardImage",
                    relatedUser: "$relatedUser",
                    purchaseProof: "$purchaseProof",
                    retailer: "$retailer",
                    purchasePrice: "$purchasePrice",
                    purchaseDate: "$purchaseDate",
                    insuranceExpDate: "$insuranceExpDate",
                    warrantyExpDate: "$warrantyExpDate"
                }
            },

            // Stage 4
            {
                $sort: {
                    "brandName": 1

                }
            }
        ], function (err, found) {
            if (err || _.isEmpty(found)) {
                callback(err, null);
            } else {
                callback(null, found);
            }
        });

    }, */



    /* sortFunction1: function (data, callback) {
        var Model = this;
        var Const = this(data);
        var maxRow = Config.maxRow;

        var page = 1;
        if (data.page) {
            page = data.page;
        }
        var field = data.field;




        var options = {
            field: data.field,
            filters: {
                keyword: {
                    fields: ['name'],
                    term: data.keyword
                }
            },
            sort: {
                asc: 'productName'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };

        console.log("sortFunction", data);
        var name = data.name;
        console.log("nmae ", name);
        Product.find({
                user: data.user,
                status: 'Confirmed'
            }).order(options)
            .keyword(options)
            .page(options, callback);
    }, */

    sortFunction: function (data, callback) {

        console.log("sortFunction", data);
        var name = data.name;
        console.log("name ", name);
        Product.find({
            user: data.user,
            status: 'Confirmed'
        }).sort({
            [name]: 1
        }).exec(callback)
    },


    sortByProducts: function (data, callback) {
        Product.find({
            status: 'Confirmed',
            user: data.user
        }).sort({
            productName: 1
        }).exec(callback);
    },

    excelProductList: function (data, callback) {
        Product.find({
            status: 'Confirmed',
            user: data
        }, function (err, found) {
            if (err || _.isEmpty(found)) {
                callback(err, null);
            } else {
                callback(null, found);
            }
        });
    },

    generateExcelforProduct: function (match, callback) {
        // console.log("match", match)
        async.concatSeries(match, function (mainData, callback) {
                var obj = {};
                obj["Product Name"] = mainData.productName;
                obj["Serial No"] = mainData.serialNo;
                obj["Model No"] = mainData.modelNo;
                obj["Retailer"] = mainData.retailer;
                obj["Model No"] = mainData.modelNo;
                obj["Purchase Price"] = mainData.purchasePrice;
                obj["Model No"] = mainData.modelNo;
                callback(null, obj);
            },
            function (err, singleData) {
                callback(null, singleData);
            });
    },

    ticketNotGenerated: function (data, callback) {
        Product.find({
            user: data.user,
            ticketGenerated: false,
            status: "Confirmed"
        }).sort({
            productName: 1
        }).exec(callback);

    },

    changeIsReadStatus: function (data, callback) {
        console.log("-----------", data);
        this.findOneAndUpdate({
            _id: data.id
        }, {
            isRead: data.isRead
        }, {
            new: true
        }).exec(callback);
    }


};
module.exports = _.assign(module.exports, exports, model);