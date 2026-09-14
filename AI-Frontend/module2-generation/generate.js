
// AI FRONTEND - GENERATE

const API_URL = "http://localhost:3000/api";

// GENERATE ELEMENTS

const modeButtons =
    document.querySelectorAll(".mode-tab");

const userInputElement =
    document.getElementById("generation-input");

const inputTitle =
    document.getElementById("input-label");

const countElement =
    document.getElementById("char-count");

const generateButton =
    document.getElementById("generate-btn");

const loadingElement =
    document.getElementById("loading-container");


// CURRENT MODE

let currentMode = "prompt";


// VIEW ELEMENTS


const dashboardView =
    document.getElementById("dashboard-view");

const generateView =
    document.getElementById("generate-view");

const savedView =
    document.getElementById("saved-view");

const historyView =
    document.getElementById("history-view");

const settingsView =
    document.getElementById("settings-view");

const profileView =
    document.getElementById("profile-view");

const headerTitle =
    document.getElementById("header-title");



// SIDEBAR ELEMENTS


const dashboardLink =
    document.getElementById("dashboard-link");

const savedLink =
    document.getElementById("saved-link");

const historyLink =
    document.getElementById("history-link");

const settingsLink =
    document.getElementById("settings-link");

const profileLink =
    document.getElementById("profile-link");

const logoutLink =
    document.getElementById("logout");


// MODE SWITCHING


// MODE SWITCHING


let promptText = "";
let codeText = "";

modeButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Save current text before switching
        if (currentMode === "prompt") {

            promptText =
                userInputElement.value;

        } else {

            codeText =
                userInputElement.value;

        }


        modeButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        currentMode =
            button.dataset.mode;


        // Load only that mode's text
        if (currentMode === "prompt") {

            inputTitle.textContent =
                "Describe your website";

            userInputElement.placeholder =
                "Example: Create a modern student portfolio website with projects, skills, education and contact sections...";

            userInputElement.value =
                promptText;

        } else {

            inputTitle.textContent =
                "Enter your half code";

            userInputElement.placeholder =
                "Paste your HTML/CSS/JavaScript code here and AI will create frontend variations...";

            userInputElement.value =
                codeText;

        }


        countElement.textContent =
            `${userInputElement.value.length} / 2000`;

    });

});



// CHARACTER COUNTER

userInputElement.addEventListener(
    "input",
    () => {

        if (currentMode === "prompt") {

            promptText =
                userInputElement.value;

        } else {

            codeText =
                userInputElement.value;

        }


        countElement.textContent =
            `${userInputElement.value.length} / 2000`;

    }
);

// GENERATE BUTTON


if (generateButton) {

    generateButton.addEventListener(
        "click",
        generateDesigns
    );

}



// GENERATE DESIGNS
function getToken() {
    return localStorage.getItem("userToken");
}

async function generateDesigns() {

    console.log("Generate button clicked!");

    const token = getToken();

    if (!token) {
        alert("Please login first.");
        return;
    }

    // Get user input from the textarea
    const userInput = userInputElement.value.trim();

    if (!userInput) {
        alert(
            currentMode === "prompt"
                ? "Please enter a prompt."
                : "Please enter your code."
        );

        userInputElement.focus();

        return;
    }

    // Disable button while generating
    generateButton.disabled = true;
    generateButton.style.opacity = "0.6";

    loadingElement.classList.remove("hidden");

    try {

        // =====================================================
        // KEEP PROMPT AND CODE SEPARATE
        // =====================================================

        let prompt = "";
        let code = {};

        if (currentMode === "prompt") {

            prompt = userInput;

            code = {};

            console.log("PROMPT MODE");
            console.log("Prompt:", prompt);

        } else {

            prompt = "";

            code = {
                html: userInput,
                css: "",
                js: ""
            };

            console.log("CODE MODE");
            console.log("Code:", code);
        }


        // =====================================================
        // CREATE A NEW PROJECT FOR EVERY GENERATION
        // =====================================================

        console.log("Creating new project...");

        const projectResponse = await fetch(
            `${API_URL}/projects`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({

                    name:
                        currentMode === "prompt"
                            ? prompt.substring(0, 50) || "AI Project"
                            : "AI Code Project",

                    prompt: prompt,

                    code: code

                })
            }
        );


        const projectData =
            await projectResponse.json();


        console.log(
            "Project creation response:",
            projectData
        );


        if (!projectResponse.ok) {

            throw new Error(
                projectData.message ||
                "Failed to create project"
            );

        }


        // =====================================================
        // GET NEW PROJECT ID
        // =====================================================

        const projectId =
            projectData.project._id;


        console.log(
            "NEW PROJECT CREATED:",
            projectId
        );


        // Save latest project ID
        currentProjectId =
            projectId;


        localStorage.setItem(
            "currentProjectId",
            projectId
        );


        // =====================================================
        // GENERATE 3 DESIGNS
        // =====================================================

        console.log(
            "Starting design generation..."
        );


        const generateResponse =
            await fetch(
                `${API_URL}/generate`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        projectId:
                            projectId,

                        prompt:
                            prompt,

                        code:
                            code

                    })
                }
            );


        const generateData =
            await generateResponse.json();


        console.log(
            "Generation response:",
            generateData
        );


        if (!generateResponse.ok) {

            throw new Error(
                generateData.message ||
                "Design generation failed"
            );

        }


        // =====================================================
        // CHECK DESIGNS
        // =====================================================

        if (
            !generateData.designs ||
            !Array.isArray(generateData.designs) ||
            generateData.designs.length === 0
        ) {

            throw new Error(
                "No designs were generated."
            );

        }


        console.log(
            "DESIGNS GENERATED:",
            generateData.designs
        );


        // =====================================================
        // SAVE GENERATION RESPONSE
        // =====================================================

        localStorage.setItem(
            "designResponse",
            JSON.stringify(generateData)
        );


        // Save the project ID separately
        localStorage.setItem(
            "generatedProjectId",
            projectId
        );


        // =====================================================
        // GO TO GALLERY
        // =====================================================

        window.location.href =
            "../module3-gallery/gallery.html";


    } catch (error) {

        console.error(
            "GENERATION ERROR:",
            error
        );


        alert(
            error.message ||
            "Something went wrong while generating designs."
        );


    } finally {

        // Enable button again
        generateButton.disabled = false;

        generateButton.style.opacity = "1";

        loadingElement.classList.add("hidden");

    }

}

