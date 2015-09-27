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
