const router = require('express').Router();
// const Users = require('../Models/Users');
const verify = require('../tokenVerify');

router.get('/', verify, async(req, res) => {
    // const user = Users.findOne(req.user.username);
    // res.send(user)

    // const user = await Users.find(req.user).select('-password');
    // res.send(user)

    res.send("HELLO!This is my first blog.Glad you liked it:).");

});

router.get('/:name', (req, res) => {


        res.send('you are watching ' + req.params.name);
    })
    // // here verify is the Middleware function that we have created.It is used for token accessing for private routes:).








module.exports = router;