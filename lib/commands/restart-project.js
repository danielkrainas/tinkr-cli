var helpers = require('./helpers');
var project = require('../project');
var TinkrClient = require('../tinkr-client');


exports.command = 'restart <name>';

exports.action = helpers.mustHaveRemotes(
    helpers.mustSpecifyRemote(function (name, program) {
        helpers.forEachRemoteTarget(program.parent, 
            helpers.withTinkrClient(function (client) {
                client.changeProjectState(name, null, 'restart', function () {
                    console.log('[' + client.remote + '] ' + name + ' restarting.');
                });
            })
        );
    })
);
