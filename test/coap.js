'use strict';
/*global sinon: true*/

var coap = require('coap');


describe('CoapTransport',function(){

    var CoapTransport = require('../lib/coap');
    var server;

    beforeEach(function(done) {
        server = coap.createServer();
        server.on('request', function(req, res) {
            res.end(req.payload + '\n');
        });
        server.listen(done);
    });

    afterEach(function(done) {
        server.close();
        done();
    });

    it('Should send a message to the coap Server',function(done){

        var ct = new CoapTransport();
        var message = {test:'test'};
        ct.sendMessage(message,{topic:'test'},function(err,res){
            expect(err).to.be.null;
            expect(JSON.stringify(JSON.parse(res.payload))).to.have.string(JSON.stringify(message));
            done();
        });


    });

});