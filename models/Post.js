var mongoose = require ("mongoose");
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    
    title : {
        type : String,
        required : true,
    },
    content : {
        type : String,
        required : true,
    },
    image : {
        type : String,
    },
    author : {
        type : Schema.Types.ObjectId,
        ref : "Users",
    },

    //for like array ထဲမှာ  like ပေးရင် array ထဲ ဝင်မယ် unlike array ထဲ ဖယ်မယ်

    like: [
        {
        user : {
            type : Schema.Types.ObjectId,
            ref : "Users",
            },
        },
    ],

    created : {
        type : Date,
        default : Date.now(),
    },
    updated : {
        type : Date,
        default : Date.now(),
    },
});


    

module.exports = mongoose.model("Posts",PostSchema);
