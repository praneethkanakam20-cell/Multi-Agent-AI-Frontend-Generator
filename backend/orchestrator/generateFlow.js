const codeAgent = require("../agents/codeAgent");


async function generateFlow(prompt, code) {

    const designs = await codeAgent(prompt, code);

    return designs;

}


module.exports = generateFlow;