const os = require('os');

/**
 * Every non-internal IPv4 address this machine currently has, in the order
 * `os.networkInterfaces()` reports them.
 *
 * Read on each call rather than once at module load: an address can change
 * under the running process (DHCP lease, VPN up or down, cable in or out), and
 * a value captured at require() time is wrong for the rest of the process.
 *
 * Deliberately NOT filtered by interface name. The three call sites here used
 * to look for an interface literally named `Wi-Fi`, which exists only on
 * Windows connected over WiFi — on Linux it is `eth0`/`wlan0`/`enpXsY`, on
 * macOS `en0`, and on Windows over Ethernet `Ethernet`. When nothing matched,
 * the callback body never ran, so no response was ever sent and the request
 * hung until the client gave up.
 */
function localIPv4Addresses() {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    Object.keys(interfaces).forEach(function (name) {
        (interfaces[name] || []).forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                return;
            }
            addresses.push(iface.address);
        });
    });
    return addresses;
}

/**
 * The address to advertise as "this machine on the LAN", or undefined when the
 * host has no external IPv4 at all (offline, or a container with only loopback).
 *
 * Undefined is a real answer and callers must handle it. Returning it is what
 * lets them fail with a message instead of hanging, which is the whole point.
 */
function localIPv4Address() {
    return localIPv4Addresses()[0];
}

module.exports = { localIPv4Addresses, localIPv4Address };
