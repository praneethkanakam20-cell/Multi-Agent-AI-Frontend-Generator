const Design = require("../models/design");
const mongoose = require("mongoose");
async function getDesigns(req , res){
    try {
        const designs = await Design.find();
        if (!designs){
            return res.status(404).json({
                message : "Designs are not found"
            });
        }
        return res.status(200).json({
            message : "Designs are fetched successfully",
            designs : designs
        });
    } catch (error){
        console.log(error.message);
        return res.status(500).json({
            message: "Error in the database operation"
        });
    }
}
async function getDesignsById(req , res){
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message : "Invalid id"
            });
        }
        const design = await Design.findById(id);
        if (!design){
            return res.status(404).json({
                message : "Design is not found"
            });
        }
        return res.status(200).json({
            message : "Design is fetched",
            design : design
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message : "Error in the database operation"
        });
    }
}
async function deleteDesign(req , res){
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message : "Invalid id"
            });
        }
        const design = await Design.findByIdAndDelete(id);
        if (!design){
            return res.status(404).json({
                message : "Design is not found"
            });
        }
        return res.status(200).json({
            message : "Design is deleted successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "Error in database operation"
        });   
    }
}
async function updateDesign(req , res){
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message : "INvalid id"
            });
        }
        const design = req.body;
        const updatedDesign = await Design.findByIdAndUpdate(
            id , design ,{ new : true}
        );
        if (!updatedDesign) {
            return res.status(404).json({
                message : "Design not found"
            });
        }
        return res.status(200).json({
            message : "Design is successfully updated"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "Error in the database operation"
        });
    }
}
module.exports = { getDesigns , getDesignsById , deleteDesign , updateDesign};