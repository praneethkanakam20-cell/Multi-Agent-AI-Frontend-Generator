const explanationAgent = require("../agents/explanationAgent");
const tagAgent = require("../agents/tagAgent");
async function analyzeDesign(code){
    const [ explanation , tag_explanation ] = await Promise.all([ explanationAgent(code) , tagAgent(code)]);
    return {
        code : code,
        explanation : explanation,
        tag_explanation : tag_explanation
    };
}
module.exports = analyzeDesign;