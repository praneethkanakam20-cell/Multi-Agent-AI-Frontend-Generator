/* =========================================
   GET PROJECT DATA
========================================= */

const projectData =
    localStorage.getItem(
        "currentProject"
    );


const designData =
    localStorage.getItem(
        "currentDesign"
    );


console.log(
    "🔥 HISTORY DESIGN PAGE"
);


console.log(
    "🔥 PROJECT DATA EXISTS:",
    !!projectData
);


console.log(
    "🔥 DESIGN DATA EXISTS:",
    !!designData
);



/* =========================================
   CHECK DATA
========================================= */

if (!projectData || !designData) {

    document.body.innerHTML = `

        <div style="
            min-height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            background:#0b0f18;
            color:white;
            font-family:Arial,sans-serif;
        ">

            <div style="
                text-align:center;
            ">

                <h2>
                    No project data found
                </h2>

                <button
                    onclick="history.back()"
                    style="
                        padding:12px 22px;
                        cursor:pointer;
                    "
                >
                    Go Back
                </button>

            </div>

        </div>

    `;


    throw new Error(
        "Project/design data missing"
    );

}



/* =========================================
   PARSE DATA
========================================= */

let project;
let design;


try {

    project =
        JSON.parse(
            projectData
        );


    design =
        JSON.parse(
            designData
        );

}

catch (error) {

    console.error(
        "❌ LOCAL STORAGE PARSE ERROR:",
        error
    );

    document.body.innerHTML = `

        <div style="
            padding:40px;
            text-align:center;
        ">

            <h2>
                Invalid project data
            </h2>

            <button
                onclick="history.back()"
            >
                Go Back
            </button>

        </div>

    `;


    throw error;

}



console.log(
    "🔥 PROJECT:",
    project
);


console.log(
    "🔥 DESIGN:",
    design
);



/* =========================================
   PROJECT TITLE
========================================= */

const projectTitle =
    document.getElementById(
        "project-title"
    );


if (projectTitle) {

    projectTitle.textContent =
        project.name ||
        "Project";

}



/* =========================================
   GET CODE
========================================= */

const code =
    design.code || {};


const html =
    code.html || "";


const css =
    code.css || "";


const js =
    code.js || "";


console.log(
    "🔥 HTML LENGTH:",
    html.length
);


console.log(
    "🔥 CSS LENGTH:",
    css.length
);


console.log(
    "🔥 JS LENGTH:",
    js.length
);



/* =========================================
   CREATE LIVE PREVIEW
========================================= */

function createPreviewDocument() {

    return `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<style>

${css}


/* Prevent text selection */

* {
    user-select: none;
}

</style>

</head>


<body>

${html}


<script>

${js}

/*
=========================================
DISABLE USER INTERACTION
=========================================
*/

document.addEventListener(
    "click",
    function(event) {

        event.preventDefault();

        event.stopPropagation();

    },
    true
);


document.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        event.stopPropagation();

    },
    true
);


document.addEventListener(
    "keydown",
    function(event) {

        event.preventDefault();

    },
    true
);

<\/script>


</body>

</html>

    `;

}



/* =========================================
   SMALL LIVE PREVIEW
========================================= */

const iframe =
    document.getElementById(
        "live-preview"
    );


if (iframe) {

    iframe.srcdoc =
        createPreviewDocument();

}



/* =========================================
   CODE OUTPUT
========================================= */

const codeOutput =
    document.getElementById(
        "code-output"
    );



function showCode(type) {

    if (!codeOutput) {

        return;

    }


    if (type === "html") {

        codeOutput.textContent =
            html;

    }

    else if (type === "css") {

        codeOutput.textContent =
            css;

    }

    else if (type === "js") {

        codeOutput.textContent =
            js;

    }

}



/* =========================================
   DEFAULT HTML
========================================= */

showCode(
    "html"
);



/* =========================================
   CODE TABS
========================================= */

document
    .querySelectorAll(
        ".code-tabs button"
    )
    .forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {


                    document
                        .querySelectorAll(
                            ".code-tabs button"
                        )
                        .forEach(
                            function(btn) {

                                btn.classList.remove(
                                    "active"
                                );

                            }
                        );


                    button.classList.add(
                        "active"
                    );


                    showCode(
                        button.dataset.code
                    );

                }
            );

        }
    );



/* =========================================
   EXPLANATION
========================================= */

const explanation =
    design.explanation || {};


const explanationContainer =
    document.getElementById(
        "explanation"
    );


if (explanationContainer) {

    explanationContainer.innerHTML = `

        <div class="explanation-card">

            <h3>
                Overall Explanation
            </h3>

            <p>
                ${escapeHTML(
                    explanation.overallExplanation
                )}
            </p>

        </div>


        <div class="explanation-card">

            <h3>
                HTML Explanation
            </h3>

            <p>
                ${escapeHTML(
                    explanation.htmlExplanation
                )}
            </p>

        </div>


        <div class="explanation-card">

            <h3>
                CSS Explanation
            </h3>

            <p>
                ${escapeHTML(
                    explanation.cssExplanation
                )}
            </p>

        </div>


        <div class="explanation-card">

            <h3>
                JavaScript Explanation
            </h3>

            <p>
                ${escapeHTML(
                    explanation.jsExplanation
                )}
            </p>

        </div>

    `;

}



/* =========================================
   TAG EXPLANATION
========================================= */

const tags =
    design.tag_explanation?.tags || [];


const tagContainer =
    document.getElementById(
        "tag-explanation"
    );


if (tagContainer) {


    if (tags.length === 0) {

        tagContainer.innerHTML = `

            <p>
                No tag explanations available.
            </p>

        `;

    }

    else {

        tagContainer.innerHTML =
            tags
                .map(
                    function(tag) {

                        return `

                            <div class="tag-card">

                                <h3>
                                    ${escapeHTML(
                                        tag.name
                                    )}
                                </h3>

                                <p>
                                    ${escapeHTML(
                                        tag.explanation
                                    )}
                                </p>

                            </div>

                        `;

                    }
                )
                .join("");

    }

}



/* =========================================
   FULL SCREEN PREVIEW
========================================= */

const openPreview =
    document.getElementById(
        "open-preview"
    );


const fullscreenPreview =
    document.getElementById(
        "fullscreen-preview"
    );


const fullscreenFrame =
    document.getElementById(
        "fullscreen-preview-frame"
    );


const closePreview =
    document.getElementById(
        "close-preview"
    );



/* =========================================
   OPEN FULL SCREEN
========================================= */

if (
    openPreview &&
    fullscreenPreview &&
    fullscreenFrame
) {

    openPreview.addEventListener(
        "click",
        function() {

            console.log(
                "🔥 FULLSCREEN PREVIEW OPENED"
            );


            fullscreenFrame.srcdoc =
                createPreviewDocument();


            fullscreenPreview.classList.add(
                "active"
            );


            document.body.style.overflow =
                "hidden";

        }
    );

}



/* =========================================
   CLOSE FULL SCREEN
========================================= */

if (
    closePreview &&
    fullscreenPreview
) {

    closePreview.addEventListener(
        "click",
        function() {

            console.log(
                "🔥 FULLSCREEN PREVIEW CLOSED"
            );


            fullscreenPreview.classList.remove(
                "active"
            );


            document.body.style.overflow =
                "";

        }
    );

}



/* =========================================
   BACK BUTTON
========================================= */

const backButton =
    document.getElementById(
        "back-button"
    );


if (backButton) {

    backButton.addEventListener(
        "click",
        function() {

            history.back();

        }
    );

}



/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(
        value || ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}