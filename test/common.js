var chai = require('chai');
global.expect = chai.expect;

var sinonChai = require("sinon-chai");
chai.use(sinonChai);
global.sinon = require("sinon");