// VIEW MANAGEMENT


function hideAllViews() {

    dashboardView.classList.add("hidden");

    generateView.classList.add("hidden");

    savedView.classList.add("hidden");

    historyView.classList.add("hidden");

    settingsView.classList.add("hidden");

    profileView.classList.add("hidden");

}

// SIDEBAR ACTIVE


function clearSidebarActive() {

    document
        .querySelectorAll(".sidebar nav a")
        .forEach(link => {

            link.classList.remove("active");

        });

}


function setActive(link) {

    clearSidebarActive();

    link.classList.add("active");

}


// DASHBOARD

function showDashboard() {

    hideAllViews();

    dashboardView.classList.remove("hidden");

    setActive(dashboardLink);

    headerTitle.textContent =
        "Dashboard";

    updateDashboardStats();

}

// GENERATE VIEW

function showGenerate() {

    hideAllViews();

    generateView.classList.remove("hidden");

    headerTitle.textContent =
        "Generate Design";

}


// SAVED DESIGNS


function showSavedDesigns() {

    hideAllViews();

    savedView.classList.remove("hidden");

    setActive(savedLink);

    headerTitle.textContent =
        "Saved Designs";

    loadSavedDesigns();

}

// HISTORY

function showHistory() {

    hideAllViews();

    historyView.classList.remove("hidden");

    setActive(historyLink);

    headerTitle.textContent =
        "Generation History";

    loadHistory();

}

// SETTINGS

function showSettings() {

    hideAllViews();

    settingsView.classList.remove("hidden");

    setActive(settingsLink);

    headerTitle.textContent =
        "Settings";

    loadSettings();

}

// PROFILE

function showProfile() {

    hideAllViews();

    profileView.classList.remove("hidden");

    setActive(profileLink);

    headerTitle.textContent =
        "Profile";

    loadProfile();

}
// DASHBOARD BUTTONS


dashboardLink.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        showDashboard();

    }
);


document
    .getElementById("dashboard-generate-btn")
    .addEventListener(
        "click",
        function () {

            showGenerate();

        }
    );


document
    .getElementById("quick-generate")
    .addEventListener(
        "click",
        function () {

            showGenerate();

        }
    );


document
    .getElementById("quick-saved")
    .addEventListener(
        "click",
        function () {

            showSavedDesigns();

        }
    );


document
    .getElementById("quick-history")
    .addEventListener(
        "click",
        function () {

            showHistory();

        }
    );

// SAVED LINK

savedLink.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        showSavedDesigns();

    }
);

// HISTORY LINK

historyLink.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        showHistory();

    }
);

// SETTINGS LINK

settingsLink.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        showSettings();

    }
);

// PROFILE LINK

profileLink.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        showProfile();

    }
);

// DASHBOARD STATISTICS

function updateDashboardStats() {

    let history = [];

    let saved = [];


    try {

        history =
            JSON.parse(
                localStorage.getItem(
                    "designHistory"
                )
            ) || [];

    } catch {

        history = [];

    }


    saved = getFavouriteDesigns();


    document.getElementById(
        "total-generations"
    ).textContent =
        history.length;


    document.getElementById(
        "total-saved"
    ).textContent =
        saved.length;


    document.getElementById(
        "recent-projects"
    ).textContent =
        Math.min(history.length, 5);

}

// SAVED DESIGNS LOAD


function getFavouriteDesigns() {

    try {

        const favourites =
            JSON.parse(
                localStorage.getItem("favouriteDesigns") || "[]"
            );

        if (Array.isArray(favourites) && favourites.length) {
            return favourites;
        }

        // Backward compatibility with older versions
        const oldSaved =
            JSON.parse(
                localStorage.getItem("savedDesigns") || "[]"
            );

        return Array.isArray(oldSaved) ? oldSaved : [];

    } catch (error) {

        console.error("Unable to read saved designs:", error);
        return [];

    }

}


