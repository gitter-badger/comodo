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

var coap = require('coap');

function CoapTransport(opts){

    if(!(this instanceof CoapTransport)){
        return new CoapTransport(opts);
    }

    var that  = this;

    if(!opts){
        opts = {};
    }

    that.serverHost = opts.serverHost || 'localhost';
    that.serverPort = opts.serverPort || 5683;

}

CoapTransport.prototype.sendMessage = function(message,opts,cb){
    var that = this;

    if(!opts || !opts.topic){
        throw new Error('Coap sendMessage requires opts.topic to be passed');
    }
    if(!cb){
        cb = function(){};
    }

    var msg;

    if(typeof message === 'string' || (message instanceof String)){
        msg = message;
    }else{
        msg = JSON.stringify(message);
    }


    var req = coap.request({
        hostname: that.serverHost,
        port: that.serverPort,
        query: opts.topic,
        method: 'POST'
    }).on('response', function(res) {
        res.on('data',function(data){});
        res.on('end', function () {
            cb(null,res);
        });
    });


    req.end(msg);


};

module.exports = CoapTransport;