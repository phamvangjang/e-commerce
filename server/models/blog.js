const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numberViews:{
        type:String,
        default:0
    },
    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref:'User'
        }
    ],
    dislikes: [
        {
            type: mongoose.Types.ObjectId,
            ref:'User'
        }
    ],
    image:{
        type: String,
        default: 'https://th.bing.com/th/id/OIP.Q95RFFlMIMZHuO9vKAyDrgAAAA?rs=1&pid=ImgDetMain'
    },
    author:{
        type: String,
        default: 'Admin'
    },
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);