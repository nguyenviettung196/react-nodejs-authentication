const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

// define model
const userSchema = new Schema({
	email: {
		type: String,
		required: [true, "Must have user email"],
		unique: true,
		lowercase: true,
	},
	password: {
		type: String,
		required: [true, "Must have password"],
	},
});
// on save hook , ecrypt password
// before saving a model,run this function
userSchema.pre("save", function (next) {
	const user = this;
	//generate a salt then run callback
	bcrypt.genSalt(10, (err, salt) => {
		if (err) return next(err);
		//hash password using the salt
		bcrypt.hash(user.password, salt, null, (err, hash) => {
			if (err) {
				return next(err);
			}
			//overwrite plain text password with encrypted password
			user.password = hash;
			console.log("hash:", user.password);
			next();
		});
	});
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
		if (err) {
			return callback(err);
		}
		callback(null, isMatch);
	});
};

//create the model class
const User = mongoose.model("user", userSchema);
//export the model
module.exports = User;
