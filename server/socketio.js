let clientList = []
const onConnect = (socket) => {
    console.log('[%s] CONNECTED', socket.handshake.address)
    
    socket.on('join', (body, cb) => {
        socket.userId = body.userId
        clientList.push({
            socket
        })
        if (cb) {
            cb({ sucess: true })
        }
    })
    
    socket.on('textAreaChange', (body, cb) => {
        const { userId, data } = body
        clientList.forEach(client => {
            if(client.socket.userId !== userId) {
                client.socket.emit("textAreaChangeResponse", { data })
            }
        })
        if (cb) {
            cb({ sucess: true})
        }
    })
}

const onDisconnect = (socket) => {
    console.log('[%s] DISCONNECTED', socket.userId)
    clientList = clientList.filter(client => client.socket.userId != socket.userId)
}

const getApiAndEmit = socket => {
    const response = new Date();
    // Emitting a new message. Will be consumed by the client
    socket.emit("FromAPI", response);
};

module.exports = function (socketio) {
    // socketio.use(require('socketio-jwt').authorize({
    //     secret: config.secrets.session,
    //     handshake: true
    // }));

    socketio.on('connection', function (socket) {
        // socket.address = socket.handshake.address !== null ?
        //     socket.handshake.address.address + ':' + socket.handshake.address.port :
        //     process.env.DOMAIN;

        // socket.connectedAt = new Date();

        // Call onDisconnect.
        socket.on('disconnect', function () {
            onDisconnect(socket)
        });

        onConnect(socket);
    });
};