import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import ccxt from "ccxt";
// const tradingIndicator = require("./trading-indicator");
import "./App.css";
import DenemeChart from "./DenemeChart";
const indicators = require("technicalindicators");

const timeIndex = 0,
	dIndex = 0,
	oIndex = 1,
	hIndex = 2,
	lIndex = 3,
	cIndex = 4,
	vIndex = 5;

function App() {
	const [charData, setcharData] = useState([]);
	let binance = new ccxt.binance();

	const detachSource = (ohlcv) => {
		let source = [];
		source["date"] = [];
		source["open"] = [];
		source["high"] = [];
		source["low"] = [];
		source["close"] = [];
		source["volume"] = [];
		if (ohlcv.length == 0) {
			return source;
		}
		ohlcv.forEach((data) => {
			source["date"].push(data[dIndex]);
			source["open"].push(data[oIndex]);
			source["high"].push(data[hIndex]);
			source["low"].push(data[lIndex]);
			source["close"].push(data[cIndex]);
			source["volume"].push(data[vIndex]);
		});
		return source;
	};

	const getOHLCV = async (ex, ticker, interval, isFuture = false) => {
		if (!ccxt.exchanges.includes(ex)) {
			throw "Exchange is not supported";
		}
		try {
			return await binance.fetchOHLCV(ticker, interval);
		} catch (err) {
			return [];
			throw "Ticker is not supported";
		}
	};

	const rsi = async (rsiLength, sourceType, ex, ticker, interval, isFuture = false) => {
		try {
			let ohlcv = await getOHLCV(ex, ticker, interval, isFuture);
			if (!ohlcv) return [[], []];

			let source = detachSource(ohlcv);
			let rsiInput = {
				values: source[sourceType],
				period: rsiLength,
				// reversedInput: true,
			};
			let result = await indicators.RSI.calculate(rsiInput);

			return [result, source.date.slice(rsiLength)];
		} catch (err) {
			throw err;
		}
	};

	useEffect(() => {
		// tahminPiyasa();
		wsRun();
	}, []);

	const wsRun = async (ws) => {
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
				console.log({ filteredSymbols });
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			})
			.then(function () {
				// always executed
			});

		// filteredSymbols = ["ADA/USDT"];
		let Tempdata = {};
		for (let index = 0; index < filteredSymbols.length; index++) {
			const item = filteredSymbols[index];
			let coinSymbol = `${item.symbol}/USDT`;

			let [data, category] = await rsi(14, "close", "binance", coinSymbol, "4h", true);

			if (data.length > 0) {
				let [coin, curretCoinPrice, tahminiFiyat, yuzdeKazanc] = await tahminPiyasa(coinSymbol);
				// console.log(`${coinSymbol} Rsi`, data, category);
				Tempdata = { ...Tempdata, [coinSymbol]: { data, category, curretCoinPrice, tahminiFiyat, yuzdeKazanc } };
				// setcharData([...data, { [coinSymbol]: { data, category } }]);
				setcharData(Tempdata);
				console.log(Tempdata);
			}
		}
		// }
	};

	const tahminPiyasa = async (coin) => {
		let SelectCoin = [
			"USDT/TRY",
			"BUSD/TRY",
			"ADA/TRY",
			"ETH/TRY",
			"BTT/TRY",
			"LINK/TRY",
			"DOGE/TRY",
			"HOT/TRY",
			"BTC/TRY",
			"CHZ/TRY",
			"XLM/TRY",
			"XRP/TRY",
			"TRX/TRY",
			"BNB/TRY",
			"AVAX/TRY",
			"NEO/TRY",
			"DOT/TRY",
			"SXP/TRY",
			"BAL/USDT",
			"ONT/USDT",
			"RVN/USDT",
			"BAT/USDT",
			"LINKDOWN/USDT",
			"BCH/USDT",
			"DOCOS/USDT",
		];
		// SelectCoin = ["ATOM/USDT"];

		// for (let index = 0; index < SelectCoin.length; index++) {
		// const coin = SelectCoin[index];
		let symbol = await binance.fetchOHLCV(coin, "1m");
		let fetchOrderBooks = await binance.fetchOrderBook(coin, 5000);
		let SatisEmir = fetchOrderBooks.asks.reduce(
			(result, currentValue, currentIndex, arr) => {
				result.total = result.total + currentValue[0] * currentValue[1];
				result.adet = result.adet + currentValue[1];

				return result;
			},
			{ total: 0, adet: 0 }
		);

		let alisEmri = fetchOrderBooks.bids.reduce(
			(result, currentValue, currentIndex, arr) => {
				result.total = result.total + currentValue[0] * currentValue[1];
				result.adet = result.adet + currentValue[1];

				return result;
			},
			{ total: 0, adet: 0 }
		);

		let SatisEmirR = SatisEmir.total / SatisEmir.adet;
		let alisEmirR = alisEmri.total / alisEmri.adet;
		let curretCoinPrice = symbol[symbol.length - 1][1];
		let tahminiFiyat = (SatisEmirR + alisEmirR) / 2;
		let yuzdeKazanc = (100 * (tahminiFiyat - curretCoinPrice)) / curretCoinPrice;
		console.log(coin, { curretCoinPrice }, tahminiFiyat, { yuzdeKazanc: yuzdeKazanc.toFixed(2) });
		return [coin, curretCoinPrice, tahminiFiyat, yuzdeKazanc];
		// }
	};

	// const run = async () => {
	// 	// let a = await binance.fetchOHLCV("BTC/USDT", "4h", undefined, 10);
	// 	// console.log(a);
	// 	// debugger;

	// 	console.clear();
	// 	let data, category;
	// 	[data, category] = await rsi(14, "close", "binance", "CHZ/USDT", "4h", true);
	// 	console.log("rsi", data, category);
	// 	setrsiData(data);
	// 	setcategory(category);
	// 	//3. Make calls
	// 	// data = await CoinGeckoClient.ping(); ////API sunucu durumunu kontrol edin.
	// 	// console.log("ping", data);
	// 	// data = await CoinGeckoClient.global(); //Küresel kripto para birimi verilerini alın.
	// 	// console.log("global", data);
	// 	// data = await CoinGeckoClient.coins.all(); //Tüm kripto paraları verilerle (isim, fiyat, pazar, geliştirici, topluluk, vb.) Listeleyin - 50 ile sayfalandırılmış.
	// 	// console.log("coins.all", data);
	// 	// data = await CoinGeckoClient.coins.list(); //API çağrıları yapmak için tüm paraların kimliğini almak için bunu kullanın
	// 	// console.log("coins.list", data);
	// 	// data = await CoinGeckoClient.coins.markets(); //Tüm madeni para piyasa verilerini (fiyat, piyasa değeri, hacim) elde etmek için bunu kullanın.
	// 	// console.log("coins.markets", data);
	// 	// data = await CoinGeckoClient.coins.fetch("bitcoin", {}); //Bir jeton için güncel verileri (isim, fiyat, pazar,… takas fişleri dahil) alın.
	// 	// console.log("coins.fetch", data);
	// 	// data = await CoinGeckoClient.coins.fetchTickers("bitcoin"); //Madeni para şeritleri alın (100 maddeye bölünmüş olarak).
	// 	// console.log("coins.fetchTickers", data);
	// 	// data = await CoinGeckoClient.coins.fetchHistory("bitcoin", { date: "30-12-2017" }); //Bir madeni para için belirli bir tarihte geçmiş verileri (isim, fiyat, piyasa, istatistikler) alın.
	// 	// console.log("coins.fetchHistory", data);
	// 	// data = await CoinGeckoClient.coins.fetchMarketChart("bitcoin"); //Fiyat, piyasa değeri ve 24 saatlik hacmi (ayrıntı düzeyi otomatik) içeren geçmiş piyasa verilerini alın.
	// 	// console.log("coins.fetchMarketChart", data);
	// 	// data = await CoinGeckoClient.coins.fetchMarketChartRange("bitcoin", {
	// 	// 	from: 13925,
	// 	// 	to: 1422577232,
	// 	// }); //Tarihsel piyasa verilerini alın, fiyat, piyasa değeri ve bir zaman damgası aralığında (ayrıntı düzeyi otomatik) 24 saatlik hacmi içerir. Dakikalık veriler 1 gün içinde kullanılacaktır. Saatlik veriler 1 gün ile 90 gün arasındaki süre için kullanılacaktır. Günlük veriler, 90 günün üzerindeki süre boyunca kullanılacaktır.
	// 	// console.log("coins.fetchMarketChartRange", data);
	// 	// data = await CoinGeckoClient.coins.fetchStatusUpdates("bitcoin"); //Belirli bir jeton için durum güncellemelerini alın.
	// 	// console.log("coins.fetchStatusUpdates", data);
	// 	// data = await CoinGeckoClient.exchanges.all(); //Borsalarla ilgili aramalar.
	// 	// console.log("exchanges.all", data);
	// 	// data = await CoinGeckoClient.exchanges.list(); //Desteklenen tüm pazarların kimliğini ve adını listeleyin (sayfalandırma gerekmez).
	// 	// console.log("exchanges.list", data);
	// 	// data = await CoinGeckoClient.exchanges.fetch("binance"); //Yalnızca belirli bir borsa için BTC cinsinden döviz hacmini ve en iyi 100 kuponu alın.
	// 	// console.log("exchanges.fetch", data);
	// 	// data = await CoinGeckoClient.exchanges.fetchTickers("binance"); //Belirli bir değişim için bilet  alın.
	// 	// console.log("exchanges.fetchTickers", data);
	// 	// data = await CoinGeckoClient.exchanges.fetchStatusUpdates("binance"); //Belirli bir değişim için durum güncellemelerini alın.
	// 	// console.log("exchanges.fetchStatusUpdates", data);
	// 	// data = await CoinGeckoClient.exchanges.fetchVolumeChart("binance", {
	// 	// 	days: 1,
	// 	// }); //BTC olarak döndürülen belirli bir borsa için hacim grafiği verilerini alın
	// 	// console.log("exchanges.fetchVolumeChart", data);
	// 	// data = await CoinGeckoClient.statusUpdates.all(); //
	// 	// console.log("statusUpdates.all", data);
	// 	// data = await CoinGeckoClient.events.all(); //
	// 	// console.log("events.all", data);
	// 	// data = await CoinGeckoClient.events.fetchCountries(); //
	// 	// console.log("events.fetchCountries", data);
	// 	// data = await CoinGeckoClient.events.fetchTypes(); //
	// 	// console.log("events.fetchTypes", data);
	// };

	return (
		<div className="App">
			<div className="App-header">
				<h2>ismail Çetin CYRIPTO</h2>

				<Container>
					<Row>
						{Object.keys(charData).map((item) => {
							return (
								<Col key={item} xs={12} md={4}>
									<div style={{ paddingBottom: 15 }}>
										<DenemeChart
											name={item}
											subtitle={`<strong style="color:green"> ${charData[item].curretCoinPrice.toFixed(
												2
											)}</strong>  =>  <strong style="color:black">  ${charData[item].tahminiFiyat.toFixed(
												2
											)} </strong> <strong style="color:red"> (${charData[item].yuzdeKazanc.toFixed(
												2
											)}) </strong> `}
											chartData={charData[item]}
											sliceCount={10}
											debug
										/>
									</div>
								</Col>
							);
						})}
					</Row>
				</Container>
			</div>
		</div>
	);
}

export default App;
