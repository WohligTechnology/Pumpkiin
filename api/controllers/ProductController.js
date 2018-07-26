module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    saveProduct: function (req, res) {
        if (req.body) {
            Product.saveProduct(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    getAllProducts: function (req, res) {
        if (req.body) {
            Product.getAllProducts(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },
};
module.exports = _.assign(module.exports, controller);