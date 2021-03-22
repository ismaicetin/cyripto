var WebSocketServer = require("ws").Server,
	wss = new WebSocketServer({ port: 3001 });
// wss.on("connection", function (ws, req) {
// 	console.log("connn WebSocketServer", ws, req);
// 	ws.on("message", function (message) {
// 		console.log("received: %s", message);
// 	});

// 	// setInterval(() => ws.send(`${JSON.stringify({ id: 8 })}`), 1000);
// });

exports.sendWSData = (data) => {
	wss.on("connection", function (ws, req) {
		ws.send(`${JSON.stringify(data)}`);
	});
};
