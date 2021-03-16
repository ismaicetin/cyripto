// const config = require('./config');
// var path = require("path");
// var fs = require("fs");
// const config = require("./config");
// const userModel = require("./models/userModel");
// const jwt = require("jsonwebtoken");

// let publicUrl = ["/", "/doc", "/auth", "/ddd"];

exports.ResponseModify = (req, res, next) => {
	req.returnTemplate = function returnJson(data, message, status = 200) {
		let responseTemplate = {
			status: status,
			data: data,
			message: message,
		};
		res.status(200).json(responseTemplate);
	};
	next();
};

// exports.TokenKontrol = (req, res, next) => {
// 	//public url kontrolü
// 	for (let index = 0; index < publicUrl.length; index++) {
// 		if (publicUrl[index] === req.url) {
// 			return next();
// 		}
// 	}

// 	let token = req.headers["x-access-token"] || req.headers["authorization"] || req.headers["Authorization"];
// 	if (!token) {
// 		return req.returnTemplate(false, "Token YOK Lütfen Giriş Yapınız", httpResult.error);
// 	}

// 	if (token) {
// 		jwt.verify(token, config.secret, (err, decoded) => {
// 			if (err) {
// 				return req.returnTemplate([], "Token Geçerli Degil Lütfen Tekrar Giriş Yapınız.", httpResult.error);
// 			} else {
// 				userModel
// 					.findById(decoded._id)
// 					.then((user) => {
// 						if (user) {
// 							req.headers["user"] = user._id;
// 							req.TokenUser = user;
// 							req.decoded = decoded;
// 							next();
// 						} else {
// 							return req.returnTemplate(
// 								[],
// 								"Token Geçerli Kullanıcı Bulununamadı Lütfen bilgilerinizi Kontrol Ediniz.",
// 								httpResult.error
// 							);
// 						}
// 					})
// 					.catch((err) => next(err));
// 			}
// 		});
// 	} else {
// 		return req.returnTemplate([], "Token YOK Lütfen Giriş Yapınız", httpResult.error);
// 	}
// };
