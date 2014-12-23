var helpers = require('./helpers');
var project = require('../project');
var TinkrClient = require('../tinkr-client');


exports.command = 'removesnapshot <name> <version>';

exports.action = helpers.mustHaveRemotes(
    helpers.mustSpecifyRemote(function (name, version, program) {
        helpers.forEachRemoteTarget(program.parent, 
            helpers.withTinkrClient(function (client) {
                client.removeSnapshot(name, version, function () {
                    console.log('[' + client.remote + '] ' + name + '#' + version + ' removed.');
                });
            })
        );
    })
);
