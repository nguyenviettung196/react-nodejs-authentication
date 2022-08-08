const User = require("../model/user");
const jwt = require("jwt-simple");
const config = require("../config");

function tokenForUser(user) {
	const timestamp = new Date().getTime();
	return jwt.encode(
		// convention of json web token
		{
			sub: user.id, // subject : who know who does this token belong to.
			iat: timestamp, // issued at time
		},
		config.secret
	);
}

exports.signup = async (req, res, next) => {
	console.log(req.body);
	const email = req.body.email;
	const password = req.body.password;
	if (!email || !password) {
		return res.status(422).json({
			error: "you must provide email and password",
		});
	}
	// see if a user with the given email exist
	User.findOne({ email: email }, (err, existingUser) => {
		if (err) {
			return next(err);
		}
		// if a user with email does exist,throw an error
		if (existingUser) {
			return res.status(422).json({
				error: "Email is in use",
			});
		}
		// if email does not exist,create and save record
		const user = new User({
			email: email,
			password: password,
		});
		user.save(function (err) {
			if (err) {
				return next(err);
			}
			// respond to request
			res.status(200).json({
				status: "success",
				data: user,
				token: tokenForUser(user),
			});
		});
		// console.log("password after save:", user.password);
	});
};

exports.signin = async function (req, res, next) {
	//User has already had email and password auth'd
	//give a token
	try {
		res.send({ token: tokenForUser(req.user) });
	} catch (error) {
		res.status(400).json({
			status: "fail",
			message: error,
		});
	}
};
