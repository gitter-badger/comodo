
var Agent = require('./lib/agent');

function start(opts,cb){
    var agent =  new Agent();
    agent.start(opts,cb);
}

start();

module.exports.start = start;