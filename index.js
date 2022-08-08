const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const router = require("./router");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config({ path: "./config.env" });
//app setup
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));
app.use(bodyParser.json({ type: "*/*" }));
router(app);

//database setup
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DB_PASSWORD);
mongoose.connect(DB).then(() => {
	console.log("DB connection successful !");
});

//server setup
const port = process.env.PORT || 3069;
const server = http.createServer(app);
server.listen(port, () => {
	console.log(`Server listening on ${port}`);
});
