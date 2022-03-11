const user = [];

//join user to chat
function userjoined(id, username, chatroom) {
    const users = { id, username, chatroom };
    user.push(users);
    return users;
}

//get current user
function getuser(id) {
    return user.find(users => users.id === id);
}

//user left
function userleft(id) {
    const index = user.findIndex(users => users.id === id);

    if (index !== -1) {
        return user.splice(index, 1)[0];
    }
}

//get room users
function getroom(chatroom) {
    return user.filter(users => users.chatroom === chatroom);
}

module.exports = {
    userjoined,
    getuser,
    userleft,
    getroom
};