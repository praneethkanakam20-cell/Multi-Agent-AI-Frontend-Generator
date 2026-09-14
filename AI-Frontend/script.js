

function goToLogin() {
    window.location.href = "module1-auth/login.html";
}

// VIEW DEMO

function scrollToHowItWorks() {

    const section = document.getElementById("how-it-works");

    if (!section) return;

    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// NAVBAR SECTION LINKS

document.addEventListener("DOMContentLoaded", function () {

    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            event.preventDefault();

            const targetId = this.getAttribute("href");

            if (!targetId) return;

            const targetSection =
                document.querySelector(targetId);

            if (!targetSection) return;

            targetSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });

});