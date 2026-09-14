const geminiClient = require("../services/cerebrasClient");

async function tagAgent(code) {

    const prompt = `
You are an expert frontend developer.

Analyze this frontend code.

Identify important:

1. HTML tags
2. CSS properties
3. JavaScript concepts

For every important item, explain it simply.

Return ONLY valid JSON.

Required format:

{
    "tags": [
        {
            "name": "HTML tag or CSS property or JS concept",
            "explanation": "Simple explanation"
        }
    ]
}

Do not return Markdown.

HTML:
${code.html}

CSS:
${code.css}

JavaScript:
${code.js}
`;


    const tag_response =
        await geminiClient.interactions.create({

            model: "gemini-3.5-flash",

            input: prompt

        });


    const result =
        JSON.parse(tag_response.output_text);


    return result;
}


module.exports = tagAgent;