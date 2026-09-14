const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            email: email
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );
        return res.status(200).json({
            message: "Login successful",
            token: token ,
            user : {
                name : user.name,
                email : user.email
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error during login"
        });
    }
}
async function createUser(req, res) {
    try {
        const hashedPassword = await bcrypt.hash(
            req.body.password,
            10
        );
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        return res.status(201).json({
            message: "User created successfully",
            user: user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error creating user"
        });
    }
}
async function resetPassword(req, res) {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return res.status(400).json({
                message: "Email and new password are required"
            });
        }
        const user = await User.findOne({
            email: email.toLowerCase()
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const hashedPassword =
            await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({
            message: "Password changed successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error changing password"
        });
    }
}
module.exports = { createUser , loginUser ,resetPassword};