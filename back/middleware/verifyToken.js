const jwt = require('jsonwebtoken')

module.exports = function auth(req, res, next) {

    //Checking if the token exist
    const token = req.headers.authorization.split(' ')[1]
    if(!token) return res.status(401).send('Access Denied')

    //Verify the token
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified;
        next()
    } catch(err) {
        res.status(400).send('Invalid Token')
    }
}