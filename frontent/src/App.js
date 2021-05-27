import { useEffect, useState } from "react";
import { Container, Row, Col, Form, InputGroup, FormControl, Button } from "react-bootstrap";
import axios from "axios";
import ccxt from "ccxt";
import { rsi } from "./trading-indicator";
import "./App.css";
import DenemeChart from "./DenemeChart";
const indicators = require("technicalindicators");

let Tempdata = {};
function App() {
	const [charData, setcharData] = useState([]);
	const [repeat, setrepeat] = useState(0);
	const [inputcustomCoinList, setinputcustomCoinList] = useState("");

	const [selectedCoin, setselectedCoin] = useState("HOT/TRY");

	let binance = new ccxt.binance();
	useEffect(() => {
		// tahminPiyasa();

		wsRun();
	}, [repeat, selectedCoin]);

	const wsRun = async (ws) => {
		// while (true) {
		// let a = await binance.loadMarkets();

		// console.log("binance", binance.symbols);
		// let filteredSymbols = binance.symbols.filter((symbol) => /[a-zA-Z]\/USDT/gi.test(symbol));

		let filteredSymbols = [];
		//TODO:top300 koin
		// await axios
		// 	.get(
		// 		"https://api.coinmarketcap.com/data-api/v3/cryptocurrency/listing?start=1&limit=300&sortBy=market_cap&sortType=desc&convert=USD,btc,eth&cryptoType=all&tagType=all&aux=ath,atl,high24h,low24h,num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,volume_7d,volume_30d"
		// 	)
		// 	.then(function (response) {
		// 		filteredSymbols = response.data.data.cryptoCurrencyList;
		// 		filteredSymbols = filteredSymbols.map((item) => `${item.symbol}/USDT`);

		// 		console.log({ filteredSymbols });
		// 	})
		// 	.catch(function (error) {
		// 		// handle error
		// 		console.log(error);
		// 	})
		// 	.then(function () {
		// 		// always executed
		// 	});

		// await axios.get("https://api.binance.com/api/v1/exchangeInfo").then(function (response) {
		// 	filteredSymbols = response.data.data.symbols;

		// 	quoteAsset

		// 	filteredSymbols = filteredSymbols.map((item) => `${item.baseAsset}/USDT`);

		// 	console.log({ filteredSymbols });
		// });

		filteredSymbols = [
			"EGLD/USDT",
			"ALICE/USDT",
			"MDT/USDT",
			"XEM/USDT",
			"REN/USDT",
			"1INCH/USDT",
			"SXP/USDT",
			"TWT/USDT",
			"GHST/ETH",
			"NEO/USDT",
			"IOTA/USDT",
			"BURGER/BNB",

			// 	"USDT/TRY",
			// 	"BUSD/TRY",
			// 	"HOT/TRY",
			// 	"CHZ/TRY",
			// 	"BTT/TRY",
			// 	"WAVES/USDT",
			// 	"ADA/TRY",
			// 	"TRX/TRY",
			// 	"RVN/USDT",
			// 	"XRP/TRY",
			// 	"AVAX/TRY",
			// 	"ONT/USDT",
			// 	"BAT/USDT",
			// 	"ETH/TRY",
			// 	"DOGE/TRY",
			// 	"XLM/TRY",
			// 	"EOS/USDT",
			// 	"DOT/TRY",
			// 	"UNI/USDT",
			// 	"LINK/TRY",
			// 	"BAL/USDT",
			// 	"NEO/TRY",
			// 	"XTZ/USDT",
			// 	"ATOM/USDT",
			// 	"LTC/USDT",
			// 	"AAVE/USDT",
			// 	"BCH/USDT",
			// 	"MKR/USDT",
			// 	"BTC/TRY",
			// 	"BNB/TRY",
			// 	"SXP/TRY",
			// 	"OMG/USDT",
			// 	"DOCOS/USDT",
			// 	"WAN/USDT",
			// 	"HBAR/USDT",
			// 	"IOTA/USDT",
			// 	"XEM/USDT",
			// 	"LINKDOWN/USDT",
			// 	"DGB/USDT",
			// 	"BNB/USDT",
			// 	"QTUM/USDT",
			// 	"NPXS/USDT",
			// 	"ANKR/USDT",
			// 	"RVN/USDT",
			// 	"TROY/USDT",
			// 	"ENJ/BNB",
			// 	"WIN/BNB",
			// 	"ONE/BNB",
		];

		for (let index = 0; index < filteredSymbols.length; index++) {
			const coinSymbol = filteredSymbols[index];

			try {
				let [data, category] = await rsi(14, "close", "binance", coinSymbol, "4h", true);

				if (data.length > 0) {
					let [
						coin,
						curretCoinPrice,
						tahminiFiyat,
						yuzdeKazanc,
						satisEmirSayısi,
						alisEmirSayısi,
					] = await tahminPiyasa(coinSymbol);
					// console.log(`${coinSymbol} Rsi`, data, category);

					Tempdata = {
						...Tempdata,
						[coinSymbol]: {
							...Tempdata[coinSymbol],
							data,
							category,
							curretCoinPrice,
							tahminiFiyat,
							yuzdeKazanc,
							satisEmirSayısi,
							alisEmirSayısi,
							tahminiFiyatArray: Tempdata[coinSymbol]?.tahminiFiyatArray || [],
						},
					};
					Tempdata[coinSymbol].tahminiFiyatArray.push(tahminiFiyat);

					// setcharData([...data, { [coinSymbol]: { data, category } }]);

					console.log(
						`(Rsi : ${data[data.length - 1]}%) ${coinSymbol} ==\t(yuzdeKazanc: ${yuzdeKazanc.toFixed(
							2
						)} %)  ===  ${curretCoinPrice}  =>\t${tahminiFiyat},\t alisEmirSayısi = ${alisEmirSayısi} ,\t satisEmirSayısi =  ${satisEmirSayısi}`
					);

					setcharData(Tempdata);
				}
			} catch (error) {
				console.log(coinSymbol + "işlem yapılamadı" + error);
			}
		}

		setrepeat(repeat + 1);
		// }
	};

	const tahminPiyasa = async (coin) => {
		// SelectCoin = ["ATOM/USDT"];

		// for (let index = 0; index < SelectCoin.length; index++) {
		// const coin = SelectCoin[index];
		// if (coin == "CHZ/TRY") {
		// 	debugger;
		// }
		let symbol = await binance.fetchOHLCV(coin, "1m");
		let curretCoinPrice = symbol[symbol.length - 1][1];

		let fetchOrderBooks = await binance.fetchOrderBook(coin, 5000);

		let SatisEmir = fetchOrderBooks.asks.slice(0, fetchOrderBooks.asks.length * 0.8).reduce(
			(result, currentValue, currentIndex, arr) => {
				result.total = result.total + currentValue[0] * currentValue[1];
				result.adet = result.adet + currentValue[1];

				return result;
			},
			{ total: 0, adet: 0 }
		);

		let alisEmri = fetchOrderBooks.bids.slice(0, fetchOrderBooks.bids.length * 0.8).reduce(
			(result, currentValue, currentIndex, arr) => {
				result.total = result.total + currentValue[0] * currentValue[1];
				result.adet = result.adet + currentValue[1];

				return result;
			},
			{ total: 0, adet: 0 }
		);

		let SatisEmirR = SatisEmir.total / SatisEmir.adet;
		let alisEmirR = alisEmri.total / alisEmri.adet;
		let tahminiFiyat = (SatisEmirR + alisEmirR) / 2;
		let yuzdeKazanc = (100 * (tahminiFiyat - curretCoinPrice)) / curretCoinPrice;
		let satisEmirSayısi = fetchOrderBooks.asks.length * 0.8;
		let alisEmirSayısi = fetchOrderBooks.bids.length * 0.8;

		return [coin, curretCoinPrice, tahminiFiyat, yuzdeKazanc, satisEmirSayısi.toFixed(0), alisEmirSayısi.toFixed(0)];
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
				<Form>
					<Form.Row className="align-items-center">
						<Col xs="auto">
							<Form.Label htmlFor="inlineFormInput" srOnly>
								Koin İsmi
							</Form.Label>
							<Form.Control
								className="mb-2"
								id="inlineFormInput"
								placeholder="HOT/TRY"
								onChange={(e) => {
									if (e.target.value) setinputcustomCoinList(e.target.value);
									else {
										setselectedCoin("");

										setcharData([]);
									}
								}}
							/>
						</Col>
						{/* <Col xs="auto">
							<Form.Label htmlFor="inlineFormInputGroup" srOnly>
								Username
							</Form.Label>
							<InputGroup className="mb-2">
								<InputGroup.Prepend>
									<InputGroup.Text>@</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl id="inlineFormInputGroup" placeholder="Username" />
							</InputGroup>
						</Col>  */}
						<Col xs="auto">
							{inputcustomCoinList && (
								<Button
									className="mb-2"
									onClick={() => {
										setselectedCoin("stop");
										// if (inputcustomCoinList) {
										// 	setselectedCoin(inputcustomCoinList);

										// 	setcharData([]);
										// }
									}}>
									Submit
								</Button>
							)}
						</Col>
					</Form.Row>
				</Form>
				<Container>
					<Row>
						{Object.keys(charData).map((item) => {
							return (
								<Col key={item} xs={12} lg={4}>
									<div style={{ paddingBottom: 15 }}>
										<DenemeChart
											name={item}
											subtitle={`<strong style="color:green"> ${charData[item].curretCoinPrice.toFixed(
												4
											)}</strong>  =>  <strong style="color:black">  ${charData[item].tahminiFiyat.toFixed(
												4
											)} </strong> <strong style="color:red"> (${charData[item].yuzdeKazanc.toFixed(
												4
											)}) </strong>   
											<strong style="color:blue"> (  as:${charData[item].alisEmirSayısi} / ss:${
												charData[item].satisEmirSayısi
											} ) </strong>  `}
											chartData={charData[item]}
											sliceCount={10}
											// debug
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
