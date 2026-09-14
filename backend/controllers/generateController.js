const generateFlow = require("../orchestrator/generateFlow");
const analyzeDesign = require("../orchestrator/analyzeDesign");
const Design = require("../models/design");
const Project = require("../models/project");
async function validation(req , res ){
    try {
        const projectId = req.body.projectId;
        const prompt = req.body.prompt;
        const code = req.body.code;
        const project = await Project.findOne({
            _id: projectId,
            userId: req.user.userId
        });
        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }
        const data = await generateFlow(prompt ,code);
        return res.status(200).json({
            message : "Three designs are generated",
            projectId : projectId,
            designs : data.designs
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "Error in backend or in the generation"
        });
    }
}
async function selectedDesign(req , res) {
    try {
        const code = req.body.code;
        const projectId = req.body.projectId;
        const project = await Project.findOne({
            _id: projectId,
            userId: req.user.userId
        });
        if (!project) {
            return res.status(404).json({
                message : "Project not found"
            });
        }
        const result = await analyzeDesign(code);
        console.log("🔥 ANALYZE RESULT:");
        console.log(JSON.stringify(result, null, 2));
        const savedDesign = await Design.create({
            projectId : projectId,
            code : result.code,
            explanation : result.explanation,
            tag_explanation : result.tag_explanation
        });
        console.log("DESIGN SAVED:", savedDesign);
        await Project.findByIdAndUpdate(
            projectId , {
                selectedDesign : savedDesign._id
            }
        );
        console.log(
            "PROJECT UPDATED WITH DESIGN:",
            savedDesign._id
        );
        return res.status(200).json({
            message : "generated design successfully",
            data : savedDesign
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "Error in the backend or in the generation"
        });
    }
}
module.exports = {validation , selectedDesign };