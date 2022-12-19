const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    avavatar: {
        type: String
    },
    date: {
        type: Date,
        defaut: Date.now
    }
});
module.exports = User = mongoose.model('user',UserSchema);