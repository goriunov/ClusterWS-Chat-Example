let Koa = require('koa')
let static = require('koa-static')
let ClusterWS = require('clusterws').ClusterWS

// We create new ClusterWS instance
// with 2 workers (you can put as many as you want but usualy you should set it to the amount of cpu on your computer)
// you can set port but i am using 80 (default one)
// For more information about options check repo https://github.com/goriunov/ClusterWS
let cws = new ClusterWS({
    worker: Worker,
    workers: 2
})

// Worker function which will be executed in each worker/cluster (place for your logic)
function Worker() {
    var httpServer = this.httpServer
    var socketServer = this.socketServer
    
    // Just using Koa nothing more :)     
    let app = new Koa()
    app.use(static('public'))
    // Bind Koa and ClusterWS (in case of express you should pass just 'app' without callback fn)     
    httpServer.on('request', app.callback())
  
    // Listen on websocket connections to the server      
    socketServer.on('connection', (client) => client.send('id', Math.floor((Math.random() * 10000) + 10000)))
}