const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();
require("dotenv").config();
const generateRoutes = require("./routes/generateRoutes");
app.use(cors());
app.use(express.json());
app.use("/api",generateRoutes);
console.log("Mongo URI exists:", !!process.env.MONGO_URI);
console.log(
    "Mongo username:",
    process.env.MONGO_URI?.split("://")[1]?.split(":")[0]
);
connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT , () =>{
    console.log(`Server is running on the port ${PORT}...`);
});
console.log("server.js was completed");
