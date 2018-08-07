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

    removeRelation: function (req, res) {
        if (req.body) {
            Product.removeRelation(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    productRegistrationMail: function (req, res) {
        if (req.body) {
            Product.productRegistrationMail(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    saveFinalProduct: function (req, res) {
        if (req.body) {
            Product.saveFinalProduct(req.body, res.callback);
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