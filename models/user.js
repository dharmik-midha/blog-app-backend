const mongoose = require('mongoose');
const uniqueValidaor = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

userSchema.plugin(uniqueValidaor);
module.exports = mongoose.model("user", userSchema);