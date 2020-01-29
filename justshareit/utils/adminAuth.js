/**
 * Inspired from
 * https://nodejs.org/api/os.html#os_os_networkinterfaces
 */

var os = require('os');

module.exports = function adminAuth() {
    var interfaces = os.networkInterfaces();
    var addresses = [];
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }

    return addresses;
}