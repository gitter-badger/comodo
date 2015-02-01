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

    it('Should collect and publish stats',function(done){
        var agent = new Agent({samplesRate:100});

        expect(agent.opts.samplesRate).to.equal(100);

        var cb = sinon.spy();
        agent.start(cb);
        setTimeout(function() {
            expect(cb).to.have.been.callCount(4);
            done();
        }, 350);
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

});