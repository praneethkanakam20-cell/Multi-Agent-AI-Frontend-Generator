

const savedDesignsContainer =
    document.getElementById("saved-designs");

const emptyState =
    document.getElementById("empty-state");

const savedCount =
    document.getElementById("saved-count");

const createDesignButton =
    document.getElementById("create-design");

const previewModal =
    document.getElementById("preview-modal");

const previewFrame =
    document.getElementById("preview-frame");

const previewTitle =
    document.getElementById("preview-title");

const closePreview =
    document.getElementById("close-preview");

const removePreview =
    document.getElementById("remove-preview");

const openCode =
    document.getElementById("open-code");

const logout =
    document.getElementById("logout");

const logoutModal =
    document.getElementById("logout-modal");

const cancelLogout =
    document.getElementById("cancel-logout");

const confirmLogout =
    document.getElementById("confirm-logout");

const headerAvatar =
    document.getElementById("header-avatar");


let selectedDesign = null;

// STORAGE KEY


const FAVOURITES_KEY = "favouriteDesigns";

// GET SAVED DESIGNS


function getSavedDesigns() {

    try {

        const data =
            localStorage.getItem(
                FAVOURITES_KEY
            );

        if (!data) {
            return [];
        }

        const designs = JSON.parse(data);

        return Array.isArray(designs)
            ? designs
            : [];

    } catch (error) {

        console.error(
            "Unable to read saved designs:",
            error
        );

        return [];

    }
}

// SAVE SAVED DESIGNS

function saveDesigns(designs) {

    localStorage.setItem(
        FAVOURITES_KEY,
        JSON.stringify(designs)
    );

}

// BUILD PREVIEW DOCUMENT
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

        ${css}

    </style>

</head>

<body>

    ${html}

    <script>

        try {

            ${safeJS}

        } catch(error) {

            console.error(error);

        }

    <\/script>

</body>

