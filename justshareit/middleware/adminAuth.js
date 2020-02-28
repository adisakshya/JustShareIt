const os = require('os');
const ifaces = os.networkInterfaces();

/**
 * Middleware for admin authentication
 */
module.exports = async function (req, res, next) {
    var ip = req.ip || 
            req.headers['x-forwarded-for'] || 
            req.connection.remoteAddress || 
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    
    var ip_array = ip.split(':');
    ip = ip_array[ip_array.length - 1];
    
    Object.keys(ifaces).forEach(function (ifname) {
        if(ifname === 'Wi-Fi') {
            ifaces[ifname].forEach(function (iface) {
                if ('IPv4' !== iface.family || iface.internal !== false) {
                    return -1;
                }
                var ipAddr = iface.address;
                
                if(ipAddr === ip) {
                    next();
                } else {
                    res.render('error', {'message':'Your are not authorized to access this page.'});
                }
            });
        }
    });
}