function loadSavedDesigns() {

    const grid =
        document.getElementById(
            "saved-grid"
        );

    const countText =
        document.getElementById(
            "saved-count-text"
        );


    let saved = [];


    saved = getFavouriteDesigns();


    countText.textContent =
        `${saved.length} saved design${saved.length === 1 ? "" : "s"}`;


    grid.innerHTML = "";


    if (saved.length === 0) {

        grid.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    <i class="fa-regular fa-bookmark"></i>
                </div>

                <h3>
                    No saved designs yet
                </h3>

                <p>
                    Your favourite designs will appear here.
                </p>

            </div>

        `;

        return;

    }


    saved.forEach((design, index) => {

        const item =
            document.createElement("div");

        item.className =
            "saved-design-item";


        item.innerHTML = `

            <div class="saved-preview">

                <i class="fa-solid fa-palette"></i>

            </div>


            <div class="saved-info">

                <h3>
                    ${escapeHTML(
                        design.title ||
                        `Design ${index + 1}`
                    )}
                </h3>

                <p>
                    Saved design
                </p>


                <div class="saved-actions">

                    <button
                        class="preview-design-btn"
                        data-index="${index}">

                        <i class="fa-solid fa-eye"></i>
                        Preview

                    </button>


                    <button
                        class="remove-design-btn"
                        data-index="${index}">

                        <i class="fa-solid fa-trash"></i>
                        Remove

                    </button>

                </div>

            </div>

        `;


        grid.appendChild(item);

    });


    document
        .querySelectorAll(".preview-design-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset.index
                        );

                    const selected =
                        saved[index];

                    if (!selected) return;


                    localStorage.setItem(
                        "selectedDesign",
                        JSON.stringify(selected)
                    );


                    window.location.href =
                        "../module4-code/code.html";

                }
            );

        });


    document
        .querySelectorAll(".remove-design-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset.index
                        );


                    saved.splice(
                        index,
                        1
                    );


                    localStorage.setItem(
                        "favouriteDesigns",
                        JSON.stringify(saved)
                    );


                    loadSavedDesigns();

                    updateDashboardStats();

                }
            );

        });

}

// REFRESH SAVED DESIGNS

document
    .getElementById("saved-refresh")
    .addEventListener(
        "click",
        loadSavedDesigns
    );

// HISTORY LOAD

async function loadHistory() {

    console.log("🔥 loadHistory() started");

    const historyList =
        document.getElementById("history-list");

    const historyCount =
        document.getElementById("history-count");


    if (!historyList) {

        console.error(
            "❌ history-list element not found"
        );

        return;
    }


    // ==========================================
    // GET TOKEN
    // ==========================================

    const token =
        localStorage.getItem("userToken");


    console.log(
        "🔥 HISTORY TOKEN:",
        token
    );


    if (!token) {

        historyList.innerHTML = `
            <div class="empty-state">
                <h3>Please login first</h3>
            </div>
        `;

        return;
    }


    try {

        // ==========================================
        // GET USER PROJECTS
        // ==========================================

        const response =
            await fetch(
                "http://localhost:3000/api/projects",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


        const data =
            await response.json();


        console.log(
            "🔥 PROJECTS API RESPONSE:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to fetch projects"
            );

        }


        // ==========================================
        // GET PROJECT ARRAY
        // ==========================================

        const projects =
            data.projects || [];


        console.log(
            "🔥 USER PROJECTS:",
            projects
        );


        // ==========================================
        // COUNT
        // ==========================================

        if (historyCount) {

            historyCount.textContent =
                `${projects.length} ${
                    projects.length === 1
                        ? "Generation"
                        : "Generations"
                }`;

        }


        // ==========================================
        // EMPTY
        // ==========================================

        if (projects.length === 0) {

            historyList.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">

                        <i class="fa-solid fa-clock-rotate-left"></i>

                    </div>

                    <h3>
                        No generation history
                    </h3>

                    <p>
                        Your previous generations will appear here.
                    </p>

                </div>

            `;

            return;
        }


        // ==========================================
        // RENDER PROJECTS
        // ==========================================

        historyList.innerHTML = "";


        projects.forEach(
            function(project) {

                const item =
                    document.createElement("div");


                item.className =
                    "history-item";


                const projectId =
                    project._id;


                const projectName =
                    project.name ||
                    project.title ||
                    project.heading ||
                    "Untitled Project";


                const createdDate =
                    project.createdAt
                        ? new Date(
                            project.createdAt
                        ).toLocaleString()
                        : "Unknown date";


                item.innerHTML = `

                    <div class="history-icon">

                        <i class="fa-solid fa-wand-magic-sparkles"></i>

                    </div>


                    <div class="history-info">

                        <h3>
                            ${escapeHTML(
                                projectName
                            )}
                        </h3>


                        <p>

                            ${createdDate}

                        </p>

                    </div>


                    <div class="history-actions">

                        <button
                            class="history-open-btn"
                            data-project-id="${projectId}"
                        >

                            <i class="fa-regular fa-eye"></i>

                            View

                        </button>


                        <button
                            class="history-delete-btn"
                            data-project-id="${projectId}"
                        >

                            <i class="fa-solid fa-trash"></i>

                            Delete

                        </button>

                    </div>

                `;


                historyList.appendChild(item);

            }
        );


        console.log(
            `✅ HISTORY RENDERED: ${projects.length} projects`
        );


        // ==========================================
        // VIEW BUTTONS
        // ==========================================

        document
            .querySelectorAll(
                ".history-open-btn"
            )
            .forEach(
                function(button) {

                    button.addEventListener(
                        "click",
                        async function(event) {

                            event.preventDefault();

                            event.stopPropagation();


                            const projectId =
                                button.dataset.projectId;


                            console.log(
                                "🔥 VIEW CLICKED:",
                                projectId
                            );


                            if (!projectId) {

                                console.error(
                                    "❌ Project ID missing"
                                );

                                return;
                            }


                            await viewHistoryProject(
                                projectId
                            );

                        }
                    );

                }
            );


        // ==========================================
        // DELETE BUTTONS
        // ==========================================

        document
            .querySelectorAll(
                ".history-delete-btn"
            )
            .forEach(
                function(button) {

                    button.addEventListener(
                        "click",
                        async function(event) {

                            event.preventDefault();

                            event.stopPropagation();


                            const projectId =
                                button.dataset.projectId;


                            console.log(
                                "🔥 DELETE CLICKED:",
                                projectId
                            );


                            if (!projectId) {

                                console.error(
                                    "❌ Project ID missing"
                                );

                                return;
                            }


                            const confirmed =
                                confirm(
                                    "Are you sure you want to delete this project?"
                                );


                            if (!confirmed) {

                                return;

                            }


                            await deleteHistoryProject(
                                projectId
                            );

                        }
                    );

                }
            );

    }

    catch (error) {

        console.error(
            "❌ HISTORY ERROR:",
            error
        );


        historyList.innerHTML = `

            <div class="empty-state">

                <h3>
                    Unable to load history
                </h3>

                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>

            </div>

        `;

    }

}

