'use strict';

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
        opts = {};
    }

    if (!opts) {
        opts = {};
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

Agent.prototype.go = function(cb){
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
            if(that.started && that.opts.samplesRate > 0){
                setTimeout(function(){
                    that.go(cb);
                },that.opts.samplesRate);
            }
            cb(results);
        }else{
            cb(err);
        }
    });

};

Agent.prototype.start = function(cb){
    var that = this;
    that.started = true;
    that.go(cb);
};


Agent.prototype.collectStats = function(cb){
    var that = this;

    // Memory usage
    that.stats.memory = {};
    that.stats.memory.heapUsed = process.memoryUsage().heapUsed;
    that.stats.memory.heapTotal = process.memoryUsage().heapTotal;

    cb();
};

Agent.prototype.publishStats = function(cb){
    var that = this;
    that.logger.info(that.stats.memory);
    cb();
};



module.exports = Agent;