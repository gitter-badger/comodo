/*
 Copyright (c) 2015 Matteo Murgida

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

var async = require('async');
var bunyan = require('bunyan');


function Agent(opts){

    if (!(this instanceof Agent)) {
        return new Agent(opts);
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

    //for(transport in that.transports){
    //
    //}

    cb();
};



module.exports = Agent;