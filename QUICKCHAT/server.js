const io = require("socket.io")(3000, {
    cors: {
        origin: "*",
    }
});

const users = {}

io.on("connection", socket => {

    socket.on("start-chat", () => {

        users[socket.id] = socket.id;

        function emitUserEvent() {
            let connectedUsers = Object.keys(users).length;
            console.log(connectedUsers);
    
            if (connectedUsers == 1) {
                socket.emit("user", "icon1");
            } else if (connectedUsers == 2) {
                socket.emit("user", "icon2");
            } else if (connectedUsers == 3) {
                socket.emit("user", "icon3");
            } else if (connectedUsers == 4) {
                socket.emit("user", "icon4");
            } else if (connectedUsers == 5) {
                socket.emit("user", "icon5");
            } else if (connectedUsers == 6) {
                socket.emit("user", "icon6");
            } else if (connectedUsers == 7) {
                socket.emit("user", "icon7");
            }
        }
    
        emitUserEvent();
    
        socket.on("new-user", name => {
            users[socket.id] = name;
            console.log(users);
            socket.broadcast.emit("user-joined", name);
        });
    
        socket.on("send-chat-message", message => {
            socket.broadcast.emit("get-chat-message", { message: message.message, name: users[socket.id], usrNo: message.usrNo });
        });
    
        socket.on("disconnect", () => {
            socket.broadcast.emit("user-left", users[socket.id]);
            delete users[socket.id];
            emitUserEvent();
        });
    })
})