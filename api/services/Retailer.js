var schema = new Schema({
    name: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String,
        default: ""
    },
    retailername: {
        type: String,
        default: ""
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Retailer', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    getAllRetailer: function (data, callback) {
        Retailer.find({}).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback("noDataound", null);
            } else {
                callback(null, found);
            }

        });
    }
};
module.exports = _.assign(module.exports, exports, model);