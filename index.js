///definition
const PORT = process.env.PORT || 5000;

const express = require("express");
const path = require("path");
var fs = require("fs");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("express-async-errors");
const morganBody = require("morgan-body");
const command = require("./command");
const logErrors = require("./utils/logErrors");
const errorHandler = require("./utils/errorHandler");
const dbConnection = require("./config/db");

var date = new Date();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(cors());

// app.use(express.static(path.join(__dirname, "public")));
// app.set("views", path.join(__dirname, "views"));

// create a write stream (in append mode)

var accessLogStream = fs.createWriteStream(
	__dirname + `/logs/${date.getFullYear()}-${date.getMonth()}-${date.getDate()}.log`,
	{ flags: "a" }
);
dbConnection.connect();
// app.use((req, res, next) => {

// 	next();
// });

app.use((req, res, next) => {
	console.clear();
	next();
});
app.use(command.ResponseModify);
// app.use(command.TokenKontrol);

// API ENDPOINTS
app.use("*", function (req, res) {
	res.json({ status: "start" });
});
// app.use("/api", require("./router"));

// app.get("/pdf/:id", function (req, res) {
// 	res.sendFile(__dirname + `/pdf/${req.params.id}`);
// });

// app.get("*", function (req, res) {
// 	res.sendFile(__dirname + "/public/index.html");
// });

// app.use("/ddd", express.static("public"));

app.use(logErrors);
app.use(errorHandler);

const server = app.listen(PORT, function () {
	console.log(`Server (Açmak için ctrl + Left click) http://localhost:${PORT}`);
});

// express()
// 	.use(express.static(path.join(__dirname, "public")))
// 	.set("views", path.join(__dirname, "views"))
// 	.set("view engine", "ejs")
// 	.get("/", (req, res) => res.render("pages/index"))
// 	.get("/iso", function (req, res) {
// 		res.sendFile("index.html", { root: __dirname });
// 	})
// 	.listen(PORT, () => console.log(`Listening on ${PORT}`));
