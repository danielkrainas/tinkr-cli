var interpolate = require('interpolate');

var TinkrClient = require('../tinkr-client');
var helpers = require('./helpers');


exports.command = 'stubs';

exports.action = helpers.mustHaveRemotes(
    helpers.mustSpecifyRemote(
        helpers.orEachRemoteTarget(function (remote) {
            var client = new TinkrClient(remote);
            client.getStubs(function (stubs) {
                console.log(interpolate('[{name}]', remote));
                console.log('Stubs: ');
                stubs.forEach(function (stub) {
                    console.log('-- ' + stub.name);
                });
            });
        })
    )
);
