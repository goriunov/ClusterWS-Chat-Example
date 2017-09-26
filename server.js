let Koa = require('koa')
let static = require('koa-static')
let ClusterWS = require('clusterws').ClusterWS

let cws = new ClusterWS({
    worker: Worker,
    workers: 2
})


function Worker() {
    var httpServer = this.httpServer
    var socketServer = this.socketServer

    let app = new Koa()

    app.use(static('public'))

    httpServer.on('request', app.callback())

    socketServer.on('connection', (client) => client.send('id', Math.floor((Math.random() * 10000) + 10000)))
}