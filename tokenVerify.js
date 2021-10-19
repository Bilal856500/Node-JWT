const jwt = require('jsonwebtoken');
// here we have created a function that will work as a Middleware for the private routes that we 
// would set.Private routes data cannot be accessed without having an access jwt token.first we check if
// have a token in the header file.after this we will verify that token and after successful completion
// of these 2 steps we grant access to private routes....

module.exports = function(req, res, next) {
    const token = req.header('authorized-token');
    if (!token) return res.status(401).send("ACCESS DENIED!");
    try {
        const verify = jwt.verify(token, process.env.WEB_TOKEN);
        // this statement will throw us with username
        req.user = verify;
        console.log(req);
        next();


    } catch (err) {
        res.status(400).send("token is invalid");

    }
}