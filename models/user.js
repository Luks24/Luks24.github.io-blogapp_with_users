const mongoose               = require("mongoose"),
      passportLocalMongoose  =require("passport-local-mongoose");

//mongoose model config
const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});
//handels the user model
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);