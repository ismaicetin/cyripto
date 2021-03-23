///definition
const PORT = process.env.PORT || 5000;

const express = require("express");
const path = require("path");
var fs = require("fs");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const ccxt = require("ccxt");
const WSServer = require("express-ws")(app);
const aWss = WSServer.getWss();

require("express-async-errors");
const morganBody = require("morgan-body");
const axios = require("axios").default;

const command = require("./command");
const logErrors = require("./utils/logErrors");
const errorHandler = require("./utils/errorHandler");
// const dbConnection = require("./config/db");
const tradingIndicator = require("./trading-indicator");
var date = new Date();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(cors());

const wsRun = async (ws) => {
	let binance = new ccxt.binance();

	// while (true) {
	// let a = await binance.loadMarkets();

	// console.log("binance", binance.symbols);
	// let filteredSymbols = binance.symbols.filter((symbol) => /[a-zA-Z]\/USDT/gi.test(symbol));

	let filteredSymbols = [];
	await axios
		.get(
			"https://api.coinmarketcap.com/data-api/v3/cryptocurrency/listing?start=1&limit=300&sortBy=market_cap&sortType=desc&convert=USD,btc,eth&cryptoType=all&tagType=all&aux=ath,atl,high24h,low24h,num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,volume_7d,volume_30d"
		)
		.then(function (response) {
			filteredSymbols = response.data.data.cryptoCurrencyList;
			console.log(filteredSymbols);
		})
		.catch(function (error) {
			// handle error
			console.log(error);
		})
		.then(function () {
			// always executed
		});

	// console.log("a", filteredSymbols);

	// filteredSymbols = ["ADA/USDT"];
	for (let index = 0; index < filteredSymbols.length; index++) {
		const item = filteredSymbols[index];
		let coinSymbol = `${item.symbol}/USDT`;

		let data, category;
		[data, category] = await tradingIndicator.rsi(14, "close", "binance", coinSymbol, "4h", true);

		if (data.length > 0) {
			console.log(`${coinSymbol} Rsi`, data, category);
			ws.send(`${JSON.stringify({ [coinSymbol]: { data, category } })}`);
		}
	}
	// }
};

app.ws("/", (ws, req) => {
	wsRun(ws);
});
app.use((req, res, next) => {
	console.clear();
	next();
});
app.use(command.ResponseModify);

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
