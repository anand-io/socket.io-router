# socket.io-router
Middleware for socket.io

# How to use

```javascript
var server = require('http').createServer();
var io = require('socket.io')(server);
var ioRouter = require('socket.io-router')(server);
ioRouter.on('/helloworld', function(req, res) {
  res.status(200).send(req.params);
});
io.use(ioRouter);
server.listen(3000);
```

## Client

Load client 

```<script type="text/javascript"  src="/socket.io/socket.io.js"></script>```
```<script type="text/javascript"  src="/socket.io-router/socket.io-router.js"></script>```

```javascript
ioRouter(io);
var socket = io();
var promise = socket.request('/test', testData);
promise.then(function(res){
  // got response successfully.
}, function() {
  // request failed.
});
```


