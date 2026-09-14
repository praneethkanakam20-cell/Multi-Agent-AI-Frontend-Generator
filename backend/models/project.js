const mongoose = require("mongoose");
const projectShcema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : "User",
        required : true
    },
    name : {
        type : String , 
        required : true
    },
    prompt : {
        type : String , 
    },
    code : {
        html : String , 
        css : String ,
        js : String 
    },
    selectedDesign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Design"
    }
}, { timestamps: true });
const Project = mongoose.model("Project" , projectShcema);
module.exports = Project;