async function openHistoryProject(projectId) {

    console.log("🔥 OPEN HISTORY PROJECT:", projectId);

    const token =
        localStorage.getItem("userToken");

    if (!token) {
        alert("Please login first.");
        return;
    }

    try {

        // ==========================================
        // 1. GET PROJECT
        // ==========================================

        const projectResponse =
            await fetch(
                `http://localhost:3000/api/projects/${projectId}`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const projectData =
            await projectResponse.json();


        console.log(
            "🔥 PROJECT RESPONSE:",
            projectData
        );


        if (!projectResponse.ok) {

            throw new Error(
                projectData.message ||
                "Unable to fetch project"
            );

        }


        const project =
            projectData.project;


        if (!project) {

            throw new Error(
                "Project not found"
            );

        }


        console.log(
            "🔥 PROJECT:",
            project
        );


        // ==========================================
        // 2. SAVE CURRENT PROJECT
        // ==========================================

        localStorage.setItem(
            "currentProjectId",
            project._id
        );


        localStorage.setItem(
            "currentProject",
            JSON.stringify(project)
        );


        // ==========================================
        // 3. GET SELECTED DESIGN ID
        // ==========================================

        let selectedDesign =
            project.selectedDesign;


        console.log(
            "🔥 SELECTED DESIGN:",
            selectedDesign
        );


        if (!selectedDesign) {

            alert(
                "No selected design found for this project."
            );

            return;

        }


        // ==========================================
        // 4. IF MONGOOSE POPULATED OBJECT
        // ==========================================

        let designId;


        if (
            typeof selectedDesign === "object"
        ) {

            designId =
                selectedDesign._id;

        } else {

            designId =
                selectedDesign;

        }


        console.log(
            "🔥 DESIGN ID:",
            designId
        );


        // ==========================================
        // 5. GET DESIGN FROM DATABASE
        // ==========================================

        const designResponse =
            await fetch(
                `http://localhost:3000/api/designs/${designId}`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const designData =
            await designResponse.json();


        console.log(
            "🔥 DESIGN API RESPONSE:",
            designData
        );


        if (!designResponse.ok) {

            throw new Error(
                designData.message ||
                "Unable to fetch design"
            );

        }


        // ==========================================
        // 6. GET ACTUAL DESIGN OBJECT
        // ==========================================

        let dbDesign =
            designData.design ||
            designData.data ||
            selectedDesign;


        console.log(
            "🔥 DB DESIGN:",
            dbDesign
        );


        if (!dbDesign) {

            throw new Error(
                "Design data not found"
            );

        }


        // ==========================================
        // 7. CONVERT DB DESIGN → GALLERY DESIGN
        // ==========================================

        const galleryDesign = {

            id:
                dbDesign._id ||
                designId,

            title:
                dbDesign.title ||
                "Selected Design",

            description:
                dbDesign.description ||
                "Previously generated AI frontend design.",


            // IMPORTANT
            html:
                dbDesign.code?.html ||
                dbDesign.html ||
                "",


            css:
                dbDesign.code?.css ||
                dbDesign.css ||
                "",


            js:
                dbDesign.code?.js ||
                dbDesign.js ||
                dbDesign.javascript ||
                "",


            explanation:
                dbDesign.explanation ||
                {},


            tag_explanation:
                dbDesign.tag_explanation ||
                {
                    tags: []
                }

        };


        console.log(
            "🔥 GALLERY DESIGN:",
            galleryDesign
        );


        // ==========================================
        // 8. CHECK CODE
        // ==========================================

        console.log(
            "HTML LENGTH:",
            galleryDesign.html.length
        );

        console.log(
            "CSS LENGTH:",
            galleryDesign.css.length
        );

        console.log(
            "JS LENGTH:",
            galleryDesign.js.length
        );


        // ==========================================
        // 9. SAVE DESIGN
        // ==========================================

        localStorage.setItem(
            "selectedDesign",
            JSON.stringify(galleryDesign)
        );


        localStorage.setItem(
            "currentDesign",
            JSON.stringify(galleryDesign)
        );


        // ==========================================
        // 10. GALLERY EXPECTS { designs: [] }
        // ==========================================

        const galleryResponse = {

            status: "success",

            projectId:
                project._id,

            heading:
                project.name ||
                "Project",

            designs: [
                galleryDesign
            ]

        };


        localStorage.setItem(
            "designResponse",
            JSON.stringify(galleryResponse)
        );


        console.log(
            "🔥 DESIGN RESPONSE SAVED FOR GALLERY:",
            galleryResponse
        );


        // ==========================================
        // 11. OPEN GALLERY
        // ==========================================

        window.location.href =
            "../module3-gallery/gallery.html";


    } catch (error) {

        console.error(
            "❌ OPEN PROJECT ERROR:",
            error
        );

        alert(
            error.message ||
            "Unable to open project."
        );

    }

}

// CLEAR HISTORY

document
    .getElementById("clear-history")
    .addEventListener(
        "click",
        function () {

            const confirmClear =
                confirm(
                    "Are you sure you want to clear your generation history?"
                );


            if (!confirmClear) return;


            localStorage.removeItem(
                "designHistory"
            );


            localStorage.removeItem(
                "currentGeneration"
            );


            loadHistory();

            updateDashboardStats();

        }
    );


// SETTINGS LOAD

function loadSettings() {

    let saved = {};


    try {

        saved =
            JSON.parse(
                localStorage.getItem(
                    "aiFrontendSettings"
                ) || "{}"
            );

    } catch {

        saved = {};

    }


    document.getElementById(
        "default-mode"
    ).value =
        saved.defaultMode || "prompt";


    document.getElementById(
        "auto-save-setting"
    ).checked =
        saved.autoSave !== false;


    document.getElementById(
        "notification-setting"
    ).checked =
        saved.notifications !== false;

}

// SETTINGS SAVE


document
    .getElementById("save-settings")
    .addEventListener(
        "click",
        function () {

            const settings = {

                defaultMode:
                    document.getElementById(
                        "default-mode"
                    ).value,

                autoSave:
                    document.getElementById(
                        "auto-save-setting"
                    ).checked,

                notifications:
                    document.getElementById(
                        "notification-setting"
                    ).checked

            };


            localStorage.setItem(
                "aiFrontendSettings",
                JSON.stringify(settings)
            );


            const message =
                document.getElementById(
                    "settings-message"
                );


            message.textContent =
                "Settings saved successfully ✓";


            // Apply default mode immediately

            if (
                settings.defaultMode === "code"
            ) {

                document
                    .querySelector(
                        '.mode-tab[data-mode="code"]'
                    )
                    .click();

            } else {

                document
                    .querySelector(
                        '.mode-tab[data-mode="prompt"]'
                    )
                    .click();

            }


            setTimeout(() => {

                message.textContent = "";

            }, 2500);

        }
    );


// ======================================================
// LOAD LOGGED-IN USER PROFILE
// ======================================================

function loadProfile() {

    let user = null;

    try {

        user =
            JSON.parse(
                localStorage.getItem(
                    "loggedInUser"
                ) || "null"
            );

    } catch (error) {

        console.error(
            "❌ Unable to read logged-in user:",
            error
        );

        user = null;
    }


    // If no logged-in user
    if (!user) {

        console.warn(
            "⚠️ No logged-in user found"
        );

        return;
    }


    const name =
        user.name || "User";

    const email =
        user.email || "";


    // ==================================================
    // PROFILE FORM
    // ==================================================

    const profileName =
        document.getElementById(
            "profile-name"
        );

    const profileEmail =
        document.getElementById(
            "profile-email"
        );


    if (profileName) {

        profileName.value =
            name;

    }


    if (profileEmail) {

        profileEmail.value =
            email;

    }


    // ==================================================
    // PROFILE DISPLAY
    // ==================================================

    const profileNameDisplay =
        document.getElementById(
            "profile-name-display"
        );

    const profileEmailDisplay =
        document.getElementById(
            "profile-email-display"
        );


    if (profileNameDisplay) {

        profileNameDisplay.textContent =
            name;

    }


    if (profileEmailDisplay) {

        profileEmailDisplay.textContent =
            email;

    }


    // ==================================================
    // AVATAR
    // ==================================================

    updateAvatar(name);


    console.log(
        "✅ PROFILE LOADED:",
        {
            name: name,
            email: email
        }
    );

}


// ======================================================
// UPDATE AVATAR
// ======================================================

function updateAvatar(name) {

    if (!name) {

        return;

    }


    const letter =
        name
            .trim()
            .charAt(0)
            .toUpperCase();


    const headerAvatar =
        document.getElementById(
            "header-avatar"
        );


    const profileAvatar =
        document.getElementById(
            "profile-avatar"
        );


    // Header avatar
    if (headerAvatar) {

        headerAvatar.textContent =
            letter;

    }


    // Profile large avatar
    if (profileAvatar) {

        profileAvatar.textContent =
            letter;

    }

}

// PROFILE SAVE


document
    .getElementById("save-profile")
    .addEventListener(
        "click",
        function () {

            const name =
                document.getElementById(
                    "profile-name"
                ).value.trim();


            const email =
                document.getElementById(
                    "profile-email"
                ).value.trim();


            if (!name) {

                alert(
                    "Please enter your name."
                );

                return;

            }


            if (!email) {

                alert(
                    "Please enter your email."
                );

                return;

            }


            localStorage.setItem(
                "aiFrontendProfile",
                JSON.stringify({
                    name: name,
                    email: email
                })
            );


            document.getElementById(
                "profile-name-display"
            ).textContent = name;


            document.getElementById(
                "profile-email-display"
            ).textContent = email;


            updateAvatar(name);


            const message =
                document.getElementById(
                    "profile-message"
                );


            message.textContent =
                "Profile updated successfully ✓";


            setTimeout(() => {

                message.textContent = "";

            }, 2500);

        }
    );


// ======================================================
// CANCEL PROFILE
// ======================================================

document
    .getElementById("cancel-profile")
    .addEventListener(
        "click",
        loadProfile
    );


// LOGOUT

const logoutModal =
    document.getElementById(
        "logout-modal"
    );

const cancelLogout =
    document.getElementById(
        "cancel-logout"
    );

const confirmLogout =
    document.getElementById(
        "confirm-logout"
    );


logoutLink.addEventListener(
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

        // Authentication data only

        localStorage.removeItem(
            "isLoggedIn"
        );

        localStorage.removeItem(
            "currentUser"
        );

        localStorage.removeItem(
            "userToken"
        );


        window.location.href =
            "../module1-auth/login.html";

    }
);

// CLOSE LOGOUT MODAL


logoutModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === logoutModal
        ) {

            logoutModal.classList.add(
                "hidden"
            );

        }

    }
);

