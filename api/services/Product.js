var schema = new Schema({
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand'
    },
    productName: String,
    serialNo: Number,
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
    productInvoicePR: String,
    warrantyCardPR: String,
});

schema.plugin(deepPopulate, {
    populate: {
        'brand': {
            select: ''
        },
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

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "brand retailer user relatedUser.user", "brand retailer user relatedUser.user"));
var model = {

    saveProduct: function (data, callback) {
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
                // console.log("productData", productData)
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


};
module.exports = _.assign(module.exports, exports, model);