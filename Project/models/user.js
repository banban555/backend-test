const mongoose = require('mongoose');

const user_schema = mongoose.Schema
(
    {
        name :
        {
            type:String,
            maxlength:50
        },
        password :
        {
            type:String,
            maxlength:10
        },
        token:
        {
            type:String
        },
        token_exp:
        {
            type: Number
        }
    }
);

const user = mongoose.model('user', user_schema);

module.exports = { user }