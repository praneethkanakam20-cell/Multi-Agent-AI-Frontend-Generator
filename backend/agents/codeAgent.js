const geminiClient = require("../services/geminiClient");

async function codeAgent(prompt, code) {

    // ==========================================
    // DETERMINE INPUT TYPE
    // ==========================================

    let userInput;


    // ==========================================
    // CASE 1: PROMPT + CODE
    // ==========================================

    if (prompt && code) {

        userInput = `
USER PROMPT:

${prompt}


EXISTING CODE:

HTML:
${code.html || "No HTML provided"}

CSS:
${code.css || "No CSS provided"}

JAVASCRIPT:
${code.js || "No JavaScript provided"}
`;

    }


    // ==========================================
    // CASE 2: PROMPT ONLY
    // ==========================================

    else if (prompt) {

        userInput = `
USER PROMPT:

${prompt}

No existing code was provided.

Create the frontend designs from scratch.
`;

    }


    // ==========================================
    // CASE 3: CODE ONLY
    // ==========================================

    else if (code) {

        userInput = `
No new user prompt was provided.

The user provided existing frontend code.

Create three improved and visually different
versions of the existing frontend.

Preserve the important existing functionality.

EXISTING CODE:

HTML:
${code.html || "No HTML provided"}

CSS:
${code.css || "No CSS provided"}

JAVASCRIPT:
${code.js || "No JavaScript provided"}
`;

    }


    // ==========================================
    // CASE 4: NOTHING PROVIDED
    // ==========================================

    else {

        throw new Error(
            "Prompt or code is required"
        );

    }


    // ==========================================
    // SYSTEM INSTRUCTION
    // ==========================================

    const systemPrompt = `

You are an expert frontend UI designer and developer
working inside a Multi-Agent Design System.


YOUR TASK:

Create exactly THREE different frontend UI designs.


INPUT TYPES:

The user can provide:

1. Only a prompt
2. Only existing frontend code
3. Both a prompt and existing frontend code


==========================================
PROMPT ONLY
==========================================

If only a prompt is provided:

- Understand the user's requirement.
- Create the frontend from scratch.
- Generate three different UI designs.
- Each design must satisfy the user's requirement.


==========================================
CODE ONLY
==========================================

If only existing code is provided:

- Understand the existing HTML.
- Understand the existing CSS.
- Understand the existing JavaScript.
- Improve the existing frontend.
- Create three visually different versions.
- Preserve useful existing functionality.
- Do not unnecessarily remove functionality.


==========================================
PROMPT + CODE
==========================================

If both prompt and code are provided:

- Understand the existing frontend first.
- Understand the user's requested modification.
- Modify the existing frontend according to the prompt.
- Apply the requested modification to all three designs.
- Preserve useful existing functionality.
- Create three visually different variations.


==========================================
DESIGN REQUIREMENTS
==========================================

Create exactly THREE designs.

The three designs must be visually different.

Choose styles that make sense for the user's requirement.

For example:

Design 1:
Modern / Minimal & attractive

Design 2:
Glassmorphism / Creative & Classic

Design 3:
Dark / Professional & Royal

These are examples only.
Choose suitable styles based on the user's requirement.


==========================================
HTML REQUIREMENTS
==========================================

Each design must contain complete HTML.

The HTML must be directly renderable
inside a browser.

Do not depend on a local HTML file.


==========================================
CSS REQUIREMENTS
==========================================

Each design must contain complete CSS.

All styling required by the design
must be included in the CSS field.

Do NOT depend on external CSS files.

Do NOT use:

<link rel="stylesheet" href="style.css">

Do not depend on a local CSS file.


==========================================
JAVASCRIPT REQUIREMENTS
==========================================

Each design must contain complete JavaScript.

JavaScript must work with the generated HTML.

Do not depend on a separate local JavaScript file.

Do not unnecessarily remove existing functionality
when existing code is provided.


==========================================
IMAGE REQUIREMENTS
==========================================

If the design requires images:

- Use publicly accessible HTTPS image URLs.
- Do not use local image paths.

Do NOT use:

images/photo.jpg

./images/photo.jpg

../images/photo.jpg

assets/image.png

Instead use publicly accessible HTTPS URLs.

The generated design must work when rendered
inside an iframe using srcdoc.


==========================================
LIVE PREVIEW REQUIREMENTS
==========================================

The generated HTML, CSS and JavaScript
will be combined by the frontend application.

Therefore:

HTML + CSS + JavaScript

must work together as one complete webpage.


==========================================
OUTPUT STRUCTURE
==========================================

Return exactly one JSON object.

The JSON object must contain:

{
    "designs": [
        {
            "id": "design1",
            "name": "Design name",
            "description": "Short description",
            "html": "complete HTML code",
            "css": "complete CSS code",
            "js": "complete JavaScript code"
        },
        {
            "id": "design2",
            "name": "Design name",
            "description": "Short description",
            "html": "complete HTML code",
            "css": "complete CSS code",
            "js": "complete JavaScript code"
        },
        {
            "id": "design3",
            "name": "Design name",
            "description": "Short description",
            "html": "complete HTML code",
            "css": "complete CSS code",
            "js": "complete JavaScript code"
        }
    ]
}


==========================================
IMPORTANT RULES
==========================================

1. Return exactly three designs.

2. Every design must contain:
   - id
   - name
   - description
   - html
   - css
   - js

3. Do not add any extra fields.

4. Do not return null values.

5. All values must be strings except the designs array.

6. HTML must be complete.

7. CSS must be complete.

8. JavaScript must be complete.

9. Do not return Markdown.

10. Do not use code fences.

11. Do not add explanations outside JSON.

12. Each design must be directly renderable in a browser.

13. CSS must correctly target the generated HTML.

14. JavaScript must correctly work with the generated HTML.

15. All three designs must be visually different.

16. If existing code is provided, preserve useful functionality.

17. If the user requests modifications, apply them to all three designs.

18. Do not use local CSS files.

19. Do not use local JavaScript files.

20. Do not use local image paths.

21. If images are required, use HTTPS image URLs.

22. Return valid JSON suitable for JSON.parse().

23. Escape characters correctly inside JSON strings.

24. Do not put comments or text outside the JSON object.

`;


    // ==========================================
    // GEMINI INPUT
    // ==========================================

    const inputText = `

${systemPrompt}


==========================================
USER INPUT
==========================================

${userInput}


==========================================

Generate exactly three frontend designs.

Return ONLY the JSON object.

`;


    // ==========================================
    // CALL GEMINI
    // ==========================================

    try {

        const code_response =
            await geminiClient.interactions.create({

                model: "gemini-3.5-flash",

                input: inputText,

                response_format: {

                    type: "text",

                    mime_type: "application/json",

                    schema: {

                        type: "object",

                        properties: {

                            designs: {

                                type: "array",

                                items: {

                                    type: "object",

                                    properties: {

                                        id: {
                                            type: "string"
                                        },

                                        name: {
                                            type: "string"
                                        },

                                        description: {
                                            type: "string"
                                        },

                                        html: {
                                            type: "string"
                                        },

                                        css: {
                                            type: "string"
                                        },

                                        js: {
                                            type: "string"
                                        }

                                    },

                                    required: [
                                        "id",
                                        "name",
                                        "description",
                                        "html",
                                        "css",
                                        "js"
                                    ],

                                    additionalProperties: false

                                }

                            }

                        },

                        required: [
                            "designs"
                        ],

                        additionalProperties: false

                    }

                }

            });


        // ==========================================
        // GET GEMINI RESPONSE
        // ==========================================

        const content =
            code_response.output_text;


        if (!content) {

            throw new Error(
                "Gemini returned an empty response"
            );

        }


        // ==========================================
        // LOG INFORMATION
        // ==========================================

        console.log(
            "\n========== CODE AGENT =========="
        );

        console.log(
            "API          : Gemini"
        );

        console.log(
            "Model        : gemini-3.5-flash"
        );


        // ==========================================
        // PARSE JSON
        // ==========================================

        const result =
            JSON.parse(content);


        console.log(
            "Designs      :",
            result.designs.length
        );

        console.log(
            "================================\n"
        );


        // ==========================================
        // RETURN RESULT
        // ==========================================

        return result;


    } catch (error) {

        console.log(
            "\n❌ Code Agent failed"
        );

        console.log(
            "Error:",
            error.message
        );


        throw new Error(
            `Code generation failed: ${error.message}`
        );

    }

}


module.exports = codeAgent;