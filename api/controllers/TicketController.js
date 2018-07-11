module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    totalNumberOfTickets: function (req, res) {
        if (req.body) {
            Ticket.totalNumberOfTickets(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    totalNumberOfOpenTickets: function (req, res) {
        if (req.body) {
            Ticket.totalNumberOfOpenTickets(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    totalNumberOfClosedTickets: function (req, res) {
        if (req.body) {
            Ticket.totalNumberOfClosedTickets(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    findAllTickteOfUser: function (req, res) {
        if (req.body) {
            Ticket.findAllTickteOfUser(req.body, res.callback);
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