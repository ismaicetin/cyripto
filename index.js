///definition
const PORT = process.env.PORT || 5000;

const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(cors());

const root = require("path").join(__dirname, "frontent/build");
app.use(express.static(root));

app.get("*", (req, res) => {
	res.sendFile("index.html", { root });
});

const server = app.listen(PORT, function () {
	console.log(`Server (Açmak için ctrl + Left click) http://localhost:${PORT}`);
});
