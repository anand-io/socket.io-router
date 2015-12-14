var read = require('fs').readFileSync;
var Response = require('./response');

function SocketIORouter(server) {

    var _self = this;

    var clientSource = read(require.resolve('socket.io-router-client/build/socket.io-router.js'), 'utf-8');
    attachClient(clientSource);

    if (!(this instanceof SocketIORouter))
        return new SocketIORouter();

    function router(socket, next) {
        middleware(socket);
        next();
    }

    router.routes = {};

    function middleware(socket) {
        socket.on('socket io route req res 3535', function(req) {
            var res = new Response(req.requestId, socket);
            req.socket = socket;
            notify(req, res);
        });
    }

    function notify(req, res) {
        var callbacks = router.routes[req.route];
        if (callbacks && callbacks.length !== 0) {
            callbacks.forEach(function(callback) {
                callback(req, res);
            });
        } else {
            res.status(404).send("Route not found");
        }
    }

    function attachClient() {
        if (this.clientAttached)
            return;
        attachServe(server);
        this.clientAttached = true;
    }

    function attachServe(srv) {
        var url = '/socket.io-router/socket.io-router.js';
        var evs = srv.listeners('request').slice(0);

        var self = this;
        srv.removeAllListeners('request');
        srv.on('request', function(req, res) {
            if (0 === req.url.indexOf(url)) {
                serve(req, res);
            } else {
                for (var i = 0; i < evs.length; i++) {
                    evs[i].call(srv, req, res);
                }
            }
        });
    }

    function serve(req, res) {
        var etag = req.headers['if-none-match'];
        res.setHeader('Content-Type', 'application/javascript');
        res.writeHead(200);
        res.end(clientSource);
    }

    router.__proto__ = SocketIORouter.prototype;

    return router;

}

SocketIORouter.prototype.on = function(route, callback) {
    if (this.routes[route]) {
        this.routes[route].push(callback);
    } else {
        this.routes[route] = [callback];
    }
};

// function SocketIORouterFactory () {
//     if (!(this instance of SocketIORouterFactory))
//         return new SocketIORouter();
// }

module.exports = SocketIORouter;
