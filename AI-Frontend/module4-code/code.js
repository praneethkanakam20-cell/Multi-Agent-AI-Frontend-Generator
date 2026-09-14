/* =========================================================
   PROJECT / DESIGN DATA
========================================================= */

const API_URL =
    "http://localhost:3000/api";


let design = {

    _id: "",

    title: "Selected Design",

    code: {

        html: "",

        css: "",

        js: ""

    },

    explanation: {

        overallExplanation: "",

        htmlExplanation: "",

        cssExplanation: "",

        jsExplanation: ""

    },

    tag_explanation: {

        tags: []

    }

};


let currentProject = null;


/* =========================================================
   GET TOKEN
========================================================= */

function getToken() {

    return localStorage.getItem(
        "userToken"
    );

}


/* =========================================================
   GET PROJECT ID
========================================================= */

function getProjectId() {

    return localStorage.getItem(
        "currentProjectId"
    );

}


/* =========================================================
   ELEMENTS
========================================================= */

const designTitle =
    document.getElementById(
        "design-title"
    );


const preview =
    document.getElementById(
        "preview"
    );


const codeOutput =
    document.getElementById(
        "code-output"
    );


const explanation =
    document.getElementById(
        "explanation"
    );


const saveButton =
    document.getElementById(
        "save-button"
    );


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value || "")

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


/* =========================================================
   RETURN TO HISTORY
========================================================= */

const codeBack =
    document.getElementById(
        "code-back"
    );


if (codeBack) {

    codeBack.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            window.location.href = "../module3-gallery/history.html";

        }
    );

}


/* =========================================================
   CREATE PREVIEW DOCUMENT
========================================================= */

function createPreviewDocument(design) {

    const html =
        design?.code?.html ||
        design?.html ||
        "";

    const css =
        design?.code?.css ||
        design?.css ||
        "";

    const js =
        design?.code?.js ||
        design?.javascript ||
        "";


    return `
<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<style>

html,
body {

    margin: 0;

    padding: 0;

    width: 100%;

    min-height: 100%;

}

body {

    overflow-x: hidden;

    overflow-y: auto;

}

${css}

</style>

</head>

<body>

${html}

<script>

${js}

<\/script>

</body>

</html>
`;

}


/* =========================================================
   RENDER PREVIEW
========================================================= */

function renderPreview() {

    if (!preview) {
        return;
    }


    preview.innerHTML = "";


    const iframe =
        document.createElement(
            "iframe"
        );


    iframe.style.width =
        "100%";

    iframe.style.height =
        "100%";

    iframe.style.minHeight =
        "700px";

    iframe.style.border =
        "none";


    iframe.setAttribute(
        "sandbox",
        "allow-scripts"
    );


    iframe.setAttribute(
        "scrolling",
        "yes"
    );


    iframe.srcdoc =
        createPreviewDocument(
            design
        );


    preview.appendChild(
        iframe
    );

}


/* =========================================================
   SHOW CODE
========================================================= */

function showCode(type) {

    if (!codeOutput) {
        return;
    }


    if (type === "html") {

        codeOutput.textContent =
            design.code?.html || "";

    }

    else if (type === "css") {

        codeOutput.textContent =
            design.code?.css || "";

    }

    else if (
        type === "javascript" ||
        type === "js"
    ) {

        codeOutput.textContent =
            design.code?.js || "";

    }

}


