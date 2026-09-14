function validateGenerate(req , res , next){
    const prompt = req.body.prompt;
    const code = req.body.code;
    const projectId = req.body.projectId;
    if (!projectId) {
        return res.status(400).json({
            message: "Project ID is required"
        });
    }
    if (!prompt && !code){
        return res.status(400).json({
            message : "Prompt or code is required"
        });
    }
    if (prompt !== undefined && typeof prompt !== "string") {
        return res.status(400).json({
            message : "Prompt is invalid"
        });
    }
    if (prompt !== undefined && prompt.trim() === "") {
        return res.status(400).json({
            message : "Prompt cannot be empty"
        });
    }
    if (code !== undefined && typeof code !== "object") {
        return res.status(400).json({
            message : "Code must be an object"
        });
    }
    next();
}
module.exports = validateGenerate;
