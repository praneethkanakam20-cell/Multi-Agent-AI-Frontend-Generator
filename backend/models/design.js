const mongoose = require("mongoose");
const designSchema = new mongoose.Schema({
    projectId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "Project",
        required : true
    },
    code : {
        html : {
            type : String ,
            required : true
        },
        css : {
            type : String , 
            required : true
        },
        js : {
            type : String , 
            required : true
        }
    },
    explanation : {
        overallExplanation : {
            type : String ,
            required : true
        },
        htmlExplanation : {
            type : String ,
            required : true
        },
        cssExplanation : {
            type : String ,
            required : true
        },
        jsExplanation : {
            type : String ,
            required : true
        }
    },
    tag_explanation : {
        tags : [{
            name : {
                type : String,
                required : true
            },
            explanation : {
                type : String ,
                required : true
            }
        }]
    }

})
const Design = mongoose.model("Design" , designSchema);
module.exports = Design;