console.log("🔥 NEW HISTORY.JS LOADED 🔥");
const API_URL = "http://localhost:3000/api";


/* ================================
   ELEMENTS
================================ */

const historyList =
    document.getElementById("history-list");

const historyCount =
    document.getElementById("history-count");


/* ================================
   TOKEN
================================ */

function getToken() {

    return localStorage.getItem("userToken");

}


/* ================================
   LOAD HISTORY
================================ */

async function loadHistory() {

    const token = getToken();

    console.log("TOKEN:", token);


    if (!token) {

        historyList.innerHTML = `
            <div class="empty-history">
                <h2>Please Login</h2>
                <p>Login to view your generation history.</p>
            </div>
        `;

        return;
    }


    try {

        console.log("Fetching projects...");


        const response = await fetch(
            `${API_URL}/projects`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        const data = await response.json();


        console.log("PROJECT API:", data);


        if (!response.ok) {

            throw new Error(
                data.message || "Failed to fetch projects"
            );

        }


        const projects = data.projects || [];


        /* ================================
           COUNT
        ================================ */

        historyCount.textContent =
            `${projects.length} Generations`;


        /* ================================
           EMPTY
        ================================ */

        if (projects.length === 0) {

            historyList.innerHTML = `
                <div class="empty-history">

                    <h2>
                        No generation history
                    </h2>

                    <p>
                        Your previous generations will appear here.
                    </p>

                </div>
            `;

            return;
        }


        /* ================================
           CLEAR
        ================================ */

        historyList.innerHTML = "";


        /* ================================
           PROJECTS
        ================================ */

        projects.forEach(project => {

            const card =
                document.createElement("div");


            card.className =
                "history-card";


            const projectName =
                project.name ||
                "Untitled Project";


            const prompt =
                project.prompt ||
                "No prompt available";


            const date =
                project.createdAt
                    ? new Date(
                        project.createdAt
                    ).toLocaleString()
                    : "";


            card.innerHTML = `

                <div class="history-card-content">

                    <div class="history-card-icon">
                        <i class="fa-solid fa-wand-magic-sparkles"></i>
                    </div>

                    <div class="history-card-info">

                        <span class="history-label">
                            GENERATION
                        </span>

                        <h2>
                            ${escapeHTML(projectName)}
                        </h2>

                        <p>
                            ${escapeHTML(prompt)}
                        </p>

                        <small>
                            ${date}
                        </small>

                    </div>

                    <div class="history-card-arrow">

                        <i class="fa-solid fa-arrow-right"></i>

                    </div>

                </div>

            `;


            /* ================================
               PROJECT CLICK
            ================================ */

            card.addEventListener(
                "click",
                function() {

                    console.log(
                        "Selected Project:",
                        project
                    );


                    /*
                       VERY IMPORTANT

                       Save project ID
                    */

                    localStorage.setItem(
                        "currentProjectId",
                        project._id
                    );


                    /*
                       If selected design is
                       already populated
                    */

                    if (
                        project.selectedDesign &&
                        typeof project.selectedDesign === "object"
                    ) {

                        localStorage.setItem(
                            "selectedDesign",
                            JSON.stringify(
                                project.selectedDesign
                            )
                        );


                        localStorage.setItem(
                            "selectedDesignId",
                            project.selectedDesign._id
                        );

                    }


                    /*
                       Open code / project page
                    */

                    window.location.href =
                        "../module4-code/code.html";

                }
            );


            historyList.appendChild(card);

        });


    }

    catch (error) {

        console.error(
            "HISTORY ERROR:",
            error
        );


        historyList.innerHTML = `

            <div class="empty-history">

                <h2>
                    Error Loading History
                </h2>

                <p>
                    ${escapeHTML(error.message)}
                </p>

            </div>

        `;

    }

}

async function deleteHistoryProject(projectId) {

    console.log(
        "🔥 DELETE PROJECT:",
        projectId
    );


    const token =
        localStorage.getItem(
            "userToken"
        );


    if (!token) {

        alert(
            "Please login first."
        );

        return;
    }


    try {

        // ==========================================
        // DELETE PROJECT FROM DATABASE
        // ==========================================

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


        // ==========================================
        // SUCCESS
        // ==========================================

        console.log(
            "✅ PROJECT DELETED:",
            projectId
        );


        // Remove old project data if
        // it belongs to deleted project

        const currentProjectId =
            localStorage.getItem(
                "currentProjectId"
            );


        if (
            currentProjectId ===
            projectId
        ) {

            localStorage.removeItem(
                "currentProjectId"
            );

            localStorage.removeItem(
                "currentProject"
            );

            localStorage.removeItem(
                "projectData"
            );

            localStorage.removeItem(
                "currentGeneration"
            );

            localStorage.removeItem(
                "selectedDesign"
            );

            localStorage.removeItem(
                "currentDesign"
            );

            localStorage.removeItem(
                "designResponse"
            );

        }


        alert(
            "Project deleted successfully"
        );


        // Reload history

        await loadHistory();


    } catch (error) {

        console.error(
            "❌ DELETE HISTORY ERROR:",
            error
        );


        alert(
            error.message ||
            "Unable to delete project"
        );

    }

}


/* ================================
   ESCAPE HTML
================================ */

function escapeHTML(value) {

    return String(value || "")

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* ================================
   MODAL CLOSE
================================ */

function closeHistoryModal() {

    const modal =
        document.getElementById(
            "history-modal"
        );


    if (modal) {

        modal.classList.add("hidden");

    }

}


/* ================================
   START
================================ */

loadHistory();