</html>
`;

}

// LOAD SAVED DESIGNS

function loadSavedDesigns() {

    const designs =
        getSavedDesigns();


    savedDesignsContainer.innerHTML = "";


    // Count
    savedCount.textContent =
        `${designs.length} ${
            designs.length === 1
                ? "saved design"
                : "saved designs"
        }`;


    // Empty state
    if (designs.length === 0) {

        emptyState.classList.remove(
            "hidden"
        );

        savedDesignsContainer.classList.add(
            "hidden"
        );

        return;

    }


    // Designs available
    emptyState.classList.add(
        "hidden"
    );

    savedDesignsContainer.classList.remove(
        "hidden"
    );


    designs.forEach(
        (design, index) => {

            const card =
                createDesignCard(
                    design,
                    index
                );

            savedDesignsContainer.appendChild(
                card
            );

        }
    );

}


// CREATE DESIGN CARD


function createDesignCard(
    design,
    index
) {

    const card =
        document.createElement("article");

    card.className =
        "design-card";

    const preview =
        document.createElement("div");

    preview.className =
        "design-preview";


    const iframe =
        document.createElement("iframe");

    iframe.className =
        "saved-preview-frame";

    iframe.setAttribute(
        "sandbox",
        "allow-scripts"
    );

    iframe.title =
        design.title ||
        `Saved Design ${index + 1}`;

    iframe.srcdoc =
        buildPreviewDocument(
            design
        );


    preview.appendChild(
        iframe
    );


    //BODY

    const body =
        document.createElement("div");

    body.className =
        "design-body";


    const number =
        document.createElement("div");

    number.className =
        "design-number";

    number.textContent =
        `DESIGN ${index + 1}`;


    const title =
        document.createElement("h2");

    title.className =
        "design-title";

    title.textContent =
        design.title ||
        `Saved Design ${index + 1}`;


    const description =
        document.createElement("p");

    description.className =
        "design-description";

    description.textContent =
        design.explanation ||
        design.description ||
        "Saved AI generated frontend design.";

    // ACTIONS

    const actions =
        document.createElement("div");

    actions.className =
        "design-actions";


    // Preview
    const previewButton =
        document.createElement("button");

    previewButton.className =
        "preview-btn";

    previewButton.innerHTML =
        '<i class="fa-solid fa-eye"></i> Preview';


    previewButton.addEventListener(
        "click",
        function () {

            openDesignPreview(
                design
            );

        }
    );


    // Remove
    const removeButton =
        document.createElement("button");

    removeButton.className =
        "remove-btn";

    removeButton.innerHTML =
        '<i class="fa-solid fa-trash"></i> Remove';


    removeButton.addEventListener(
        "click",
        function () {

            removeSavedDesign(
                design
            );

        }
    );


    actions.appendChild(
        previewButton
    );

    actions.appendChild(
        removeButton
    );


    body.appendChild(
        number
    );

    body.appendChild(
        title
    );

    body.appendChild(
        description
    );

    body.appendChild(
        actions
    );


    card.appendChild(
        preview
    );

    card.appendChild(
        body
    );


    return card;

}

// OPEN PREVIEW

function openDesignPreview(
    design
) {

    selectedDesign =
        design;


    previewTitle.textContent =
        design.title ||
        "Saved Design";


    previewFrame.innerHTML =
        "";


    const iframe =
        document.createElement("iframe");


    iframe.setAttribute(
        "sandbox",
        "allow-scripts"
    );


    iframe.srcdoc =
        buildPreviewDocument(
            design
        );


    previewFrame.appendChild(
        iframe
    );


    previewModal.classList.remove(
        "hidden"
    );

}



// CLOSE PREVIEW

function closePreviewModal() {

    previewModal.classList.add(
        "hidden"
    );

    previewFrame.innerHTML =
        "";

    selectedDesign =
        null;

}

// REMOVE SAVED DESIGN

function removeSavedDesign(
    design
) {

    const designs =
        getSavedDesigns();


    const filtered =
        designs.filter(
            function (item) {

                return !sameDesign(
                    item,
                    design
                );

            }
        );


    saveDesigns(
        filtered
    );


    if (
        selectedDesign &&
        sameDesign(
            selectedDesign,
            design
        )
    ) {

        closePreviewModal();

    }


    loadSavedDesigns();

}

// COMPARE DESIGNS
function sameDesign(
    first,
    second
) {

   
    if (
        first.favoriteKey &&
        second.favoriteKey
    ) {

        return (
            first.favoriteKey ===
            second.favoriteKey
        );

    }


    // Compare complete content
    if (
        first.html &&
        second.html &&
        first.css &&
        second.css
    ) {

        return (
            first.html === second.html &&
            first.css === second.css &&
            (
                first.javascript ||
                first.js ||
                ""
            ) ===
            (
                second.javascript ||
                second.js ||
                ""
            )
        );

    }


    // Fallback
    return (
        first.title ===
        second.title
    );

}

// VIEW CODE

openCode.addEventListener(
    "click",
    function () {

        if (!selectedDesign) {
            return;
        }


        // Store selected design
        localStorage.setItem(
            "selectedDesign",
            JSON.stringify(
                selectedDesign
            )
        );


        localStorage.setItem(
            "currentDesign",
            JSON.stringify(
                selectedDesign
            )
        );


       
        window.location.href =
            "../module4-code/code.html";

    }
);


// REMOVE FROM PREVIEW


removePreview.addEventListener(
    "click",
    function () {

        if (!selectedDesign) {
            return;
        }


        removeSavedDesign(
            selectedDesign
        );

    }
);

closePreview.addEventListener(
    "click",
    closePreviewModal
);


previewModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            previewModal
        ) {

            closePreviewModal();

        }

    }
);

// CREATE NEW DESIGN

createDesignButton.addEventListener(
    "click",
    function () {

        window.location.href =
            "../module2-generation/generate.html";

    }
);

// PROFILE AVATAR

// ======================================================
// PROFILE AVATAR
// ======================================================

function loadAvatar() {

    let user = {};

    try {

        user =
            JSON.parse(
                localStorage.getItem("currentUser")
            ) || {};

    } catch (error) {

        user = {};

    }

    const name =
        user.name ||
        "User";

    const headerAvatar =
        document.getElementById("header-avatar");

    if (headerAvatar) {

        headerAvatar.textContent =
            name.charAt(0).toUpperCase();

    }

}



// LOGOUT

logout.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        logoutModal.classList.remove(
            "hidden"
        );

    }
);


cancelLogout.addEventListener(
    "click",
    function () {

        logoutModal.classList.add(
            "hidden"
        );

    }
);


confirmLogout.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "isLoggedIn"
        );

        localStorage.removeItem(
            "currentUser"
        );

        localStorage.removeItem(
            "userToken"
        );


        // Saved designs are NOT deleted.

        window.location.href =
            "../module1-auth/login.html";

    }
);


logoutModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            logoutModal
        ) {

            logoutModal.classList.add(
                "hidden"
            );

        }

    }
);

// INITIAL LOAD

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadAvatar();

        loadSavedDesigns();

    }
);