// ESCAPE HTML
function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

function loadUserProfile() {

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

    const email =
        user.email ||
        "No email";


    // =========================
    // HEADER AVATAR
    // =========================

    const headerAvatar =
        document.getElementById(
            "header-avatar"
        );

    if (headerAvatar) {

        headerAvatar.textContent =
            name.charAt(0).toUpperCase();

    }


    // =========================
    // PROFILE AVATAR
    // =========================

    const profileAvatar =
        document.getElementById(
            "profile-avatar"
        );

    if (profileAvatar) {

        profileAvatar.textContent =
            name.charAt(0).toUpperCase();

    }


    // =========================
    // PROFILE NAME
    // =========================

    const nameDisplay =
        document.getElementById(
            "profile-name-display"
        );

    if (nameDisplay) {

        nameDisplay.textContent =
            name;

    }


    // =========================
    // PROFILE EMAIL
    // =========================

    const emailDisplay =
        document.getElementById(
            "profile-email-display"
        );

    if (emailDisplay) {

        emailDisplay.textContent =
            email;

    }


    // =========================
    // INPUT NAME
    // =========================

    const nameInput =
        document.getElementById(
            "profile-name"
        );

    if (nameInput) {

        nameInput.value =
            name;

    }


    // =========================
    // INPUT EMAIL
    // =========================

    const emailInput =
        document.getElementById(
            "profile-email"
        );

    if (emailInput) {

        emailInput.value =
            email;

    }

}

