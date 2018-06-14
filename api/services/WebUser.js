var schema = new Schema({
    name: {
        type: String,

    },
    nickName: {
        type: String,

    },
    relation: {
        type: String,

    },

    member: [{
        memberId: {
            type: Schema.Types.ObjectId,
            ref: 'WebUser',
            index: true
        }
    }],
    lastname: {
        type: String,

    },
    otp: {
        type: String,

    },
    mobile: {
        type: Number,
        unique: true
    },
    email: {
        type: String
    }
});
schema.plugin(deepPopulate, {
    populate: {
        'member.memberId': {
            select: ''
        },

    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('WebUser', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "member.memberId", "member.memberId"));
var model = {
    
};
module.exports = _.assign(module.exports, exports, model);