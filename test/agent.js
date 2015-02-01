'use strict';
/*global sinon: true*/

describe('Agent',function(){

    var Agent = require('../lib/agent');

    it('Should be an instance of Agent',function(done){
        expect(new Agent()).to.be.an.instanceOf(Agent);
        done();
    });

    it('Should have a bunyan logger',function(done){
        expect(new Agent().logger).to.exist;
        done();
    });

    it('Should check that the argument must be an object',function(done){
        var agent = new Agent(function(){});
        expect(agent.opts).to.be.an('object');
        done();
    });

    it('Should throw error if something went wrong',function(done){
        var agent = new Agent(function(){});
        agent.collectStats = null;

        try {
            agent.start();
        }catch(err){
            expect(err).to.exist();
        }
        done();
    });

    it('Should send stats using coap transport',function(done){
        var coap = require('coap');
        var server;

        server = coap.createServer();
        server.on('request', function(req, res) {
            console.log('\tRequest payload: '+ req.payload);
            res.end(req.payload + '\n');
            server.close();
            done();
        });
        server.listen();

        var agent = new Agent(function(){});
        agent.start();

    });

});