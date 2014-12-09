var helpers = require('./helpers');
var interpolate = require('interpolate');

var TinkrClient = require('../tinkr-client');


exports.command = 'remove-project [name]';

exports.action = helpers.mustHaveRemotes(
    helpers.mustSpecifyRemote(function (name, program) {
        helpers.forEachRemoteTarget(program.parent, 
            helpers.withTinkrClient(function (client) {
                client.removeProject(name, function () {
                    console.log(interpolate('[{client.remote}] {name} removed.', {
                        name: name,
                        client: client
                    }));
                });
            })
        )
    })
);
