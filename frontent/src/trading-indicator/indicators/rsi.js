// const getOHLCV = require("./ohlcv.js");
// const detachSource = require("./source.js");
import getOHLCV from "./ohlcv.js";
import detachSource from "./source.js";
const indicators = require("technicalindicators");
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
export default rsi;
