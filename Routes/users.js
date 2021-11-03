const router = require('express').Router();
const User = require('../Models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async(req, res) => {
    // validate the data before we make a User
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if email and username exists in the database

    const emailExist = await User.findOne({ email: req.body.email });
    const usernameExist = await User.findOne({ username: req.body.username });
    if (emailExist) return res.status(400).send("email already exists");
    if (usernameExist) return res.status(400).send("username already exists");
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
        confirmPassword: req.body.confirmPassword,
        isAdmin: req.body.isAdmin

    })
    try {
        const userSaved = await user.save();
        res.send({ user: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
});

// Logging a User

router.post('/login', async(req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // check if email exists in the database
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json("email is not found!");
    // compare password that is stored in the database and password that user types in req.body//
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json("password is incorrect");

    const token = jwt.sign({ username: user.username, id: user._id }, process.env.WEB_TOKEN);
    res.header('authorized-token', token).json({ isAdmin: user.isAdmin, user: user.email, username: user.username });
});
//Gets all the Users
router.get('/', async(req, res) => {

    const user = await User.find();
    res.json(user);


});

//Deletes a specific User
router.delete('/:id', async(req, res) => {
    const removedUser = await User.deleteOne({ _id: req.params.id });
    res.json(removedUser);
});

// Updates A User 
router.patch('/:id', async(req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const updatedUser = await User.updateOne({ _id: req.params.id }, { $set: { username: req.body.username, password: hashPassword, address: req.body.address, email: req.body.email } });
        res.json(updatedUser);
        // console.log("hell0")
    } catch (err) {
        res.json({ message: err });
    }

});


router.get('/users', async(req, res) => {

    let data = req.query
        // let age = req.query.age;
    res.json({ data });
})

router.get('/:email', async(req, res) => {
    try {

        const user = await User.findOne({email:req.params.email});
        res.json(user);
        console.log(user);

    } catch (err) {
        console.log('err',err);
        res.json({ message: err });
    }

})


module.exports = router;