var assert = require("assert");
var http = require('http');
describe('Socket router', function() {
    var app = require('http').createServer(handler);
    var io = require('socket.io')(app);
    var fs = require('fs');
    var socketRouter = require('../lib/index.js')(app);
    var socketClient = require('socket.io-client');
    require('socket.io-router-client')(socketClient);
    app.listen(5000);

    function handler(req, res) {
        return res.end('test router');
    }

    socketRouter.on('/test', function(req, res) {
        res.status(200).send(req.params);
    });

    io.on('connection', function(socket){
        console.log('conncted');
        socket.on('dis', function(){
            socket.disconnect();
        });
    });

    io.use(socketRouter);

    this.timeout(5000);
    var options = {
        transports: ['websocket'],
        'force new connection': true
    };

    var socketCl = socketClient('http://localhost:5000', options);

    before(function(done) {
        // runs before all tests.
        socketCl.on('connect', function() {
            done();
        });
    });

    it('Socket object should have request function.', function() {
        assert(typeof socketCl.request === 'function');
    });

    it('/socket.io-router/socket.io-router.js should have response', function(done) {
        http.get({
            host: 'localhost',
            port: '5000',
            path: '/socket.io-router/socket.io-router.js'
        }, function(response) {
            // Continuously update stream with data
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {
                assert(body);
                done();
            });
        });
    });

    it('Requests should get the coresponding response', function(done) {
        var testData1 = {
            hello: 'hello'
        };
        var testData2 = {
            test: 'test'
        };
        var requestPromise1 = socketCl.request('/test', testData1);
        var requestPromise2 = socketCl.request('/test', testData2);
        Promise.all([requestPromise1, requestPromise2]).then(function(resList) {
            try {
                assert.deepEqual(testData1, resList[0].body);
                assert.deepEqual(testData2, resList[1].body);
            } catch (e) {
                return done(e);
            }
            done();
        }, function(err) {
            console.log(err);
            done(err);
        });
    });

    it('Handle request when socket connection failed', function(done) {
        socketCl.emit('dis');
        var testData = {
            hello: 'hello'
        };

        var requestPromise = socketCl.request('/test', testData);
        requestPromise.then(function(res){
            done('Should not pass');
        }, function() {
            done();
        });
    });
});
