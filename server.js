// const express = require("express");
// const http = require("http");
// const app = express();
// const server = http.createServer(app);
// const socket = require("socket.io");
// const io = socket(server);

// const rooms = {};

// io.on("connection", socket => {         //when a person finally actually connects to our socket.io server, this connection generate the socket object for this individual person.
//    socket.on("join room", roomID => {   // (we're gonna be pulling the room I'd the out of the URl and then sending down to the server)attach an event listener object particular socket set that's gonna be called join room , this j.r will get fired off withtin the client side
//        if(rooms[roomId]) {              // server's goona do is have  a basic check if the room's our room ID
//            rooms[roomID].push(socket.id);   //we already have a user with a socket with a socket ID now the new person is just joined to take their stock gonna be and push it as well into that same array
//        }
//        else {
//            rooms[roomID] = [socket.id];    // however if this room doesn't yet exist what we're gonna do good and do is say rooms of room of these equal to an array with the first socket ID anothe
//        }
//        const otherUser = rooms[roomID].find( id !== socket.id);  // to check is there already somebody else within the room . (inside this array an id that is not my own)
//        if (otherUser) {           // (check if other user exist then) I need to kind of know who I.m trying to call by sending my offer to them .
//            socket.emit("other user", otherUser);      // we're gonna emit an event to back to ourselves with the event called other user which tells us that yes there is another user right there and here is it's userid.
//            socket.to(otherUser).emit("user joined", socket.id); // and to other user that somebody  else's joint and this is their user Id.
//        }
//    });
//    // we need to actually facilate the handshake between the two pairs.

//    socket.on("offer", payload => {     // create an event called offer, when the offer events get fired the we'r going the accept the payload as an argument
//        io.to(payload.target).emit("offer", payload); // I'm B trying to call user A. taget->socket.id of A, payload-> my Id, offer that Im trying to send to the user.
//    })

//    socket.on("answer", payload => {
//        io.to(payload.target).emit('answer',payload); //target-> who we're trying to send the event to, payload->actual answer data that we need to send back to the calling peer.
//    })

//    socket.on ("ice-candidate", incoming => {
//        io.to(incoming.target).emit("ice-candidate", incoming.candidate);
//    })

// })




// server.listen(8000, () => console.log('server is running on port 8000'));

//require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
const cors = require("cors");

const rooms = {};

app.use(cors());

io.on("connection", socket => {
    socket.on("join room", roomID => {
        if (rooms[roomID]) {
            rooms[roomID].push(socket.id);
        } else {
            rooms[roomID] = [socket.id];
        }
        const otherUser = rooms[roomID].find(id => id !== socket.id);
        if (otherUser) {
            socket.emit("other user", otherUser);
            socket.to(otherUser).emit("user joined", socket.id);
        }
    });

    socket.on("offer", payload => {
        io.to(payload.target).emit("offer", payload);
    });

    socket.on("answer", payload => {
        io.to(payload.target).emit("answer", payload);
    });

    socket.on("ice-candidate", incoming => {
        io.to(incoming.target).emit("ice-candidate", incoming.candidate);
    });
});

if (process.env.PROD) {
    app.use(express.static((__dirname+'/client/build')));
    app.get('*', (req, res) => {
        res.sendFile((__dirname+'/client/build/index.html'));
    });
}


const port = process.env.PORT || 8000;
server.listen(port, () => console.log('server is running on port 8000'));