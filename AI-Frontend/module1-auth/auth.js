// ==========================================
// API CONFIGURATION
// ==========================================

const API_URL = "http://localhost:3000/api";


// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Get JWT token
function getToken() {

    return localStorage.getItem("userToken");

}


// Save JWT token
function saveToken(token) {

    localStorage.setItem(
        "userToken",
        token
    );

}


// Save logged-in user information
function saveCurrentUser(user) {

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );

    localStorage.setItem(
        "isLoggedIn",
        "true"
    );

}


// Get logged-in user
function getCurrentUser() {

    try {

        return JSON.parse(
            localStorage.getItem("currentUser")
        );

    } catch (error) {

        return null;

    }

}


// Logout helper
function logoutUser() {

    localStorage.removeItem("userToken");

    localStorage.removeItem("currentUser");

    localStorage.removeItem("isLoggedIn");

}


// ==========================================
// LOGIN
// ==========================================

const loginForm =
    document.getElementById("login-form");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ==================================
            // GET INPUT VALUES
            // ==================================

            const email =
                document
                    .getElementById("login-email")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("login-password")
                    .value;


            // ==================================
            // BASIC VALIDATION
            // ==================================

            if (!email || !password) {

                alert(
                    "Please enter your email and password."
                );

                return;

            }


            // ==================================
            // SEND LOGIN REQUEST
            // ==================================

            try {

                const response =
                    await fetch(
                        `${API_URL}/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                email: email,

                                password: password

                            })
                        }
                    );


                // ==================================
                // READ BACKEND RESPONSE
                // ==================================

                const data =
                    await response.json();


                // ==================================
                // HANDLE ERROR
                // ==================================

                if (!response.ok) {

                    alert(
                        data.message ||
                        "Login failed."
                    );

                    return;

                }


                // ==================================
                // CHECK TOKEN
                // ==================================

                if (!data.token) {

                    alert(
                        "Login successful but token was not received."
                    );

                    console.log(
                        "Backend response:",
                        data
                    );

                    return;

                }


                // ==================================
                // SAVE JWT
                // ==================================

                saveToken(
                    data.token
                );


                // ==================================
                // SAVE USER
                // ==================================

                if (data.user) {

                    saveCurrentUser(
                        data.user
                    );

                } else {

                    // If backend doesn't return
                    // user object

                    saveCurrentUser({

                        email: email

                    });

                }


                // ==================================
                // LOGIN SUCCESS
                // ==================================

                console.log(
                    "Login successful"
                );


                alert(
                    "Login successful!"
                );


                // ==================================
                // GO TO GENERATION PAGE
                // ==================================

                window.location.href =
                    "../module2-generation/generate.html";


            } catch (error) {

                console.log(
                    "Login error:",
                    error
                );


                alert(
                    "Cannot connect to backend server."
                );

            }

        }
    );

}


// ==========================================
// SIGN UP
// ==========================================

const signupForm =
    document.getElementById("signup-form");


if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ==================================
            // GET INPUT VALUES
            // ==================================

            const name =
                document
                    .getElementById("signup-name")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("signup-email")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("signup-password")
                    .value;


            const confirm =
                document
                    .getElementById("signup-confirm")
                    .value;


            // ==================================
            // NAME VALIDATION
            // ==================================

            if (name.length < 2) {

                alert(
                    "Please enter a valid name."
                );

                return;

            }


            // ==================================
            // EMAIL VALIDATION
            // ==================================

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                alert(
                    "Please enter a valid email address."
                );

                return;

            }


            // ==================================
            // PASSWORD VALIDATION
            // ==================================

            if (password.length < 6) {

                alert(
                    "Password must contain at least 6 characters."
                );

                return;

            }


            // ==================================
            // CONFIRM PASSWORD
            // ==================================

            if (password !== confirm) {

                alert(
                    "Passwords do not match."
                );

                return;

            }


            // ==================================
            // SEND SIGNUP REQUEST
            // ==================================

            try {

                const response =
                    await fetch(
                        `${API_URL}/users`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                name: name,

                                email: email,

                                password: password

                            })
                        }
                    );


                // ==================================
                // READ BACKEND RESPONSE
                // ==================================

                const data =
                    await response.json();


                // ==================================
                // HANDLE ERROR
                // ==================================

                if (!response.ok) {

                    alert(
                        data.message ||
                        "Account creation failed."
                    );

                    return;

                }


                // ==================================
                // MAKE SURE USER IS NOT LOGGED IN
                // ==================================

                logoutUser();


                // ==================================
                // SUCCESS
                // ==================================

                alert(
                    "Account created successfully. Please login."
                );


                console.log(
                    "Signup response:",
                    data
                );


                // ==================================
                // GO TO LOGIN
                // ==================================

                window.location.href =
                    "login.html";


            } catch (error) {

                console.log(
                    "Signup error:",
                    error
                );


                alert(
                    "Cannot connect to backend server."
                );

            }

        }
    );

}


// ==========================================
// FORGOT PASSWORD / RESET PASSWORD
// ==========================================

const forgotForm =
    document.getElementById("forgot-form");


if (forgotForm) {

    forgotForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ==================================
            // GET VALUES
            // ==================================

            const email =
                document
                    .getElementById("forgot-email")
                    .value
                    .trim()
                    .toLowerCase();


            const newPassword =
                document
                    .getElementById("new-password")
                    .value;


            const confirmPassword =
                document
                    .getElementById("confirm-password")
                    .value;


            // ==================================
            // EMAIL VALIDATION
            // ==================================

            if (!email) {

                alert(
                    "Please enter your email."
                );

                return;

            }


            // ==================================
            // PASSWORD VALIDATION
            // ==================================

            if (newPassword.length < 6) {

                alert(
                    "New password must contain at least 6 characters."
                );

                return;

            }


            // ==================================
            // CONFIRM PASSWORD
            // ==================================

            if (
                newPassword !==
                confirmPassword
            ) {

                alert(
                    "Passwords do not match."
                );

                return;

            }


            // ==================================
            // SEND RESET PASSWORD REQUEST
            // ==================================

            try {

                const response =
                    await fetch(
                        `${API_URL}/reset-password`,
                        {

                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                email: email,

                                newPassword:
                                    newPassword

                            })

                        }
                    );


                // ==================================
                // READ BACKEND RESPONSE
                // ==================================

                const data =
                    await response.json();


                // ==================================
                // HANDLE ERROR
                // ==================================

                if (!response.ok) {

                    alert(
                        data.message ||
                        "Password reset failed."
                    );

                    return;

                }


                // ==================================
                // SUCCESS
                // ==================================

                alert(
                    "Password changed successfully! Please login with your new password."
                );


                // ==================================
                // CLEAR FORM
                // ==================================

                forgotForm.reset();


                // ==================================
                // GO TO LOGIN
                // ==================================

                window.location.href =
                    "login.html";


            } catch (error) {

                console.log(
                    "Reset password error:",
                    error
                );


                alert(
                    "Cannot connect to backend server."
                );

            }

        }
    );

}

// ==========================================
// PASSWORD VISIBILITY
// ==========================================

document
    .querySelectorAll(".toggle-password")
    .forEach(
        function (icon) {

            icon.addEventListener(
                "click",
                function () {

                    const input =
                        this.previousElementSibling;


                    if (!input) {
                        return;
                    }


                    // ==================================
                    // SHOW PASSWORD
                    // ==================================

                    if (
                        input.type ===
                        "password"
                    ) {

                        input.type =
                            "text";


                        this.classList.replace(
                            "fa-eye",
                            "fa-eye-slash"
                        );

                    }


                    // ==================================
                    // HIDE PASSWORD
                    // ==================================

                    else {

                        input.type =
                            "password";


                        this.classList.replace(
                            "fa-eye-slash",
                            "fa-eye"
                        );

                    }

                }
            );

        }
    );