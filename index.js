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
// const dbConnection = require("./config/db");
const tradingIndicator = require("./trading-indicator");
var date = new Date();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(cors());
const ccxt = require("ccxt");
var WebSocketServer = require("ws").Server,
	wss = new WebSocketServer({ port: 8080 });

// setInterval(() => wsRun(), 1000);

const wsRun = async (ws) => {
	let binance = new ccxt.binance();

	// while (true) {
	let a = await binance.loadMarkets();

	// console.log("binance", binance.symbols);
	let filteredSymbols = binance.symbols.filter((symbol) => /[a-zA-Z]\/USDT/gi.test(symbol));
	console.log("a", filteredSymbols);

	// filteredSymbols = ["ADA/USDT"];
	for (let index = 0; index < filteredSymbols.length; index++) {
		const coinSymbol = filteredSymbols[index];

		let data, category;
		[data, category] = await tradingIndicator.rsi(14, "close", "binance", coinSymbol, "4h", true);

		if (data[data.length - 1] < 45) {
			console.log(`${coinSymbol} Rsi`, data, category);
			ws.send(`${JSON.stringify({ [coinSymbol]: { data, category } })}`);
		}
	}
	// }
};
wss.on("connection", function (ws, req) {
	console.clear();
	wsRun(ws);
});

app.use((req, res, next) => {
	console.clear();

	next();
});
app.use(command.ResponseModify);

// API ENDPOINTS
// app.use("*", async (req, res) => {
// 	// console.log("exchanges", ccxt.exchanges);

// 	// let data, category;
// 	// [data, category] = await tradingIndicator.rsi(14, "close", "binance", "BTC/USDT", "4h", true);
// 	// console.log("rsi", data);
// 	// res.json({ data });

// 	res.json({ status: "ismail çetin" });
// });

// app.get("*", function (req, res) {
// 	res.sendFile(__dirname + "/public/index.html");
// });

const root = require("path").join(__dirname, "public");
app.use(express.static(root));

app.get("*", (req, res) => {
	res.sendFile("index.html", { root });
});

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
