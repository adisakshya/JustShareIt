const jwt = require('jsonwebtoken');
const qr = require('qr-image');  
const os = require('os');
const ifaces = os.networkInterfaces();

/* Temporary User Store */
const USER_LIMIT = 1;
const { Users } = require('../lib/users');
var users = new Users();

/**
 * 
 * @param {object} req
 * @param {object} res
 */
const loginIndex = (req, res) => {
    return res.render('login', { requested: false });
};

/**
 * 
 * @param {object} req : contain username
 * @param {object} res
 *  
 */
const userRequests = (req, res) => {
    /* Check maximum user limit */
    if(users.getTotalUsers() >= USER_LIMIT) {
      return res.json({
        "success": false,
        "error": true,
        "message": "Admin is currently to busy to handle this request! Please try again after sometime."
      });
    }

    /* GET username */
    var profile = {
      username: req.body.username,
    };

    /* Check if username provided */
    if(!profile.username) {
      return res.json({
        "success": false,
        "error": true,
        "message": "Please provide a username!"
      });
    }

    /* Check for duplicate username */
    if(users.getUser(profile.username)) {
      return res.json({
        "success": false,
        "error": true,
        "message": "User Already Exists! Please choose another username"
      });
    } else {
      /* CREATE new user */
      users.addUser(profile.username);
      
      /* Return response */
      return res.json({
        "success": true,
        "error": false,
        "message": {
          "username": profile.username
        }
      });
    }
};

/**
 * 
 * @param {object} req 
 * @param {object} res 
 */
const usersList = (req, res) => {
    /* Return Response */
    return res.json({
        "success": true,
        "error": false,
        "message": {
          "users": users.getUserList()
        }
      });
};

/**
 * 
 * @param {object} req : contain username
 * @param {object} res 
 */
const approveUser = (req, res) => {
    /* GET username */
    var profile = {
        username: req.body.username,
      };
  
      /* Check if username provided */
      if(!profile.username) {
        return res.json({
          "success": false,
          "error": true,
          "message": "Please provide a username!"
        });
      }
  
      /* CHECK if username exist */
      if(users.getRequestStatus(profile.username)) {
        return res.json({
          "success": true,
          "error": false,
          "message": "User already approved."
        });
      } else if(users.getRequestStatus(profile.username) === -1) {
        return res.json({
          "success": false,
          "error": true,
          "message": "Username doesn't exist!"
        });
      } else {
        /* sending the profile in the token */
        var jwtToken = jwt.sign(profile, 'JUSTSHAREIT_ADMIN_SECRET_KEY');
        /* ADD user token */
        users.updateRequest(profile.username, jwtToken)
        return res.send("User Approved.");
      }
};

/**
 * 
 * @param {object} req : contain username
 * @param {object} res 
 */
const rejectUser = (req, res) => {
    /* GET username */
    var profile = {
      username: req.body.username
    };

    /* Check if username provided */
    if(!profile.username) {
      return res.json({
        "success": false,
        "error": true,
        "message": "Please provide a username!"
      });
    }

    /* CHECK if username exist */
    if(users.getUser(profile.username)) {
      users.removeUser(profile.username);
      return res.send("User Rejected.");
    }
};

/**
 * 
 * @param {object} req : contain username
 * @param {object} res 
 */
const verifyUser = (req, res) => {
    /* GET username */
    var profile = {
      username: req.body.username,
    };

    /* Check if username provided */
    if(!profile.username) {
      return res.json({
        "success": false,
        "error": true,
        "message": "Please provide a username!"
      });
    }

    /* CHECK if username exist or is already verified */
    if(!users.getUser(profile.username)) {
      /* Username not found */
      return res.json({
        "success": false,
        "error": true,
        "message": "Username not found!"
      });
    } 
    
    if(users.getRequestStatus(profile.username)) {
      /* SEND request token */
      return res.json({
        "success": true,
        "error": false,
        "message": {
          "token": users.getUser(profile.username).token,
          "verified": true,
          "username": profile.username
        },
      });
    } else {
      return res.json({
        "success": true,
        "error": false,
        "message": {
          "verified": false
        }
      });
    }
};

/**
 * 
 * @param {object} req : contain username, token
 * @param {object} res 
 */
const clientIndex = (req, res) => {
    /* Get Username */
    var username = req.body.username;
    
    /* Check if username provided */
    if(!username) {
      return res.json({
        "success": false,
        "error": true,
        "message": "Please provide a username!"
      });
    }

    /* If user is verified then render client page */
    if(users.getRequestStatus(username)) {
      return res.render('client');
    } else {
      /* User not verified */
      return res.redirect('/');
    }
};

/**
 * 
 * @param {object} req
 * @param {object} res 
 */
const adminIndex = (req, res) => {
    Object.keys(ifaces).forEach(function (ifname) {
      if(ifname === 'Wi-Fi') {
        ifaces[ifname].forEach(function (iface) {
          if ('IPv4' !== iface.family || iface.internal !== false) {
            return;
          }
          var ip = iface.address;
          var jwtToken = jwt.sign({'ip': ip}, 'JUSTSHAREIT_ADMIN_SECRET_KEY');
          return res.render('admin', { "users": users.getUserList(), "token": jwtToken });
        });
      }
    });
};

/**
 * 
 * @param {object} req
 * @param {object} res 
 */
const qrCode = (req, res) => {
    Object.keys(ifaces).forEach(function (ifname) {
        if(ifname === 'Wi-Fi') {
          ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
              return;
            }
            var code = qr.image(new URL('http://'+iface.address+':3000').toString(), { type: 'svg' });
            res.type('svg');
            code.pipe(res);
          });
          return;
        }
      });
};

exports.loginIndex = loginIndex;
exports.userRequests = userRequests;
exports.usersList = usersList;
exports.approveUser = approveUser;
exports.rejectUser = rejectUser;
exports.verifyUser = verifyUser;
exports.clientIndex = clientIndex;
exports.adminIndex = adminIndex;
exports.qrCode = qrCode;