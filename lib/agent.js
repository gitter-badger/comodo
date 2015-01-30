/**
 * Created by teomurgi on 27/01/15.
 */

var async = require('async');
var bunyan = require('bunyan');


function Agent(opts){

    if (!(this instanceof Agent)) {
        return new Agent();
    }

    var that = this;

    /**
     * check input
     */
    if (typeof opts === 'function') {
        cb = opts
        opts = {}
    }

    if (!opts) {
        opts = {}
    }

    if(typeof cb === 'undefined'){
        cb = function(err){};
    }

    /**
     * set defaults
     */
    opts.samplesRate = opts.samplesRate || 1000;

    /**
     * store options
     */
    that.opts = opts;
    that.stats = {};

    that.logger = bunyan.createLogger({
        name: "Agent",
        level: opts.logLevel
    });
}

Agent.prototype.go = function(){
    var that = this;


    async.series([
        function(callback){
            that.collectStats(callback);
        },
        function(callback){
            that.publishStats(callback);
        },
    ], function (err, results) {
        if(!err){
            if(that.started){
                setTimeout(function(){
                    that.go();
                },1000);
            }
        }
    });

}

Agent.prototype.start = function(cb){
    var that = this;
    that.started = true;
    that.go();
};


Agent.prototype.collectStats = function(cb){
    var that = this;
    this.stats.memory = process.memoryUsage();
    cb();
};

Agent.prototype.publishStats = function(cb){
    var that = this;
    that.logger.info(this.stats.memory);
    cb();
};



module.exports = Agent;