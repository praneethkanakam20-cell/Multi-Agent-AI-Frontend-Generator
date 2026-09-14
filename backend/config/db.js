const mongoose = require("mongoose");
async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connection if successful");
    } catch (error) {
        console.log("Database connection is failed");
        console.log(error.message);
    }
}
module.exports = connectDB;