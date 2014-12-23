var helpers = require('./helpers');
var project = require('../project');
var TinkrClient = require('../tinkr-client');


exports.command = 'env <name> <version> <pair>';

exports.action = helpers.mustHaveRemotes(
    helpers.mustSpecifyRemote(function (name, version, pair, program) {
        var kv = pair.split('=');
        kv = {
            key: kv[0],
            value: kv.length == 2 ? kv[1] : null
        };

        helpers.forEachRemoteTarget(program.parent, 
            helpers.withTinkrClient(function (client) {
                if (!kv.value) {
                    client.delEnvVar(name, version, kv.key, function () {
                        console.log('[' + client.remote + '] ' + name + '#' + version + '::env.' + kv.key + ' deleted.');
                    });
                } else {
                    client.setEnvVar(name, version, kv.key, kv.value, function () {
                        console.log('[' + client.remote + '] ' + name + '#' + version + '::env.' + kv.key + ' set.');
                    });
                }
            })
        );
    })
);
