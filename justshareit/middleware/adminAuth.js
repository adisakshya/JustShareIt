const { localIPv4Addresses } = require('../lib/network');

/**
 * Middleware for admin authentication
 *
 * The admin surface is for whoever is running the server, so the caller is
 * admitted when the request came from one of this machine's own LAN addresses.
 *
 * Exactly one of next()/res.render() runs, whatever the host looks like. The
 * previous version compared inside a per-interface loop, so a machine with two
 * external IPv4 addresses — an Ethernet link and a Docker bridge is enough, and
 * that is an ordinary developer laptop — could call next() for one and then
 * res.render() for the other, which is an ERR_HTTP_HEADERS_SENT after the
 * request has already been handed on. A host with no external IPv4 at all ran
 * neither and left the connection open with no response.
 */
module.exports = async function (req, res, next) {
    var ip = req.ip || 
            req.headers['x-forwarded-for'] || 
            req.connection.remoteAddress || 
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    
    var ip_array = ip.split(':');
    ip = ip_array[ip_array.length - 1];

    if (localIPv4Addresses().indexOf(ip) !== -1) {
        return next();
    }
    return res.render('error', {'message':'Your are not authorized to access this page.'});
}