/* =========================================================
   CODE TABS
========================================================= */

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
                            function(item) {

                                item.classList.remove(
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


/* =========================================================
   RENDER EXPLANATION
========================================================= */

function renderExplanation() {

    if (!explanation) {
        return;
    }


    const exp =
        design.explanation || {};


    const tagData =
        design.tag_explanation || {};


    const tags =
        Array.isArray(tagData.tags)
            ? tagData.tags
            : [];


    explanation.innerHTML = `

        <div class="explanation-item">

            <code>
                Overall Explanation
            </code>

            <p>
                ${escapeHTML(
                    exp.overallExplanation
                )}
            </p>

        </div>


        <div class="explanation-item">

            <code>
                HTML Explanation
            </code>

            <p>
                ${escapeHTML(
                    exp.htmlExplanation
                )}
            </p>

        </div>


        <div class="explanation-item">

            <code>
                CSS Explanation
            </code>

            <p>
                ${escapeHTML(
                    exp.cssExplanation
                )}
            </p>

        </div>


        <div class="explanation-item">

            <code>
                JavaScript Explanation
            </code>

            <p>
                ${escapeHTML(
                    exp.jsExplanation
                )}
            </p>

        </div>


        <div class="explanation-item">

            <code>
                Tags & Concepts
            </code>

            ${
                tags.length
                    ? tags.map(
                        function(tag) {

                            return `

                                <div>

                                    <strong>
                                        ${escapeHTML(
                                            tag.name
                                        )}
                                    </strong>

                                    <p>
                                        ${escapeHTML(
                                            tag.explanation
                                        )}
                                    </p>

                                </div>

                            `;

                        }
                    ).join("")
                    : `
                        <p>
                            No tag explanations available.
                        </p>
                    `
            }

        </div>

    `;

}


/* =========================================================
   LOAD PROJECT FROM DATABASE
========================================================= */

async function loadProject() {

    const token =
        getToken();


    const projectId =
        getProjectId();


    console.log(
        "Project ID:",
        projectId
    );


    if (!token) {

        alert(
            "Please login again."
        );

        return;

    }


    if (!projectId) {

        alert(
            "Project not selected."
        );

        return;

    }


    try {

        console.log(
            "Fetching project from database..."
        );


        const response =
            await fetch(
                `${API_URL}/projects/${projectId}`,
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        console.log(
            "Project response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to fetch project"
            );

        }


        currentProject =
            data.project;


        /*
           IMPORTANT

           Project contains:

           selectedDesign
        */

        const selectedDesign =
            currentProject?.selectedDesign;


        if (!selectedDesign) {

            throw new Error(
                "This project does not have a selected design."
            );

        }


        design =
            selectedDesign;


        console.log(
            "Selected design loaded:",
            design
        );


        /*
           Save locally as backup
        */

        localStorage.setItem(
            "selectedDesign",
            JSON.stringify(
                design
            )
        );


        localStorage.setItem(
            "selectedDesignId",
            String(
                design._id
            )
        );


        /*
           Title
        */

        if (designTitle) {

            designTitle.textContent =
                design.title ||
                currentProject.name ||
                "Selected Design";

        }


        /*
           Render everything
        */

        renderPreview();

        showCode("html");

        renderExplanation();


        /*
           Update favourite state
        */

        updateSaveButton();


    } catch (error) {

        console.error(
            "PROJECT LOAD ERROR:",
            error
        );


        if (preview) {

            preview.innerHTML = `

                <div
                    style="
                        padding:40px;
                        text-align:center;
                    "
                >

                    <h2>
                        Unable to load project
                    </h2>

                    <p>
                        ${escapeHTML(
                            error.message
                        )}
                    </p>

                </div>

            `;

        }

    }

}


/* =========================================================
   FAVOURITES
========================================================= */

function getFavourites() {

    try {

        return JSON.parse(

            localStorage.getItem(
                "favouriteDesigns"
            ) || "[]"

        );

    }

    catch (error) {

        return [];

    }

}


/* =========================================================
   FAVORITE KEY
========================================================= */

function getFavoriteKey() {

    return (

        design._id ||

        design.id ||

        `${getProjectId()}_selected`

    );

}


let favoriteKey =
    getFavoriteKey();


/* =========================================================
   CHECK SAVED
========================================================= */

function isSaved() {

    const favourites =
        getFavourites();


    return favourites.some(
        function(item) {

            return (
                item.favoriteKey ===
                favoriteKey
            );

        }
    );

}


/* =========================================================
   UPDATE SAVE BUTTON
========================================================= */

function updateSaveButton() {

    if (!saveButton) {
        return;
    }


    if (isSaved()) {

        saveButton.innerHTML = `

            <i class="fa-solid fa-heart"></i>

            Saved

        `;


        saveButton.classList.add(
            "saved"
        );

    }

    else {

        saveButton.innerHTML = `

            <i class="fa-solid fa-heart"></i>

            Save

        `;


        saveButton.classList.remove(
            "saved"
        );

    }

}


/* =========================================================
   SAVE / UNSAVE DESIGN
========================================================= */

if (saveButton) {

    saveButton.addEventListener(
        "click",
        function() {

            let favourites =
                getFavourites();


            const existingIndex =
                favourites.findIndex(
                    function(item) {

                        return (
                            item.favoriteKey ===
                            favoriteKey
                        );

                    }
                );


            /*
               REMOVE
            */

            if (
                existingIndex !== -1
            ) {

                favourites.splice(
                    existingIndex,
                    1
                );


                localStorage.setItem(
                    "favouriteDesigns",
                    JSON.stringify(
                        favourites
                    )
                );


                updateSaveButton();

                return;

            }


            /*
               ADD
            */

            const favouriteDesign = {

                ...design,

                favoriteKey:
                    favoriteKey,

                savedAt:
                    new Date().toISOString()

            };


            favourites.unshift(
                favouriteDesign
            );


            localStorage.setItem(
                "favouriteDesigns",
                JSON.stringify(
                    favourites
                )
            );


            updateSaveButton();

        }
    );

}


/* =========================================================
   START
========================================================= */

loadProject();