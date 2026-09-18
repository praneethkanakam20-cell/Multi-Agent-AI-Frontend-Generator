const geminiClient = require("../services/geminiClient2");

async function explanationAgent(code) {

    const prompt = `
You are an expert frontend developer and teacher.

Analyze the following frontend code.

Provide a clear explanation of:

1. Overall purpose of the website
2. HTML structure
3. CSS design and styling
4. JavaScript functionality

Explain everything simply so that a beginner can understand it.

Return ONLY valid JSON in this format:

{
    "overallExplanation": "...",
    "htmlExplanation": "...",
    "cssExplanation": "...",
    "jsExplanation": "..."
}

Frontend HTML:
${code.html}

Frontend CSS:
${code.css}

Frontend JavaScript:
${code.js}
`;


    const explanation_response =
        await geminiClient.interactions.create({

            model: "gemini-3.5-flash",

            input: prompt

        });


    const result =
        JSON.parse(explanation_response.output_text);


    return result;
}


module.exports = explanationAgent;