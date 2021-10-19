const router = require('express').Router();
const verify = require('../tokenVerify');

router.get('/', verify, (req, res) => {

    res.send("HELLO!This is my first blog.Glad you liked it:).");
    // res.send(req.user);
});
// here verify is the Middleware function that we have created.It is used for token accessing for private routes:).








module.exports = router;