// INITIAL LOAD

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProfile();
        loadUserProfile();

        // Load default generation mode

        let settings = {};


        try {

            settings =
                JSON.parse(
                    localStorage.getItem(
                        "aiFrontendSettings"
                    ) || "{}"
                );

        } catch {

            settings = {};

        }


        if (
            settings.defaultMode === "code"
        ) {

            const codeButton =
                document.querySelector(
                    '.mode-tab[data-mode="code"]'
                );

            if (codeButton) {
                codeButton.click();
            }

        }


        updateDashboardStats();

        showDashboard();

    }
);

// DEMO DESIGNS

function createDemoDesigns(input, mode) {

    return [

        {
            id: 1,

            title: "Modern SaaS Design",

            html: `
                <div class="demo-page">

                    <nav class="demo-nav">

                        <div class="logo">
                            AI Frontend
                        </div>

                        <div class="links">
                            <a href="#">Home</a>
                            <a href="#">Features</a>
                            <a href="#">Pricing</a>

                            <button>
                                Get Started
                            </button>
                        </div>

                    </nav>

                    <section class="hero">

                        <span class="badge">
                            AI Powered
                        </span>

                        <h1>
                            Build Beautiful
                            Websites Faster
                        </h1>

                        <p>
                            Create modern frontend designs
                            using artificial intelligence.
                        </p>

                        <button class="hero-btn">
                            Start Creating
                        </button>

                    </section>

                    <section class="features">

                        <div>
                            <h3>Fast</h3>
                            <p>
                                Generate designs quickly.
                            </p>
                        </div>

                        <div>
                            <h3>Smart</h3>
                            <p>
                                AI powered design generation.
                            </p>
                        </div>

                        <div>
                            <h3>Simple</h3>
                            <p>
                                Easy to use interface.
                            </p>
                        </div>

                    </section>

                </div>
            `,

            css: `
                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    font-family: Arial, sans-serif;
                    background: #f7f3ff;
                    color: #20133d;
                }

                .demo-page {
                    min-height: 100vh;
                }

                .demo-nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 7%;
                    background: white;
                }

                .logo {
                    font-size: 22px;
                    font-weight: bold;
                }

                .links {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .links a {
                    text-decoration: none;
                    color: #555;
                }

                .links button,
                .hero-btn {
                    border: none;
                    background: #7c3aed;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                }

                .hero {
                    text-align: center;
                    padding: 90px 20px;
                }

                .badge {
                    background: #e9ddff;
                    color: #7c3aed;
                    padding: 7px 14px;
                    border-radius: 20px;
                    font-size: 13px;
                }

                .hero h1 {
                    font-size: 48px;
                    max-width: 700px;
                    margin: 25px auto 15px;
                }

                .hero p {
                    max-width: 550px;
                    margin: auto;
                    color: #666;
                    line-height: 1.6;
                }

                .hero-btn {
                    margin-top: 25px;
                }

                .features {
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                    padding: 30px;
                }

                .features div {
                    background: white;
                    padding: 25px;
                    border-radius: 14px;
                    width: 200px;
                    box-shadow:
                        0 5px 20px
                        rgba(0,0,0,0.06);
                }
            `,

            javascript: `
                console.log(
                    "Modern SaaS Design loaded"
                );
            `,

            explanation:
                "A modern SaaS landing page containing navigation, hero section, call-to-action and feature cards."
        },


        {
            id: 2,

            title: "Creative SaaS Design",

            html: `
                <div class="creative-page">

                    <header>

                        <h2>CreativeAI</h2>

                        <button>
                            Explore
                        </button>

                    </header>

                    <main>

                        <div class="content">

                            <span>
                                CREATE WITHOUT LIMITS
                            </span>

                            <h1>
                                Turn Ideas Into
                                Digital Experiences
                            </h1>

                            <p>
                                Transform your ideas into
                                beautiful websites with AI.
                            </p>

                            <button>
                                Create Now
                            </button>

                        </div>

                        <div class="visual">

                            <div class="circle">
                                AI
                            </div>

                        </div>

                    </main>

                </div>
            `,

            css: `
                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    font-family: Arial, sans-serif;
                    background: #120c20;
                    color: white;
                }

                .creative-page {
                    min-height: 100vh;
                    padding: 25px 7%;
                }

                header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                header button {
                    padding: 10px 20px;
                    border: 1px solid #aaa;
                    background: transparent;
                    color: white;
                    border-radius: 20px;
                }

                main {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    min-height: 80vh;
                }

                .content {
                    max-width: 550px;
                }

                .content span {
                    font-size: 12px;
                    letter-spacing: 2px;
                }

                .content h1 {
                    font-size: 55px;
                    line-height: 1.1;
                    margin: 20px 0;
                }

                .content p {
                    color: #bbb;
                    line-height: 1.7;
                }

                .content button {
                    margin-top: 20px;
                    padding: 13px 25px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                }

                .visual {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 300px;
                    height: 300px;
                }

                .circle {
                    width: 220px;
                    height: 220px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: #8b5cf6;
                    font-size: 60px;
                    font-weight: bold;
                }
            `,

            javascript: `
                console.log(
                    "Creative SaaS Design loaded"
                );
            `,

            explanation:
                "A creative landing page with a strong hero message, navigation, call-to-action and visual AI element."
        },


        {
            id: 3,

            title: "Minimal SaaS Design",

            html: `
                <div class="minimal-page">

                    <nav>

                        <strong>
                            MinimalAI
                        </strong>

                        <div>
                            <a href="#">Product</a>
                            <a href="#">About</a>
                            <a href="#">Contact</a>
                        </div>

                    </nav>

                    <section>

                        <h1>
                            Simple.
                            Powerful.
                            Intelligent.
                        </h1>

                        <p>
                            A clean AI-powered experience
                            designed for modern teams.
                        </p>

                        <button>
                            Get Started
                        </button>

                    </section>

                </div>
            `,

            css: `
                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    font-family: Arial, sans-serif;
                    background: #ffffff;
                    color: #171717;
                }

                .minimal-page {
                    min-height: 100vh;
                    padding: 25px 8%;
                }

                nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                nav div {
                    display: flex;
                    gap: 25px;
                }

                nav a {
                    text-decoration: none;
                    color: #555;
                    font-size: 14px;
                }

                section {
                    max-width: 700px;
                    margin: 150px auto;
                    text-align: center;
                }

                section h1 {
                    font-size: 58px;
                    line-height: 1.05;
                    margin-bottom: 25px;
                }

                section p {
                    color: #666;
                    line-height: 1.6;
                }

                section button {
                    margin-top: 25px;
                    border: none;
                    background: #111;
                    color: white;
                    padding: 14px 25px;
                    border-radius: 7px;
                    cursor: pointer;
                }
            `,

            javascript: `
                console.log(
                    "Minimal SaaS Design loaded"
                );
            `,

            explanation:
                "A minimal design focused on clean typography, simple navigation, whitespace and a clear call-to-action."
        },


        {
            id: 4,

            title: "Professional SaaS Design",

            html: `
                <div class="professional-page">

                    <header>

                        <h2>ProAI</h2>

                        <button>
                            Login
                        </button>

                    </header>

                    <section class="hero">

                        <div>

                            <h1>
                                AI Solutions
                                For Modern Business
                            </h1>

                            <p>
                                Improve productivity and
                                automate your workflow.
                            </p>

                            <div class="buttons">

                                <button>
                                    Start Free
                                </button>

                                <button class="secondary">
                                    Learn More
                                </button>

                            </div>

                        </div>

                    </section>

                    <section class="stats">

                        <div>
                            <strong>10K+</strong>
                            <span>Users</span>
                        </div>

                        <div>
                            <strong>99%</strong>
                            <span>Uptime</span>
                        </div>

                        <div>
                            <strong>24/7</strong>
                            <span>Support</span>
                        </div>

                    </section>

                </div>
            `,

            css: `
                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    font-family: Arial, sans-serif;
                    background: #f5f7fb;
                    color: #182033;
                }

                .professional-page {
                    min-height: 100vh;
                    padding: 25px 8%;
                }

                header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                header button {
                    border: 1px solid #bbb;
                    background: white;
                    padding: 10px 20px;
                    border-radius: 7px;
                }

                .hero {
                    min-height: 65vh;
                    display: flex;
                    align-items: center;
                }

                .hero h1 {
                    font-size: 55px;
                    max-width: 650px;
                    margin-bottom: 20px;
                }

                .hero p {
                    color: #687080;
                    font-size: 18px;
                }

                .buttons {
                    display: flex;
                    gap: 12px;
                    margin-top: 25px;
                }

                .buttons button {
                    border: none;
                    padding: 13px 22px;
                    border-radius: 7px;
                    background: #4f46e5;
                    color: white;
                }

                .buttons .secondary {
                    background: white;
                    color: #222;
                    border: 1px solid #ddd;
                }

                .stats {
                    display: flex;
                    gap: 20px;
                }

                .stats div {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    min-width: 120px;
                }

                .stats strong,
                .stats span {
                    display: block;
                }

                .stats strong {
                    font-size: 25px;
                }

                .stats span {
                    color: #777;
                    margin-top: 5px;
                }
            `,

            javascript: `
                console.log(
                    "Professional SaaS Design loaded"
                );
            `,

            explanation:
                "A professional business-oriented landing page with navigation, hero content, CTA buttons and business statistics."
        },


        {
            id: 5,

            title: "Elegant SaaS Design",

            html: `
                <div class="elegant-page">

                    <nav>

                        <h2>
                            ElegantAI
                        </h2>

                        <button>
                            Join Us
                        </button>

                    </nav>

                    <main>

                        <div class="tag">
                            AI • INNOVATION • FUTURE
                        </div>

                        <h1>
                            Design Your
                            Digital Future
                        </h1>

                        <p>
                            Create memorable digital
                            experiences with intelligent
                            design generation.
                        </p>

                        <button class="cta">
                            Start Designing
                        </button>

                    </main>

                </div>
            `,

            css: `
                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    font-family: Georgia, serif;
                    background: #f1eee8;
                    color: #28251f;
                }

                .elegant-page {
                    min-height: 100vh;
                    padding: 30px 8%;
                }

                nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                nav h2 {
                    font-size: 22px;
                }

                nav button {
                    background: transparent;
                    border: 1px solid #28251f;
                    padding: 10px 18px;
                    border-radius: 20px;
                }

                main {
                    max-width: 800px;
                    margin: 150px auto;
                    text-align: center;
                }

                .tag {
                    font-family: Arial, sans-serif;
                    font-size: 11px;
                    letter-spacing: 3px;
                }

                main h1 {
                    font-size: 65px;
                    line-height: 1.05;
                    margin: 25px 0;
                }

                main p {
                    max-width: 550px;
                    margin: auto;
                    font-family: Arial, sans-serif;
                    color: #68645c;
                    line-height: 1.7;
                }

                .cta {
                    margin-top: 30px;
                    border: none;
                    padding: 14px 25px;
                    border-radius: 25px;
                    background: #28251f;
                    color: white;
                    cursor: pointer;
                }
            `,

            javascript: `
                console.log(
                    "Elegant SaaS Design loaded"
                );
            `,

            explanation:
                "An elegant SaaS landing page using strong typography, balanced whitespace, refined navigation and a clear call-to-action."
        }

    ];

}
/* =====================================================
   VIEW HISTORY PROJECT
===================================================== */

