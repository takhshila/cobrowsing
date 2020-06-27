import express from 'express'
import path from 'path'
import http from 'http'
import socketIo from "socket.io"
import socket from "./socketio"

const PORT = process.env.PORT || 80
const IP = "0.0.0.0"
const app = express()
const router = express.Router()

router.use('/assets', express.static(path.resolve('./build/assets')))
router.use('/static', express.static(path.resolve('./build/static')))
router.get("/*", (req, res) => {
    // res.send({ response: "It's Working" }).status(200);
    res.sendFile(path.join(__dirname + '/build/index.html'));
})

app.use(router)
const server = http.createServer(app);
const io = socketIo(server)
socket(io)

// Start server
server.listen(PORT, IP, () => {
    console.log('Express server listening on port %d', PORT);
})

// Expose app
exports = module.exports = app;