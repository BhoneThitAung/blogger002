var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require("bcryptjs"); //password encode package

var UserSchema = new Schema({

    name:{
        type: String,
        required : true,
    },
    email:{
        type: String,
        required : true,
    },
    password:{
        type: String,
        required : true,
    },

     //follow unfollow

    favoriteB :[
    {
      blogger :{
        type : Schema.Types.ObjectId,
        ref  : "Users",
      },
    },
   ],
});


//password encode start 

UserSchema.pre("save", function (next){
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8), null);
    next();
});


//compare
UserSchema.statics.compare = function (cleartext, encrypted){
    return bcrypt.compareSync(cleartext, encrypted);
};

//password encode end..


module.exports = mongoose.model("Users", UserSchema);