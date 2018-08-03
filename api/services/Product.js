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

    productRegistrationMail: function (data, callback) {
        var emailData = {};
        emailData.from = "admin@clickmania.in";
        emailData.name = data.name;
        emailData.email = data.email;
        emailData.filename = "featuredpht.ejs";
        emailData.subject = "welcome to pumpkiin";
        Config.email(emailData, function (err, emailRespo) {
            if (err) {
                console.log(err);
                callback(err);
            } else if (emailRespo) {
                callback(null, emailRespo);
            } else {
                callback(null, "Invalid data");
            }
        });
    }

};
module.exports = _.assign(module.exports, exports, model);