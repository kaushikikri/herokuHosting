const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { formatmsg, formatlocation } = require('./utils/msg');
const { userjoined, getuser, userleft, getroom } = require('./utils/user');


const app = express();
const server = http.createServer(app);


const io = socketio(server);
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));


//Creating a conection i.e socket.io instance
io.on('connection', socket => {

    //listening  whenever user join room
    socket.on('join-room', ({ username, chatroom }) => {
        const user = userjoined(socket.id, username, chatroom);
        socket.join(user.chatroom);
        //event emition to display msg when user joined
        socket.emit('message', formatmsg('Admin', `Welcome to ${user.chatroom}`));

        //event broadcasting 
        socket.broadcast.to(user.chatroom).emit('message', formatmsg('Admin', `${user.username} has joined ${user.chatroom}`));
        io.to(user.chatroom).emit('roomuser', { chatroom: user.chatroom, user: getroom(user.chatroom) });

    })

    // listening to new-user-joined event i.e whenever user joined
    // socket.on('new-user-joined', data => {
    //     users[socket.id] = data.name;
    // roomname = data.room;
    // console.log(users.username);
    // })

    //getting msg
    socket.on('chatmsg', (msg) => {
        const user = getuser(socket.id);
        io.to(user.chatroom).emit('message', formatmsg(user.username, msg));
    })


    //getting location
    socket.on('location', (coords) => {
        // console.log(coords.lat)
        const user = getuser(socket.id);
        io.to(user.chatroom).emit('locationmsg', formatlocation(user.username, coords.lat, coords.lng))
    });


    //getting disconected users
    socket.on('disconnect', () => {
        const user = userleft(socket.id);
        if (user) {
            io.to(user.chatroom).emit('message', formatmsg('Admin', `${user.username} has left ${user.chatroom}`));
            io.to(user.chatroom).emit('roomuser', { chatroom: user.chatroom, user: getroom(user.chatroom) });
        }
    })

})

server.listen(port, (res) => {
    console.log(`Listening at ${port}`);
})