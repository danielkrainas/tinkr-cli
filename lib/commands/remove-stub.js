var interpolate = require('interpolate');

var helpers = require('./helpers');
var TinkrClient = require('../tinkr-client');


exports.command = 'remove-stub [name]';

exports.action = helpers.mustHaveRemotes(
    helpers.mustSpecifyRemote(function (name, program) {
        helpers.forEachRemoteTarget(program.parent, 
            helpers.withTinkrClient(function (client) {
                client.removeStub(name, function () {
                    console.log(interpolate('[{client.remote}] {stub} removed.', { stub: name, client: client }));
                });
            })
        )
    })
);
