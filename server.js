const Koa = require('koa')
const koaStatic = require('koa-static')
const ClusterWS = require('clusterws').ClusterWS

// Create ClusterWS with 2 workers (why 2 just for this example usually you will get amount of cpus)
let cws = new ClusterWS({
    worker: Worker,
    workers: 2,
    port: process.env.PORT || 80
})

// Our worker code
function Worker() {
    const httpServer = this.httpServer
    const socketServer = this.socketServer

    // Koa logic
    let app = new Koa()
    app.use(koaStatic('public'))
    
    // Connect ClusterWS http handler and Koa module
    httpServer.on('request', app.callback())

    // Socket part (listen on connection to the socket)
    socketServer.on('connection', (socket) => {
        // On connection publish message that user is connected to everyone who is subscribed to chat channel
        socketServer.publish('chat', { id: 'global', text: 'New user is connected to the chat' })
        
        // On disconnect  send everyone that user is disconnected
        socket.on('disconnect', () => {
            socketServer.publish('chat', { id: 'global', text: 'User is disconnected' })
        })
    })
}