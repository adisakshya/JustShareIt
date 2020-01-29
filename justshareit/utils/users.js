class Users {
    constructor() {
        this.users = [];
    }
    addUser(id, name, request) {
        var user = { id, name, request };
        this.users.push(user);
        return user;
    }
    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }
    getRequestStatus(id) {
        return this.users.filter((user) => user.id === id && user.request === true)[0];
    }
    removeUser(id) {
        var user = this.getUser(id);

        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }

        return user;
    }
    getUserList() {
        var namesArray = this.users.map((user) => user.name);

        return namesArray;
    }
}

module.exports = { Users };
