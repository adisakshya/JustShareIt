class Users {
    
    /**
     * Constructor
     */
    constructor() {
        this.users = {};
    }
    
    /**
     * CREATE a new user
     * @param {string} username 
     * @param {number} id : Can represent boolean 'false' also
     * @param {Boolean} vstatus : Verification Status
     * @param {string} token : Auth Token
     * @return {object}
     */
    addUser(username, id=false, vstatus=false, token=null) {
        var user = { id, username, vstatus, token };
        this.users[username] = {
            "id": id,
            "vstatus": vstatus,
            "token": token
        }
        return user;
    }
    
    /**
     * GET user details by username
     * @param {string} username
     * @return {object} 
     */
    getUser(username) {
        return this.users[username];
    }

    /**
     * GET user verification status by username
     * @param {string} username 
     * @return {Boolean}
     */
    getRequestStatus(username) {
        var user = this.getUser(username);

        if(user) { 
            return this.users[username].vstatus;
        }

        return false;
    }

    /**
     * UPDATE user verification details
     * @param {string} username 
     * @param {string} token 
     */
    updateRequest(username, token) {
        var user = this.getUser(username);

        if(user && !user.vstatus && !user.token) {
            this.users[username].vstatus = true;
            this.users[username].token = token;
        }

        return user;
    }

    /**
     * REMOVE a user by username
     * @param {string} username 
     */
    removeUser(username) {
        var user = this.getUser(username);

        if (user) {
            delete this.users[username]
        }

        return user;
    }

    /**
     * GET details of all users
     */
    getUserList() {
        var list = {};
        
        Object.keys(this.users).forEach(user => {
            list[user] = this.users[user].vstatus;
        });

        return list;
    }

    /**
     * GET number of users
     */
    getTotalUsers() {
        return Object.keys(this.users).length;
    }
}

module.exports = { Users };