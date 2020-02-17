const jwt = require('jsonwebtoken');

/**
 * Middleware for authentication
 */
module.exports = async function (req, res, next) {
    const token = req.body.token;
    if (!token)
        return res.render('error', { 'message':'Authentication Denied' });
    try {
        const userProfile = await jwt.verify(token, 'JUSTSHAREIT_ADMIN_SECRET_KEY');
        next();
    }
    catch (err) {
        return res.render('error', { 'message':'Authentication Failed' });
    }
}
