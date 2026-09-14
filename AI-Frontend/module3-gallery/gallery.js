
let designs = [];
let currentResponse = null;

const responseData =
    localStorage.getItem("designResponse");

if (responseData) {
    try {
        currentResponse = JSON.parse(responseData);

        if (Array.isArray(currentResponse.designs)) {
            designs = currentResponse.designs.slice(0, 5);
        }

    } catch (error) {
        console.error("Unable to read design response:", error);
        designs = [];
    }
}


/*ELEMENTS */

const grid =
    document.getElementById("design-grid");

const designCount =
    document.getElementById("design-count");

const modal =
    document.getElementById("preview-modal");

const frame =
    document.getElementById("preview-frame");

const previewTitle =
    document.getElementById("preview-title");


/*DESIGN COUNT*/

designCount.textContent =
    designs.length + " Designs";


/*SESSION KEY*/

const sessionKey =
    currentResponse?.sessionId ||
    currentResponse?.generation_id ||
    currentResponse?.date ||
    "current";


function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/*BUILD COMPLETE PREVIEW*/

function buildPreviewDocument(design) {

    const html =
        design.html || "";

    const css =
        design.css || "";

    const javascript =
        design.javascript ||
        design.js ||
        "";

    const safeJS =
        javascript.replace(
            /<\/script/gi,
            "<\\/script"
        );




    if (/<html[\s>]/i.test(html)) {

        let page = html;

        if (css) {

            page = page.replace(
                /<\/head>/i,
                `<style>html,body{margin:0;padding:0;width:100%;min-height:100%;overflow-x:hidden;} ${css}</style></head>`
            );

        }

        if (javascript) {

            page = page.replace(
                /<\/body>/i,
                `<script>${safeJS}<\/script></body>`
            );

        }

        return page;
    }

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

        html, body { margin:0; padding:0; width:100%; min-height:100%; overflow-x:hidden; overflow-y:auto; }

        ${css}

    </style>

</head>

<body>

    ${html}

    <script>

        ${safeJS}

    <\/script>

</body>

</html>
`;
}

   /*CHECK IF DESIGN IS SAVED*/

function getFavourites() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "favouriteDesigns"
            ) || "[]"
        );

    } catch (error) {

        return [];

    }
}


function getFavoriteKey(design, index) {

    return (
        design.favoriteKey ||
        `${sessionKey}_${design.id ?? index}`
    );

}


function isDesignSaved(design, index) {

    const favourites =
        getFavourites();

    const key =
        getFavoriteKey(
            design,
            index
        );

    return favourites.some(
        function(item) {

            return (
                item.favoriteKey === key
            );

        }
    );

}


/*DISPLAY DESIGNS*/

function displayDesigns() {

    if (!grid) {
        console.error(
            "design-grid element not found"
        );
        return;
    }


    grid.innerHTML = "";


    if (designs.length === 0) {

        grid.innerHTML = `

            <div class="empty-state">

                <h2>No Designs Found</h2>

                <p>
                    Generate designs first.
                </p>

                <a href="../module2-generation/generate.html">
                    Generate Designs
                </a>

            </div>

        `;

        return;
    }


    designs.forEach(
        function(design, index) {

            const card =
                document.createElement("div");

            card.className =
                "design-card";


            const saved =
                isDesignSaved(
                    design,
                    index
                );


            card.innerHTML = `

                <!-- DESIGN PREVIEW -->

                <div class="design-preview">

                    <iframe
                        class="card-preview-frame"
                        title="${escapeHTML(
                            design.title ||
                            "Design Preview"
                        )}"
                        sandbox="allow-scripts"
                    ></iframe>

                </div>


                <!-- DESIGN INFORMATION -->

                <div class="design-info">

                    <h3>
                        ${escapeHTML(
                            design.title ||
                            `Design ${index + 1}`
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            design.description ||
                            "AI generated frontend design"
                        )}
                    </p>


                    <!-- ACTIONS -->

                    <div class="design-actions">

                        <button
                            class="preview-btn"
                            onclick="previewDesign(${index})"
                        >

                            <i class="fa-regular fa-eye"></i>

                            Preview

                        </button>


                        <button
                            class="select"
                            onclick="selectDesign(${index})"
                        >

                            Select

                        </button>


                        <button
                            class="save ${
                                saved ? "saved" : ""
                            }"
                            onclick="saveDesign(${index})"
                            title="${
                                saved
                                    ? "Remove from Favourites"
                                    : "Save to Favourites"
                            }"
                        >

                            <i class="${
                                saved
                                    ? "fa-solid"
                                    : "fa-regular"
                            } fa-heart"></i>

                        </button>

                    </div>

                </div>

            `;


            grid.appendChild(card);

            const previewFrame =
                card.querySelector(
                    ".card-preview-frame"
                );


            previewFrame.srcdoc =
                buildPreviewDocument(
                    design
                );

        }
    );

}


/*PREVIEW FULL DESIGN*/

function previewDesign(index) {

    const design =
        designs[index];

    if (!design) {
        return;
    }


    // Build complete website
    const previewHTML =
        buildPreviewDocument(
            design
        );


    // Put generated website inside iframe
    frame.srcdoc =
        previewHTML;


    // Show full-screen preview
    modal.classList.remove(
        "hidden"
    );


    // Prevent background page scrolling
    document.body.style.overflow =
        "hidden";

}


/*CLOSE PREVIEW */

function closePreview() {

    modal.classList.add(
        "hidden"
    );

    frame.srcdoc = "";

    // Restore gallery scrolling
    document.body.style.overflow =
        "";

}


/* CLOSE ON OUTSIDE CLICK */

modal.addEventListener(
    "click",
    function(event) {

        if (event.target === modal) {

            closePreview();

        }

    }
);


/*ESCAPE KEY*/

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closePreview();

        }

    }
);


/*SELECT DESIGN*/

async function selectDesign(index) {

    const design =
        designs[index];

    if (!design) {

        alert("Design not found.");

        return;

    }


    // ==========================================
    // JWT TOKEN
    // ==========================================

    const token =
        localStorage.getItem("userToken");


    if (!token) {

        alert("Please login first.");

        return;

    }


    // ==========================================
    // PROJECT ID
    // ==========================================

    const projectId =
        localStorage.getItem(
            "currentProjectId"
        );


    if (!projectId) {

        alert("Project ID is missing.");

        return;

    }


    try {

        console.log(
            "Selected design:",
            design
        );


        // ==========================================
        // SEND DESIGN TO BACKEND
        // ==========================================

        const response =
            await fetch(
                "http://localhost:3000/api/analyze",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify({

                            projectId:
                                projectId,

                            code: {

                                html:
                                    design.html || "",

                                css:
                                    design.css || "",

                                js:
                                    design.js || ""

                            }

                        })

                }
            );


        const data =
            await response.json();


        console.log(
            "Analyze response:",
            data
        );


        // ==========================================
        // BACKEND ERROR
        // ==========================================

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Design analysis failed."
            );

        }


        // ==========================================
        // SAVE SELECTED DESIGN LOCALLY
        // ==========================================

        localStorage.setItem(
            "selectedDesign",
            JSON.stringify(data.data)
        );

        localStorage.setItem(
            "currentDesign",
            JSON.stringify(data.data)
        );

        window.location.href =
            "../module4-code/code.html";


        // ==========================================
        // GO TO CODE / RESULT PAGE
        // ==========================================

        window.location.href =
            "../module4-code/code.html";


    } catch (error) {

        console.error(
            "Analyze error:",
            error
        );


        alert(
            error.message ||
            "Error analyzing selected design."
        );

    }

}


/* ========================================
   SAVE / REMOVE FAVOURITE
======================================== */

function saveDesign(index) {

    const design =
        designs[index];

    if (!design) {
        return;
    }


    let favourites =
        getFavourites();


    const favoriteKey =
        getFavoriteKey(
            design,
            index
        );


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

    if (existingIndex !== -1) {

        favourites.splice(
            existingIndex,
            1
        );

    }


    /*
       ADD
    */

    else {

        favourites.unshift({

            ...design,

            favoriteKey:
                favoriteKey,

            savedAt:
                new Date().toISOString()

        });

    }


    localStorage.setItem(
        "favouriteDesigns",
        JSON.stringify(
            favourites
        )
    );


    displayDesigns();

}

displayDesigns();