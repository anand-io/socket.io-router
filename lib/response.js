function Response(requestId, socket) {
    var _self = this;

    var response = {status: 200};

    response.requestId = requestId;

    _self.status = function(status) {
        response.status = status;
        return _self;
    };

    _self.send = function(data) {
        response.body = data;
        socket.emit('socket io route req res 3535', response);
    };
}

module.exports = Response;