async function viewHistoryProject(projectId) {

    console.log("🔥 VIEW BUTTON CLICKED");
    console.log("🔥 PROJECT ID:", projectId);


    if (!projectId) {

        console.error("❌ PROJECT ID NOT FOUND");

        alert("Project ID not found");

        return;
    }


    const token =
        localStorage.getItem("userToken");


    console.log(
        "🔥 TOKEN EXISTS:",
        !!token
    );


    if (!token) {

        alert("Please login first");

        return;
    }


    try {

        // ==========================================
        // 1. GET PROJECT
        // ==========================================

        console.log(
            "🔍 GETTING PROJECT FROM DATABASE..."
        );


        const response =
            await fetch(
                `http://localhost:3000/api/projects/${projectId}`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


        console.log(
            "🔥 PROJECT HTTP STATUS:",
            response.status
        );


        const data =
            await response.json();


        console.log(
            "🔥 PROJECT RESPONSE:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load project"
            );

        }


        // ==========================================
        // 2. GET PROJECT OBJECT
        // ==========================================

        const project =
            data.project;


        if (!project) {

            throw new Error(
                "Project not found"
            );

        }


        console.log(
            "✅ PROJECT FOUND:",
            project
        );


        // ==========================================
        // 3. GET SELECTED DESIGN
        // ==========================================

        const selectedDesign =
            project.selectedDesign;


        console.log(
            "🔥 SELECTED DESIGN:",
            selectedDesign
        );


        if (!selectedDesign) {

            throw new Error(
                "No selected design found for this project"
            );

        }


        // ==========================================
        // 4. SAVE PROJECT
        // ==========================================

        localStorage.setItem(
            "currentProjectId",
            project._id
        );


        localStorage.setItem(
            "currentProject",
            JSON.stringify(project)
        );


        // ==========================================
        // 5. GET DESIGN
        // ==========================================

        let design;


        /*
        selectedDesign can be:

        1. Populated object
        2. Only ObjectId
        */


        if (
            typeof selectedDesign === "object" &&
            selectedDesign !== null
        ) {

            design =
                selectedDesign;

        }

        else {

            console.log(
                "🔍 SELECTED DESIGN IS ONLY ID"
            );


            const designResponse =
                await fetch(
                    `http://localhost:3000/api/designs/${selectedDesign}`,
                    {
                        method: "GET",

                        headers: {
                            "Authorization":
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json"
                        }
                    }
                );


            const designData =
                await designResponse.json();


            console.log(
                "🔥 DESIGN RESPONSE:",
                designData
            );


            if (!designResponse.ok) {

                throw new Error(
                    designData.message ||
                    "Unable to load design"
                );

            }


            design =
                designData.design ||
                designData.data;


        }


        // ==========================================
        // 6. CHECK DESIGN
        // ==========================================

        if (!design) {

            throw new Error(
                "Design data not found"
            );

        }


        console.log(
            "✅ DESIGN FOUND:",
            design
        );


        // ==========================================
        // 7. NORMALIZE DESIGN
        // ==========================================

        const historyDesign = {

            _id:
                design._id || "",

            projectId:
                design.projectId ||
                project._id,

            code: {

                html:
                    design.code?.html ||
                    design.html ||
                    "",

                css:
                    design.code?.css ||
                    design.css ||
                    "",

                js:
                    design.code?.js ||
                    design.js ||
                    design.javascript ||
                    ""

            },

            explanation:
                design.explanation || {

                    overallExplanation: "",
                    htmlExplanation: "",
                    cssExplanation: "",
                    jsExplanation: ""

                },

            tag_explanation:
                design.tag_explanation || {

                    tags: []

                }

        };


        console.log(
            "🔥 HISTORY DESIGN:",
            historyDesign
        );


        // ==========================================
        // 8. SAVE DATA FOR HISTORY DESIGN PAGE
        // ==========================================

        localStorage.setItem(
            "currentProject",
            JSON.stringify(project)
        );


        localStorage.setItem(
            "currentProjectId",
            project._id
        );


        localStorage.setItem(
            "currentDesign",
            JSON.stringify(historyDesign)
        );


        /*
        Optional compatibility keys
        */

        localStorage.setItem(
            "selectedDesign",
            JSON.stringify(historyDesign)
        );


        localStorage.setItem(
            "designResponse",
            JSON.stringify({

                status: "success",

                projectId:
                    project._id,

                heading:
                    project.name,

                designs: [
                    historyDesign
                ]

            })
        );


        console.log(
            "✅ HISTORY DATA SAVED"
        );


        console.log(
            "🔥 CURRENT PROJECT ID:",
            localStorage.getItem(
                "currentProjectId"
            )
        );


        console.log(
            "🔥 CURRENT DESIGN:",
            JSON.parse(
                localStorage.getItem(
                    "currentDesign"
                )
            )
        );


        // ==========================================
        // 9. OPEN HISTORY DESIGN PAGE
        // ==========================================

        window.location.href =
    "../module3-gallery/history-design.html";


    }

    catch (error) {

        console.error(
            "❌ VIEW PROJECT ERROR:",
            error
        );


        alert(
            error.message ||
            "Error loading project"
        );

    }

}


/*
 * Make function available to HTML onclick
 */

window.viewHistoryProject =
    viewHistoryProject;


/*
 * IMPORTANT
 * Make function globally accessible
 */

window.viewHistoryProject =
    viewHistoryProject;

/* =====================================================
   DELETE HISTORY PROJECT
===================================================== */

async function deleteHistoryProject(projectId) {

    console.log(
        "🔥 DELETE PROJECT:",
        projectId
    );


    const token =
        localStorage.getItem("userToken");


    if (!token) {

        alert("Please login first.");

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this project?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `http://localhost:3000/api/projects/${projectId}`,
                {
                    method: "DELETE",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"

                    }

                }
            );


        const data =
            await response.json();


        console.log(
            "🔥 DELETE RESPONSE:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to delete project"
            );

        }


        alert(
            "Project deleted successfully."
        );


        /*
         * Reload history
         */

        loadHistory();


    } catch (error) {

        console.error(
            "❌ DELETE ERROR:",
            error
        );


        alert(
            error.message ||
            "Unable to delete project"
        );

    }

}


window.deleteHistoryProject =
    deleteHistoryProject;