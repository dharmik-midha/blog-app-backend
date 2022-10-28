//imports
const express = require("express");
const connectDB = require("./config/db");

//object and port
const server = express();
const PORT = process.env.PORT || 5000;

//connection with db
connectDB();

//handle cors and jsonParser
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(require("./middleware/cors"));

//routes
server.use("/api/users", require("./routes/user"));
server.use("/api/blogs", require("./routes/blog"));
server.use("/api/categories", require("./routes/categories"));

server.listen(PORT);
