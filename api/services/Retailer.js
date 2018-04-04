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
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Retailer', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);