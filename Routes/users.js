const router = require('express').Router();
const User = require('../Models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../validation');

router.post('/register', async (req, res) => {
	// validate the data before we make a User
	const {error} = registerValidation(req.body);
	if (error) return res.status(400).json({error: error.details[0].message});

	// check if email and username exists in the database

	const emailExist = await User.findOne({email: req.body.email});
	const usernameExist = await User.findOne({username: req.body.username});
	if (emailExist || usernameExist) return res.status(400).json("email or username already exists");
	// if (usernameExist) return res.status(400).json("username already exists");
	// Hashing password using bcryptjs.First we add a salt.Salt is basically a prefix of mixed string with password.//
	const salt = await bcrypt.genSalt(10);
	console.log(salt);

	// Now we will use hashing using bcrypt.
	const hashPassword = await bcrypt.hash(req.body.password, salt);
	// Creating a New User
	const user = new User({
		username: req.body.username,
		email: req.body.email,
		password: hashPassword,
		address: req.body.address,
	})
	try {
		const userSaved = await user.save();
		res.json({user: user._id});
	} catch (err) {
		res.status(400).json(err);
	}
});

// Logging a User

router.post('/login', async (req, res) => {
	const {error} = loginValidation(req.body);
	if (error) return res.status(400).json(error.details[0].message);
	// check if email exists in the database
	const user = await User.findOne({email: req.body.email});
	if (!user) return res.status(400).json("email is not found!");
	// compare password that is stored in the database and password that user types in req.body//
	const validPassword = await bcrypt.compare(req.body.password, user.password);
	if (!validPassword) return res.status(400).json("password is incorrect");

	const token = jwt.sign({username: user.username}, process.env.WEB_TOKEN);
	res.header('authorized-token', token).json(token);

	res.json("User Logged In!");
});
//Gets all the Users
router.get('/', async (req, res) => {

	const user = await User.find();
	res.json(user);


});

//Deletes a specific User
router.delete('/:id', async (req, res) => {
	const removedUser = await User.deleteOne({_id: req.params.id});
	res.json(removedUser);
});

// Updates A User 
router.patch('/:id', async (req, res) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(req.body.password, salt);
		const updatedUser = await User.updateOne({_id: req.params.id}, {
			$set: {
				username: req.body.username,
				password: hashPassword
			}
		});
		res.json(updatedUser);
		// console.log("hell0")
	} catch (err) {
		res.json({message: err});
	}

});

module.exports = router;