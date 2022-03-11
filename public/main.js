const socket = io();
const chatform = document.getElementById('chat-form');
const chatmsges = document.querySelector('.chat-box');
const roomname = document.getElementById('room-name');
const userinroom = document.getElementById('users');

//getting username and room name from url
const { username, chatroom } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})


//emit join-room event whenever user join the chatroom
socket.emit('join-room', { username, chatroom });


//users and room info
socket.on('roomuser', ({ chatroom, user }) => {
    outputroom(chatroom);
    outputuser(user);
})



//listens to broadcasting and io.emit events
socket.on('message', message => {
    outputmsg(message);
    chatmsges.scrollTop = chatmsges.scrollHeight;     //make latest msg visible above enter msg input box
})

//broadcasting location
socket.on('locationmsg', message => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="sender">${message.username} <span>${message.time}</span></p>
    <p>My location</p>
<a class="text" href="${message.url}" target="_blank">
${message.url}
</p>`;
    document.querySelector('.chat-box').appendChild(div);
})

//event listener whenever form submits
chatform.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    socket.emit('chatmsg', msg);                  //sending event whenever user send a msg
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
})


//function to manipulate DOM for msg sending
function outputmsg(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="sender">${message.username} <span>${message.time}</span></p>
<p class="text">
${message.text}
</p>`;
    document.querySelector('.chat-box').appendChild(div);
}


//function to manipulate DOM for room names
function outputroom(room) {
    roomname.innerText = room;
}


//function to manipulate DOM for users
function outputuser(user) {
    userinroom.innerHTML = '';
    user.forEach((users) => {
        const li = document.createElement('li');
        li.innerHTML = users.username;
        userinroom.appendChild(li);
    });
}


//location sharing
document.querySelector('#location').addEventListener('click', function (e) {
    e.preventDefault();
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported');
    }
    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('location', {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        })
        // console.log(position);
    }, function () {
        alert('Unable to fetch position');
    })
})

// socket.emit('new-user-joined', { name: username, room: chatroom });
// socket.on('user-joined', info => {
//     // console.log(info.nm);
//     // console.log(current.toLocaleTimeString());
//     outputmsg(`${info} joined`, info);
// })