const getOHLCV = require("./ohlcv.js");
const detachSource = require("./source.js");
const indicators = require("technicalindicators");

const rsi = async (rsiLength, sourceType, ex, ticker, interval, isFuture = false) => {
	try {
		let ohlcv = await getOHLCV(ex, ticker, interval, isFuture);

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
module.exports = rsi;
