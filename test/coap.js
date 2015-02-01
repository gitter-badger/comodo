'use strict';
/*global sinon: true*/

var coap = require('coap');


describe('CoapTransport',function(){

    var CoapTransport = require('../lib/coap');
    var server;

    beforeEach(function(done) {
        server = coap.createServer();
        server.on('request', function(req, res) {
            console.log('\tRequest payload: '+ req.payload);
            res.end(req.payload + '\n');
        });
        server.listen(done);
    });

    afterEach(function(done) {
        server.close();
        done();
    });

    it('Should send a message object to the coap Server',function(done){

        var ct = new CoapTransport();
        var message = {test:'test'};
        ct.sendMessage(message,{topic:'test'},function(err,res){
            expect(err).to.be.null;
            expect(JSON.stringify(JSON.parse(res.payload))).to.have.string(JSON.stringify(message));
            done();
        });


    });

    it('Should send a message string to the coap Server',function(done){

        var ct = new CoapTransport();
        var message = "{'test':'test'}";
        ct.sendMessage(message,{topic:'test'});

        done();
    });

    it('Should throw an error if topic is not passed to sendMessage',function(done){
        var ct = new CoapTransport();
        var message = "{test:'test'}";
        try{
            ct.sendMessage(message,null);
        }catch(err){
            done();
        }
    });

});