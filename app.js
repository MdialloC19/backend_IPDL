const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const authenticateToken = require("./middlewares/authenticateToken.middleware");
const socketConfig = require("./config/socket.config");
const routes = require("./routes/index.routes");
const { Server: SocketServer } = require("socket.io");
// const socketMiddleware = require("./middlewares/socket.middleware.js");
const path = require("path");

// Middleware pour servir les fichiers statiques
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./helpers/db");
const onConnection = require("./services/socket.services");
const app = express();
connectDB();
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
// app.use(authenticateToken);
app.use("/api/v1", routes);
// welcome message
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the Node.js, Express and Socket.io API",
    });
});

const server = http.createServer(app);
const PORT = process.env.PORT || 4200;

const io = new SocketServer(server, socketConfig);
io.on("connection", onConnection(io));

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
