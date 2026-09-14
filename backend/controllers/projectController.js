const Project = require("../models/project");
const Design = require("../models/design");
async function createProject(req, res) {
    try {
        const userId = req.user.userId;
        const name = req.body.name;
        const prompt = req.body.prompt;
        const code = req.body.code;
        const project = await Project.create({
            userId: userId,
            name: name,
            prompt: prompt,
            code: code
        });
        return res.status(201).json({
            message: "Project created successfully",
            project: project
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error creating project"
        });
    }
}
async function getProjects(req, res) {
    try {
        const userId = req.user.userId;
        const projects = await Project.find({
            userId: userId
        }).populate("selectedDesign");
        return res.status(200).json({
            message: "Projects fetched successfully",
            projects: projects
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error fetching projects"
        });
    }
}
async function getProjectById(req, res) {
    try {
        const id = req.params.id;
        const project = await Project
            .findOne({
                _id: id,
                userId: req.user.userId
            })
            .populate("selectedDesign");
        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }
        return res.status(200).json({
            message: "Project fetched successfully",
            project: project
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error fetching project"
        });
    }
}
async function deleteProject(req , res) {
    try {
        const projectId = req.params.id;
        const userId = req.user.userId;
        const project = await Project.findOne({
            _id : projectId,
            userId : userId
        });
        if (!project) {
            res.status(404).json({
                message : "Project is note found"
            });
        }
        if (project.selectedDesign) {

            await Design.findByIdAndDelete(
                project.selectedDesign
            );

        }
        await Project.findByIdAndDelete(projectId);
        res.status(200).json({
            message : "Project was deleted"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message : "Error in deleting project"
        });
    }
}
module.exports = { createProject , getProjectById , getProjects , deleteProject};