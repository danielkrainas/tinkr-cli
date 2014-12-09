var helpers = require('./helpers');
var project = require('../project');
var TinkrClient = require('../tinkr-client');


exports.command = 'stop <name>';

exports.action = helpers.mustHaveRemotes(
    helpers.mustSpecifyRemote(function (name, program) {
        helpers.forEachRemoteTarget(program.parent, 
            helpers.withTinkrClient(function (client) {
                client.changeProjectState(name, null, 'stop', function () {
                    console.log('[' + client.remote + '] ' + name + ' stopping.');
                });
            })
        );
    })
);
